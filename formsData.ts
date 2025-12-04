// Form template interfaces
// Forms are now stored in Firebase Firestore

export interface FieldSection {
  id: string;
  name: string;
  collapsed?: boolean;
  order: number;
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fields: any[];
  sections?: FieldSection[];
  globalDrawColor?: string;
  createdAt: string;
  category?: string;
}

// No static forms - all forms are loaded from Firestore
export const formsData: FormTemplate[] = [];
