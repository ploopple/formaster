// Form service - now just a placeholder
// All form operations are handled by firestoreService in lib/firebase

import { FormTemplate } from '../formsData';

// This service is deprecated - use firestoreService instead
export const formService = {
  getForms: (): FormTemplate[] => {
    console.warn('formService.getForms is deprecated. Use firestoreService.getPublicFormTemplates instead.');
    return [];
  },

  getFormById: (id: string): FormTemplate | undefined => {
    console.warn('formService.getFormById is deprecated. Use firestoreService.getFormTemplate instead.');
    return undefined;
  },

  duplicateForm: (form: FormTemplate): FormTemplate => {
    console.warn('formService.duplicateForm is deprecated. Create a new form via firestoreService instead.');
    return form;
  },

  reset: () => {
    // No-op
  },
};
