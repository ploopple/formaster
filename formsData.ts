// Store all your form configurations here
// Each form should have: fileName (path to PDF in public folder), fields array, and metadata

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
  fileName: string; // Path to PDF in public folder, e.g., "/forms/application.pdf"
  fields: any[]; // FormField array
  sections?: FieldSection[]; // Named sections for grouping fields
  createdAt: string;
  category?: string;
}

export const formsData: FormTemplate[] = [
{
  "id": "e9c2d3b3-db18-43a4-9286-544366ce11eb",
  "title": "Tofes 101",
  "description": "Tofes 101 for job tax",
  "fileName": "/forms/tofes-101.pdf",
  "fields": [
  
  ],
  "createdAt": "2025-11-25T16:47:27.857Z",
  "category": "EDIT_THIS_CATEGORY"
},
];
