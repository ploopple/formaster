

export enum AppMode {
  UPLOAD = 'UPLOAD',
  EDITOR = 'EDITOR',
  FILL = 'FILL',
}

export type FieldType = 'text' | 'number' | 'radio' | 'checkbox' | 'table' | 'table-row' | 'date' | 'signature' | 'select' | 'textarea' | 'composite';

// Composite field segment types for inline inputs within text
export type CompositeSegmentType = 'static' | 'text' | 'date' | 'number';

export interface CompositeSegment {
  type: CompositeSegmentType;
  content: string; // For static: the text. For inputs: the field key/name
  placeholder?: string; // Placeholder text for input fields
}

export type MarkStyle = 'checkmark' | 'x' | 'circle' | 'square' | 'dot' | 'none';

export interface FieldOption {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string; // The stored/submitted value (e.g., "yes", "male")
  label?: string; // Display label (defaults to value if not set)
}

// Column type excludes 'table' and 'table-row' - all other field types are allowed
export type TableColumnType = Exclude<FieldType, 'table' | 'table-row'>;

export interface TableColumn {
  id: string;
  name: string; // Column header name
  type: TableColumnType;
  width: number; // Percentage relative to the row width (all columns should sum to 100)
  
  // Text Styling (inherited from field properties)
  fontSize?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  color?: string;
  
  // Visual Styling
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  opacity?: number;
  
  // Type-specific properties
  maxLength?: number; // For text/number
  dateFormat?: string; // For date type
  dateHideSeparator?: boolean; // For date type
  options?: FieldOption[]; // For radio/checkbox/select
  markStyle?: MarkStyle; // For radio/checkbox
  
  // Validation
  validationRules?: ValidationRule[];
}

export interface FieldSection {
  id: string;
  name: string;
  collapsed?: boolean;
  order: number;
}

// Position definition for multi-position fields
export interface FieldPosition {
  page: number; // 1-based index
  x: number;
  y: number;
  width: number;
  height: number;
  // Optional overrides for typography at this position
  fontSize?: number;
  letterSpacing?: number;
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
  
  // Additional positions where this field should appear (same value rendered at multiple locations)
  additionalPositions?: FieldPosition[];
  
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
  columns?: TableColumn[]; // Column definitions with full field properties
  rowIndex?: number; // For table-row: which data index (0, 1, 2) does this visual row represent?
  cellPadding?: number; // Padding inside table cells
  cellGap?: number; // Margin/Gap between table cells

  // Nesting logic
  parentFieldId?: string;
  parentOptionId?: string;
  
  // Visibility
  hidden?: boolean; // Hide the field box in editor mode
  
  // Mark style for radio/checkbox
  markStyle?: MarkStyle; // Style of mark when selected (checkmark, x, circle, etc.)
  
  // Signature field canvas dimensions
  signatureCanvasWidth?: number; // Width of the signature drawing canvas in pixels
  signatureCanvasHeight?: number; // Height of the signature drawing canvas in pixels
  
  // Checkbox: use field box as the clickable area instead of options
  useFieldAsCheckbox?: boolean; // When true, clicking the field box toggles the checkbox (no separate options needed)
  
  // Validation rules
  validationRules?: ValidationRule[];
  
  // Document attachment support
  documentRequirement?: DocumentRequirement;
  attachments?: DocumentAttachment[];
  
  // Composite field support - text with inline inputs
  compositeTemplate?: string; // e.g., "I live in {text:city} since {date:since_date}."
  compositeValues?: Record<string, string>; // { city: "Tel Aviv", since_date: "01/01/2020" }
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