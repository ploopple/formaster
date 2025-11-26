import { FormField } from '../types';

export const isFieldVisible = (field: FormField, allFields: FormField[]): boolean => {
  // Base case: No parent, always visible
  if (!field.parentFieldId || !field.parentOptionId) return true;

  // Find parent
  const parent = allFields.find(f => f.id === field.parentFieldId);
  if (!parent) return false; // Orphaned, hide it

  // Recursive step: Check if parent is visible first
  if (!isFieldVisible(parent, allFields)) return false;

  // Check specific logic for this level
  const parentOpt = parent.options?.find(o => o.id === field.parentOptionId);
  if (!parentOpt) return false;

  if (parent.type === 'radio') {
    return parent.value === parentOpt.value;
  } else if (parent.type === 'checkbox') {
    return parent.value.split(',').includes(parentOpt.value);
  }
  
  return false;
};

export const getFieldDepth = (field: FormField, allFields: FormField[]): number => {
  let depth = 0;
  let current = field;
  while (current.parentFieldId) {
    const parent = allFields.find(f => f.id === current.parentFieldId);
    if (!parent) break;
    depth++;
    current = parent;
    // Safety break for cycles (though UI shouldn't allow them)
    if (depth > 50) break;
  }
  return depth;
};