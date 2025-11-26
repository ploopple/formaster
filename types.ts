

export enum AppMode {
  UPLOAD = 'UPLOAD',
  EDITOR = 'EDITOR',
  FILL = 'FILL',
}

export type FieldType = 'text' | 'number' | 'radio' | 'checkbox' | 'table' | 'table-row' | 'date' | 'signature' | 'select' | 'textarea';

export type MarkStyle = 'checkmark' | 'x' | 'circle' | 'square' | 'dot' | 'none';

export interface FieldOption {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string; // The value this option represents (e.g., "Yes", "Male")
}

export interface TableColumn {
  id: string;
  header: string;
  type: 'text' | 'number' | 'checkbox' | 'radio' | 'select' | 'date';
  width: number; // Percentage relative to the table width
  options?: string[]; // Options for select/radio types
  dateFormat?: string; // Format for date type (e.g., DD/MM/YYYY)
  spacing?: number; // Spacing/gap around the column cells in pixels
}

export interface TableCell {
    id: string;
    type: 'text' | 'number' | 'checkbox' | 'radio' | 'select' | 'date';
    header?: string; // The header name from the column definition
    x: number; // % relative to Row
    y: number; // % relative to Row
    width: number; // % relative to Row
    height: number; // % relative to Row
    options?: string[]; // Options for select/radio types
    dateFormat?: string; // Format for date type
    spacing?: number; // Spacing/gap around the cell in pixels
}

export interface FieldSection {
  id: string;
  name: string;
  collapsed?: boolean;
  order: number;
}

export interface FormField {
  id: string;
  groupId?: string; // ID to link multiple visual fields to the same data
  sectionId?: string; // ID of the section this field belongs to
  page: number; // 1-based index
  // x, y, width, height are for the main container
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  name: string;
  value: string; // Text content, or selected value(s), or JSON string for Table data
  previewText: string;
  type: FieldType;
  
  // Text Styling
  fontSize: number;
  letterSpacing: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  color?: string; // Hex code for text color
  
  // Visual Styling (The "Box" look)
  backgroundColor?: string; // Hex code
  borderColor?: string; // Hex code
  borderWidth?: number; // Pixels (converted to points for PDF)
  borderRadius?: number; // Pixels
  padding?: number; // Pixels
  opacity?: number; // 0-1 for background

  maxLength?: number;
  dateFormat?: string; // Format pattern for date fields (e.g., DD/MM/YYYY, MM/YYYY)
  dateHideSeparator?: boolean; // Hide the "/" separator when rendering date in PDF
  
  // For number fields: control individual digit positions
  digitPositions?: { x: number; y: number }[]; // Array of x,y offsets for each digit (relative to field)
  
  // Options for Radio/Checkbox groups
  options?: FieldOption[]; 
  
  // Table Specifics
  maxRows?: number;   // The capacity/limit of the table (defines row height)
  filledRows?: number; // The current number of rows visible/active in Fill Mode
  showHeaders?: boolean;
  columns?: TableColumn[];
  cells?: TableCell[]; // For custom table-row templates
  rowIndex?: number; // For explicit table rows: which data index (0, 1, 2) does this visual row represent?
  cellPadding?: number; // Padding inside table cells
  cellGap?: number; // Margin/Gap between table cells

  // Nesting logic
  parentFieldId?: string;
  parentOptionId?: string;
  
  // Visibility
  hidden?: boolean; // Hide the field box in editor mode
  
  // Mark style for radio/checkbox
  markStyle?: MarkStyle; // Style of mark when selected (checkmark, x, circle, etc.)
  
  // Validation rules
  validationRules?: ValidationRule[];
  
  // Document attachment support
  documentRequirement?: DocumentRequirement;
  attachments?: DocumentAttachment[];
}

export interface PDFDimensions {
  width: number;
  height: number;
}

// Validation Types
export type ValidationPattern = 
  | 'email'
  | 'phone'
  | 'israeliId'
  | 'israeliPhone'
  | 'zipCode'
  | 'url'
  | 'alphanumeric'
  | 'lettersOnly'
  | 'numbersOnly'
  | 'custom';

export interface ValidationRule {
  type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'min' | 'max' | 'conditional';
  // For pattern validation
  pattern?: ValidationPattern;
  customPattern?: string; // Regex string for custom patterns
  // For length/value validation
  value?: number;
  // For conditional validation
  dependsOnFieldId?: string;
  dependsOnValue?: string; // Field B required if Field A equals this value
  dependsOnOperator?: 'equals' | 'notEquals' | 'contains' | 'notEmpty';
  // Error message
  message?: string;
}

export interface FieldValidationState {
  isValid: boolean;
  errors: string[];
  touched: boolean;
}

// Document Attachment Types
export interface DocumentAttachment {
  id: string;
  name: string;
  type: string; // MIME type
  size: number;
  dataUrl: string; // Base64 data URL for preview/storage
  uploadedAt: string;
}

export interface DocumentRequirement {
  enabled: boolean; // Whether this field accepts document attachments
  label?: string; // Custom label like "Disability Certificate"
  description?: string; // How to obtain the document
  acceptedTypes?: string[]; // e.g., ['image/*', 'application/pdf']
  maxFiles?: number; // Maximum number of files allowed
  required?: boolean; // Whether at least one document is required
}