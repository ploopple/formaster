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
  globalDrawColor?: string; // Global color for drawing fields (default: #000000)
  createdAt: string;
  category?: string;
}
