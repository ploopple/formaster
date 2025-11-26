import { FormField, ValidationRule, ValidationPattern, FieldValidationState } from '../types';
import { isFieldVisible } from './formLogic';

// Predefined validation patterns
const VALIDATION_PATTERNS: Record<ValidationPattern, { regex: RegExp; message: string }> = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    message: 'Please enter a valid phone number'
  },
  israeliId: {
    regex: /^[0-9]{9}$/,
    message: 'Israeli ID must be exactly 9 digits'
  },
  israeliPhone: {
    regex: /^0(5[0-9]|[2-4]|[8-9])[0-9]{7}$/,
    message: 'Please enter a valid Israeli phone number'
  },
  zipCode: {
    regex: /^[0-9]{5,7}$/,
    message: 'Please enter a valid zip code'
  },
  url: {
    regex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: 'Please enter a valid URL'
  },
  alphanumeric: {
    regex: /^[a-zA-Z0-9]+$/,
    message: 'Only letters and numbers are allowed'
  },
  lettersOnly: {
    regex: /^[a-zA-Z\u0590-\u05FF\s]+$/,
    message: 'Only letters are allowed'
  },
  numbersOnly: {
    regex: /^[0-9]+$/,
    message: 'Only numbers are allowed'
  },
  custom: {
    regex: /.*/,
    message: 'Invalid format'
  }
};

// Israeli ID validation (Luhn-like algorithm)
export const validateIsraeliId = (id: string): boolean => {
  if (!/^[0-9]{9}$/.test(id)) return false;
  
  const digits = id.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    let digit = digits[i] * ((i % 2) + 1);
    if (digit > 9) digit -= 9;
    sum += digit;
  }
  
  return sum % 10 === 0;
};

// Validate a single rule against a value
const validateRule = (
  rule: ValidationRule,
  value: string,
  field: FormField,
  allFields: FormField[]
): { isValid: boolean; error?: string } => {
  switch (rule.type) {
    case 'required': {
      const isEmpty = !value || value.trim() === '';
      return {
        isValid: !isEmpty,
        error: isEmpty ? (rule.message || `${field.name} is required`) : undefined
      };
    }

    case 'pattern': {
      if (!value) return { isValid: true }; // Skip pattern check if empty (use required for that)
      
      if (rule.pattern === 'israeliId') {
        const isValid = validateIsraeliId(value);
        return {
          isValid,
          error: isValid ? undefined : (rule.message || VALIDATION_PATTERNS.israeliId.message)
        };
      }
      
      let regex: RegExp;
      let defaultMessage: string;
      
      if (rule.pattern === 'custom' && rule.customPattern) {
        try {
          regex = new RegExp(rule.customPattern);
          defaultMessage = rule.message || 'Invalid format';
        } catch {
          return { isValid: true }; // Invalid regex, skip validation
        }
      } else if (rule.pattern && VALIDATION_PATTERNS[rule.pattern]) {
        regex = VALIDATION_PATTERNS[rule.pattern].regex;
        defaultMessage = VALIDATION_PATTERNS[rule.pattern].message;
      } else {
        return { isValid: true };
      }
      
      const isValid = regex.test(value);
      return {
        isValid,
        error: isValid ? undefined : (rule.message || defaultMessage)
      };
    }

    case 'minLength': {
      if (!value || rule.value === undefined) return { isValid: true };
      const isValid = value.length >= rule.value;
      return {
        isValid,
        error: isValid ? undefined : (rule.message || `Minimum ${rule.value} characters required`)
      };
    }

    case 'maxLength': {
      if (!value || rule.value === undefined) return { isValid: true };
      const isValid = value.length <= rule.value;
      return {
        isValid,
        error: isValid ? undefined : (rule.message || `Maximum ${rule.value} characters allowed`)
      };
    }

    case 'min': {
      if (!value || rule.value === undefined) return { isValid: true };
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return { isValid: true };
      const isValid = numValue >= rule.value;
      return {
        isValid,
        error: isValid ? undefined : (rule.message || `Minimum value is ${rule.value}`)
      };
    }

    case 'max': {
      if (!value || rule.value === undefined) return { isValid: true };
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return { isValid: true };
      const isValid = numValue <= rule.value;
      return {
        isValid,
        error: isValid ? undefined : (rule.message || `Maximum value is ${rule.value}`)
      };
    }

    case 'conditional': {
      if (!rule.dependsOnFieldId) return { isValid: true };
      
      const dependentField = allFields.find(f => f.id === rule.dependsOnFieldId);
      if (!dependentField) return { isValid: true };
      
      const dependentValue = dependentField.value || '';
      let conditionMet = false;
      
      switch (rule.dependsOnOperator) {
        case 'equals':
          conditionMet = dependentValue === rule.dependsOnValue;
          break;
        case 'notEquals':
          conditionMet = dependentValue !== rule.dependsOnValue;
          break;
        case 'contains':
          conditionMet = dependentValue.includes(rule.dependsOnValue || '');
          break;
        case 'notEmpty':
          conditionMet = dependentValue.trim() !== '';
          break;
        default:
          conditionMet = dependentValue === rule.dependsOnValue;
      }
      
      // If condition is met, this field becomes required
      if (conditionMet) {
        const isEmpty = !value || value.trim() === '';
        return {
          isValid: !isEmpty,
          error: isEmpty ? (rule.message || `${field.name} is required when ${dependentField.name} ${rule.dependsOnOperator || 'equals'} "${rule.dependsOnValue || 'has value'}"`) : undefined
        };
      }
      
      return { isValid: true };
    }

    default:
      return { isValid: true };
  }
};

// Validate a single field
export const validateField = (
  field: FormField,
  allFields: FormField[]
): FieldValidationState => {
  // Skip validation for invisible fields
  if (!isFieldVisible(field, allFields)) {
    return { isValid: true, errors: [], touched: false };
  }
  
  // Skip validation for fields without rules
  if (!field.validationRules || field.validationRules.length === 0) {
    return { isValid: true, errors: [], touched: false };
  }
  
  const errors: string[] = [];
  
  for (const rule of field.validationRules) {
    const result = validateRule(rule, field.value || '', field, allFields);
    if (!result.isValid && result.error) {
      errors.push(result.error);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    touched: true
  };
};

// Validate all fields
export const validateAllFields = (
  fields: FormField[]
): Map<string, FieldValidationState> => {
  const validationMap = new Map<string, FieldValidationState>();
  
  for (const field of fields) {
    if (field.type === 'table-row') continue; // Skip table rows
    validationMap.set(field.id, validateField(field, fields));
  }
  
  return validationMap;
};

// Check if form is valid
export const isFormValid = (validationMap: Map<string, FieldValidationState>): boolean => {
  for (const state of validationMap.values()) {
    if (!state.isValid) return false;
  }
  return true;
};

// Get validation summary
export const getValidationSummary = (
  validationMap: Map<string, FieldValidationState>,
  fields: FormField[]
): { totalErrors: number; invalidFields: string[] } => {
  const invalidFields: string[] = [];
  let totalErrors = 0;
  
  validationMap.forEach((state, fieldId) => {
    if (!state.isValid) {
      const field = fields.find(f => f.id === fieldId);
      if (field) {
        invalidFields.push(field.name);
        totalErrors += state.errors.length;
      }
    }
  });
  
  return { totalErrors, invalidFields };
};

// Get pattern display name
export const getPatternDisplayName = (pattern: ValidationPattern): string => {
  const names: Record<ValidationPattern, string> = {
    email: 'Email',
    phone: 'Phone Number',
    israeliId: 'Israeli ID (9 digits)',
    israeliPhone: 'Israeli Phone',
    zipCode: 'Zip Code',
    url: 'URL',
    alphanumeric: 'Alphanumeric',
    lettersOnly: 'Letters Only',
    numbersOnly: 'Numbers Only',
    custom: 'Custom Pattern'
  };
  return names[pattern] || pattern;
};
