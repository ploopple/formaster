import { formsData as initialFormsData, FormTemplate } from '../formsData';

// Runtime forms storage (includes initial forms + duplicated forms)
let runtimeForms: FormTemplate[] = [...initialFormsData];

export const formService = {
  // Get all forms
  getForms: (): FormTemplate[] => {
    return runtimeForms;
  },

  // Get a form by ID
  getFormById: (id: string): FormTemplate | undefined => {
    return runtimeForms.find(form => form.id === id);
  },

  // Duplicate a form with new IDs
  duplicateForm: (form: FormTemplate): FormTemplate => {
    const generateId = () => crypto.randomUUID();
    
    // Deep clone the form and regenerate all IDs
    const duplicatedForm: FormTemplate = {
      ...JSON.parse(JSON.stringify(form)),
      id: generateId(),
      title: `${form.title} (Copy)`,
      createdAt: new Date().toISOString(),
      fields: form.fields.map(field => ({
        ...JSON.parse(JSON.stringify(field)),
        id: generateId(),
      })),
    };

    // Add to runtime forms
    runtimeForms = [duplicatedForm, ...runtimeForms];
    
    return duplicatedForm;
  },

  // Reset to initial forms (useful for testing)
  reset: () => {
    runtimeForms = [...initialFormsData];
  },
};
