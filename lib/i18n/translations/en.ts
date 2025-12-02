// English translations
export const en = {
  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    clear: 'Clear',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    select: 'Select...',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    fields: 'fields',
    copied: 'Copied!',
    copyJson: 'Copy JSON',
    page: 'Page',
    of: 'of',
    reset: 'Reset',
    hidden: 'Hidden',
    row: 'Row',
  },

  // PDF Viewer
  pdfViewer: {
    initializingViewer: 'Initializing PDF viewer...',
    loadingPdf: 'Loading PDF...',
  },

  // Home page
  home: {
    title: 'Smart PDF Filler',
    subtitle: 'Upload a PDF to start editing fields and filling information.',
    browseTemplates: 'Browse Form Templates',
    uploadNewPdf: 'Upload New PDF',
    supportedFormats: 'Supported formats: PDF only',
  },

  // Templates page
  templates: {
    title: 'Form Templates',
    subtitle: 'Select a form template to start filling',
    backToHome: 'Back to Home',
    searchPlaceholder: 'Search forms...',
    allForms: 'All Forms',
    noFormsFound: 'No forms found',
    tryAdjustingSearch: 'Try adjusting your search',
    addFormTemplates: 'Add form templates to formsData.ts',
  },

  // Editor page
  editor: {
    uploadPdf: 'Upload PDF',
    selectPdfToStart: 'Select a PDF file to start editing',
    choosePdfFile: 'Choose PDF File',
    backToHome: '← Back to Home',
    editorMode: 'Editor Mode',
    fillMode: 'Fill Mode',
    edit: 'Edit',
    fill: 'Fill',
    saveSnapshot: 'Save snapshot',
    undo: 'Undo',
    redo: 'Redo',
    keyboardShortcuts: 'Keyboard shortcuts',
    copyFormConfig: 'Copy form configuration as JSON',
    goBackConfirm: 'Go back to home? Unsaved changes will be lost.',
    deleteAllConfirm: 'Are you sure you want to delete all fields?',
    failedToLoadForm: 'Failed to load form. Make sure the PDF file exists.',
    failedToGeneratePdf: 'Failed to generate PDF. Please try again.',
    failedToCopyJson: 'Failed to copy JSON to clipboard',
  },

  // Sidebar
  sidebar: {
    editorMode: 'Editor Mode',
    fillForm: 'Fill Form',
    configureFields: 'Configure fields.',
    fillInformation: 'Fill information.',
    back: 'Back',
    backToParent: 'Back to Parent',
    backToRoot: 'Back to All Fields',
    linked: 'Linked',
    
    // Field properties
    name: 'Name',
    section: 'Section',
    noSection: 'No Section',
    type: 'Type',
    value: 'Value',
    placeholder: 'Placeholder',
    
    // Field types
    fieldTypes: {
      text: 'Text',
      textarea: 'Text Area',
      number: 'Number',
      date: 'Date',
      signature: 'Signature',
      select: 'Select',
      radio: 'Radio',
      checkbox: 'Checkbox',
      table: 'Table',
      composite: 'Composite Text',
    },

    // Date format
    dateFormat: 'Date Format',
    hideSeparator: 'Hide "/" separator in PDF',

    // Composite field
    compositeTemplate: 'Composite Template',
    compositeHelp: 'Use {text:name} for text inputs, {date:name} for dates, {number:name} for numbers. Child fields will be created that you can position on the PDF.',
    template: 'Template',
    syncChildFields: 'Sync Child Fields from Template',
    clickSyncToCreate: 'Click "Sync" to create positionable child fields',
    childFields: 'Child Fields',

    // Visual styling
    visualStyling: 'Visual Styling',
    textColor: 'Text Color',
    background: 'Background',
    borderColor: 'Border Color',
    borderWidth: 'Border Width',
    radius: 'Radius',
    padding: 'Padding (px)',

    // Typography
    typography: 'Typography',
    fontSize: 'Font Size',
    letterSpacing: 'Letter Spacing',
    textAlign: 'Text Align',
    left: 'Left',
    center: 'Center',
    right: 'Right',

    // Signature canvas
    signatureCanvasSize: 'Canvas Size',
    signatureCanvasSizeHelp: 'Set the drawing area size for the signature modal',

    // Position
    position: 'Position',
    page: 'Page',
    xPosition: 'X Position',
    yPosition: 'Y Position',
    width: 'Width',
    height: 'Height',

    // Options
    options: 'Options',
    addOption: 'Add Option',
    markStyle: 'Mark Style',
    markStyles: {
      checkmark: 'Checkmark ✓',
      x: 'X Mark ✗',
      circle: 'Circle ○',
      square: 'Square □',
      dot: 'Dot •',
      none: 'None (hidden)',
    },

    // Table
    tableSettings: 'Table Settings',
    maxRows: 'Max Rows',
    showHeaders: 'Show Headers',
    cellPadding: 'Cell Padding',
    cellGap: 'Cell Gap',
    columns: 'Columns',
    addColumn: 'Add Column',
    columnName: 'Column Name',
    columnType: 'Column Type',
    columnWidth: 'Width %',

    // Validation
    validation: 'Validation',
    addRule: 'Add Rule',
    required: 'Required',
    pattern: 'Pattern',
    minLength: 'Min Length',
    maxLength: 'Max Length',
    min: 'Min Value',
    max: 'Max Value',
    conditional: 'Conditional',
    errorMessage: 'Error Message',
    validationPatterns: {
      email: 'Email',
      phone: 'Phone',
      israeliId: 'Israeli ID',
      israeliPhone: 'Israeli Phone',
      zipCode: 'ZIP Code',
      url: 'URL',
      alphanumeric: 'Alphanumeric',
      lettersOnly: 'Letters Only',
      numbersOnly: 'Numbers Only',
      custom: 'Custom Pattern',
    },

    // Document attachment
    documentAttachment: 'Document Attachment',
    enableAttachment: 'Enable document attachment',
    attachmentLabel: 'Label',
    attachmentDescription: 'Description',
    acceptedTypes: 'Accepted Types',
    maxFiles: 'Max Files',
    attachmentRequired: 'Required',

    // Actions
    actions: 'Actions',
    duplicateField: 'Duplicate Field',
    addLinkedLocation: 'Add Linked Location',
    addNestedField: 'Add Nested Field',
    deleteField: 'Delete Field',
    clearAllFields: 'Clear All Fields',
    downloadPdf: 'Download PDF',

    // Sections
    sections: 'Sections',
    addSection: 'Add Section',
    newSectionName: 'New section name',
    unsectioned: 'Unsectioned',

    // Fill mode
    fillStep: 'Step',
    of: 'of',
    previousField: 'Previous',
    nextField: 'Next',
    signHere: 'Sign Here',
    tapToSign: 'Tap to sign',
    uploadDocument: 'Upload Document',
    attachedFiles: 'Attached Files',
    removeFile: 'Remove',
  },

  // Signature modal
  signature: {
    title: 'Sign Document',
    drawHere: 'Draw your signature here',
    clear: 'Clear',
    save: 'Save Signature',
  },

  // Keyboard shortcuts
  shortcuts: {
    title: 'Keyboard Shortcuts',
    pressToToggle: 'Press ? anytime to toggle this panel',
    groups: {
      general: 'General',
      fieldSelection: 'Field Selection',
      fieldMovement: 'Field Movement',
      fieldResizing: 'Field Resizing',
    },
    actions: {
      undo: 'Undo',
      redo: 'Redo',
      redoAlt: 'Redo (alternative)',
      toggleShortcuts: 'Toggle keyboard shortcuts',
      deselectField: 'Deselect field',
      deleteField: 'Delete selected field',
      duplicateField: 'Duplicate field',
      moveUp: 'Move field up',
      moveDown: 'Move field down',
      moveLeft: 'Move field left',
      moveRight: 'Move field right',
      moveFaster: 'Move field faster (5x)',
      decreaseHeight: 'Decrease height',
      increaseHeight: 'Increase height',
      decreaseWidth: 'Decrease width',
      increaseWidth: 'Increase width',
      resizeFaster: 'Resize faster (5x)',
    },
  },

  // Validation messages
  validation: {
    errors: 'Validation Errors',
    someFieldsHaveIssues: 'Some fields have issues',
    errorsFound: 'error(s) found in',
    fieldsWithErrors: 'field(s)',
    andMore: 'and {count} more',
    fixErrors: 'Fix Errors',
    downloadAnyway: 'Download Anyway',
  },

  // Form field labels (for form data)
  formFields: {
    idNumber: 'ID Number',
    immigrationDate: 'Immigration Date',
    taxYear: 'Tax Year',
    doYouHaveId: 'Do you have an ID?',
    familyName: 'Family Name',
    passportNumber: 'Passport Number',
    firstName: 'First Name',
    dateOfBirth: 'Date of Birth',
    areYouImmigrant: 'Are you an immigrant?',
    streetAddress: 'Street Address',
    streetNumber: 'Street Number',
    city: 'City',
    zipCode: 'ZIP Code',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    maritalStatus: 'Marital Status',
    single: 'Single',
    married: 'Married',
    separated: 'Separated',
    widowed: 'Widowed',
    divorced: 'Divorced',
    spouseHasId: 'Does spouse have ID?',
    spouseId: 'Spouse ID',
    spousePassport: 'Spouse Passport',
    spouseLastName: 'Spouse Last Name',
    spouseFirstName: 'Spouse First Name',
    spouseDateOfBirth: 'Spouse Date of Birth',
    spouseIsImmigrant: 'Is spouse an immigrant?',
    spouseImmigrationDate: 'Spouse Immigration Date',
    spouseHasIncome: 'Does spouse have income?',
    spouseIncomeType: 'Spouse Income Type',
    jobBusinessAllowance: 'Job/Business/Allowance',
    otherIncome: 'Other Income',
    livingInIsrael: 'Living in Israel?',
    kibbutzMember: 'Are you a member of a Kibbutz or Cooperative Moshav?',
    kibbutzOptions: {
      no: 'No. You are not a member of a kibbutz or cooperative moshav',
      yesNotTransferred: 'Yes. My income from this employer is not transferred to the kibbutz',
      yesTransferred: 'Yes. My income from this employer is transferred to the kibbutz',
    },
    healthcareMember: 'Are you a member of a healthcare provider?',
    selectHealthcare: 'Select your healthcare provider',
    healthcareProviders: {
      clalit: 'Clalit',
      maccabi: 'Maccabi',
      meuhedet: 'Meuhedet',
      leumit: 'Leumit',
    },
    email: 'Email',
    phoneNumber: 'Phone Number',
    mobilePhone: 'Mobile Phone Number',
    doYouHaveChildren: 'Do you have children?',
    children: 'Children',
    childName: 'Name',
    childDateOfBirth: 'Date of Birth',
    childIdNumber: 'ID Number',
  },
};

export type TranslationKeys = typeof en;
