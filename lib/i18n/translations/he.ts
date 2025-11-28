// Hebrew translations
import { TranslationKeys } from './en';

export const he: TranslationKeys = {
  // Common
  common: {
    loading: 'טוען...',
    save: 'שמור',
    cancel: 'ביטול',
    delete: 'מחק',
    edit: 'עריכה',
    add: 'הוסף',
    clear: 'נקה',
    close: 'סגור',
    back: 'חזור',
    next: 'הבא',
    previous: 'הקודם',
    search: 'חיפוש',
    select: 'בחר...',
    yes: 'כן',
    no: 'לא',
    or: 'או',
    fields: 'שדות',
    copied: 'הועתק!',
    copyJson: 'העתק JSON',
    page: 'עמוד',
    of: 'מתוך',
    reset: 'איפוס',
    hidden: 'מוסתר',
    row: 'שורה',
  },

  // PDF Viewer
  pdfViewer: {
    initializingViewer: 'מאתחל מציג PDF...',
    loadingPdf: 'טוען PDF...',
  },

  // Home page
  home: {
    title: 'מילוי טפסים חכם',
    subtitle: 'העלה קובץ PDF כדי להתחיל לערוך שדות ולמלא מידע.',
    browseTemplates: 'עיין בתבניות טפסים',
    uploadNewPdf: 'העלה PDF חדש',
    supportedFormats: 'פורמטים נתמכים: PDF בלבד',
  },

  // Templates page
  templates: {
    title: 'תבניות טפסים',
    subtitle: 'בחר תבנית טופס כדי להתחיל למלא',
    backToHome: 'חזרה לדף הבית',
    searchPlaceholder: 'חיפוש טפסים...',
    allForms: 'כל הטפסים',
    noFormsFound: 'לא נמצאו טפסים',
    tryAdjustingSearch: 'נסה לשנות את החיפוש',
    addFormTemplates: 'הוסף תבניות טפסים ל-formsData.ts',
  },

  // Editor page
  editor: {
    uploadPdf: 'העלאת PDF',
    selectPdfToStart: 'בחר קובץ PDF כדי להתחיל לערוך',
    choosePdfFile: 'בחר קובץ PDF',
    backToHome: '← חזרה לדף הבית',
    editorMode: 'מצב עריכה',
    fillMode: 'מצב מילוי',
    edit: 'עריכה',
    fill: 'מילוי',
    saveSnapshot: 'שמור תמונת מצב',
    undo: 'בטל',
    redo: 'בצע שוב',
    keyboardShortcuts: 'קיצורי מקלדת',
    copyFormConfig: 'העתק הגדרות טופס כ-JSON',
    goBackConfirm: 'לחזור לדף הבית? שינויים שלא נשמרו יאבדו.',
    deleteAllConfirm: 'האם אתה בטוח שברצונך למחוק את כל השדות?',
    failedToLoadForm: 'טעינת הטופס נכשלה. ודא שקובץ ה-PDF קיים.',
    failedToGeneratePdf: 'יצירת ה-PDF נכשלה. נסה שוב.',
    failedToCopyJson: 'העתקת ה-JSON ללוח נכשלה',
  },

  // Sidebar
  sidebar: {
    editorMode: 'מצב עריכה',
    fillForm: 'מילוי טופס',
    configureFields: 'הגדר שדות.',
    fillInformation: 'מלא מידע.',
    back: 'חזור',
    linked: 'מקושר',
    
    // Field properties
    name: 'שם',
    nameHe: 'שם (עברית)',
    section: 'מקטע',
    noSection: 'ללא מקטע',
    type: 'סוג',
    value: 'ערך',
    placeholder: 'טקסט מציין מקום',
    placeholderHe: 'טקסט מציין מקום (עברית)',
    
    // Translations section
    translations: 'תרגומים',
    translationsHelp: 'הוסף תרגומים לעברית לשדה זה',
    optionTranslation: 'עברית',
    
    // Field types
    fieldTypes: {
      text: 'טקסט',
      textarea: 'אזור טקסט',
      number: 'מספר',
      date: 'תאריך',
      signature: 'חתימה',
      select: 'בחירה',
      radio: 'בחירה יחידה',
      checkbox: 'תיבת סימון',
      table: 'טבלה',
      composite: 'טקסט מורכב',
    },

    // Date format
    dateFormat: 'פורמט תאריך',
    hideSeparator: 'הסתר "/" ב-PDF',

    // Composite field
    compositeTemplate: 'תבנית מורכבת',
    compositeHelp: 'השתמש ב-{text:name} לקלט טקסט, {date:name} לתאריכים, {number:name} למספרים. שדות ילדים ייווצרו שתוכל למקם על ה-PDF.',
    template: 'תבנית',
    syncChildFields: 'סנכרן שדות ילדים מהתבנית',
    clickSyncToCreate: 'לחץ "סנכרן" ליצירת שדות ילדים למיקום',
    childFields: 'שדות ילדים',

    // Visual styling
    visualStyling: 'עיצוב חזותי',
    textColor: 'צבע טקסט',
    background: 'רקע',
    borderColor: 'צבע מסגרת',
    borderWidth: 'עובי מסגרת',
    radius: 'רדיוס',
    padding: 'ריפוד (פיקסלים)',

    // Typography
    typography: 'טיפוגרפיה',
    fontSize: 'גודל גופן',
    letterSpacing: 'מרווח אותיות',
    textAlign: 'יישור טקסט',
    left: 'שמאל',
    center: 'מרכז',
    right: 'ימין',

    // Position
    position: 'מיקום',
    page: 'עמוד',
    xPosition: 'מיקום X',
    yPosition: 'מיקום Y',
    width: 'רוחב',
    height: 'גובה',

    // Options
    options: 'אפשרויות',
    addOption: 'הוסף אפשרות',
    markStyle: 'סגנון סימון',
    markStyles: {
      checkmark: 'סימן וי ✓',
      x: 'סימן X ✗',
      circle: 'עיגול ○',
      square: 'ריבוע □',
      dot: 'נקודה •',
      none: 'ללא (מוסתר)',
    },

    // Table
    tableSettings: 'הגדרות טבלה',
    maxRows: 'מקסימום שורות',
    showHeaders: 'הצג כותרות',
    cellPadding: 'ריפוד תא',
    cellGap: 'מרווח תאים',
    columns: 'עמודות',
    addColumn: 'הוסף עמודה',
    columnName: 'שם עמודה',
    columnType: 'סוג עמודה',
    columnWidth: 'רוחב %',

    // Validation
    validation: 'אימות',
    addRule: 'הוסף כלל',
    required: 'חובה',
    pattern: 'תבנית',
    minLength: 'אורך מינימלי',
    maxLength: 'אורך מקסימלי',
    min: 'ערך מינימלי',
    max: 'ערך מקסימלי',
    conditional: 'מותנה',
    errorMessage: 'הודעת שגיאה',
    validationPatterns: {
      email: 'אימייל',
      phone: 'טלפון',
      israeliId: 'תעודת זהות ישראלית',
      israeliPhone: 'טלפון ישראלי',
      zipCode: 'מיקוד',
      url: 'כתובת URL',
      alphanumeric: 'אותיות ומספרים',
      lettersOnly: 'אותיות בלבד',
      numbersOnly: 'מספרים בלבד',
      custom: 'תבנית מותאמת',
    },

    // Document attachment
    documentAttachment: 'צירוף מסמך',
    enableAttachment: 'אפשר צירוף מסמך',
    attachmentLabel: 'תווית',
    attachmentDescription: 'תיאור',
    acceptedTypes: 'סוגי קבצים מותרים',
    maxFiles: 'מקסימום קבצים',
    attachmentRequired: 'חובה',

    // Actions
    actions: 'פעולות',
    duplicateField: 'שכפל שדה',
    addLinkedLocation: 'הוסף מיקום מקושר',
    addNestedField: 'הוסף שדה מקונן',
    deleteField: 'מחק שדה',
    clearAllFields: 'נקה את כל השדות',
    downloadPdf: 'הורד PDF',

    // Sections
    sections: 'מקטעים',
    addSection: 'הוסף מקטע',
    newSectionName: 'שם מקטע חדש',
    unsectioned: 'ללא מקטע',

    // Fill mode
    fillStep: 'שלב',
    of: 'מתוך',
    previousField: 'הקודם',
    nextField: 'הבא',
    signHere: 'חתום כאן',
    tapToSign: 'לחץ לחתימה',
    uploadDocument: 'העלה מסמך',
    attachedFiles: 'קבצים מצורפים',
    removeFile: 'הסר',
  },

  // Signature modal
  signature: {
    title: 'חתימה על מסמך',
    drawHere: 'צייר את החתימה שלך כאן',
    clear: 'נקה',
    save: 'שמור חתימה',
  },

  // Keyboard shortcuts
  shortcuts: {
    title: 'קיצורי מקלדת',
    pressToToggle: 'לחץ ? בכל עת להצגת/הסתרת לוח זה',
    groups: {
      general: 'כללי',
      fieldSelection: 'בחירת שדה',
      fieldMovement: 'הזזת שדה',
      fieldResizing: 'שינוי גודל שדה',
    },
    actions: {
      undo: 'בטל',
      redo: 'בצע שוב',
      redoAlt: 'בצע שוב (חלופי)',
      toggleShortcuts: 'הצג/הסתר קיצורי מקלדת',
      deselectField: 'בטל בחירת שדה',
      deleteField: 'מחק שדה נבחר',
      duplicateField: 'שכפל שדה',
      moveUp: 'הזז שדה למעלה',
      moveDown: 'הזז שדה למטה',
      moveLeft: 'הזז שדה שמאלה',
      moveRight: 'הזז שדה ימינה',
      moveFaster: 'הזז שדה מהר יותר (5x)',
      decreaseHeight: 'הקטן גובה',
      increaseHeight: 'הגדל גובה',
      decreaseWidth: 'הקטן רוחב',
      increaseWidth: 'הגדל רוחב',
      resizeFaster: 'שנה גודל מהר יותר (5x)',
    },
  },

  // Validation messages
  validation: {
    errors: 'שגיאות אימות',
    someFieldsHaveIssues: 'יש בעיות בחלק מהשדות',
    errorsFound: 'שגיאה/ות נמצאו ב-',
    fieldsWithErrors: 'שדה/ות',
    andMore: 'ועוד {count}',
    fixErrors: 'תקן שגיאות',
    downloadAnyway: 'הורד בכל זאת',
  },

  // Form field labels (for form data)
  formFields: {
    idNumber: 'מספר תעודת זהות',
    immigrationDate: 'תאריך עלייה',
    taxYear: 'שנת מס',
    doYouHaveId: 'האם יש לך תעודת זהות?',
    familyName: 'שם משפחה',
    passportNumber: 'מספר דרכון',
    firstName: 'שם פרטי',
    dateOfBirth: 'תאריך לידה',
    areYouImmigrant: 'האם אתה עולה חדש?',
    streetAddress: 'כתובת רחוב',
    streetNumber: 'מספר בית',
    city: 'עיר',
    zipCode: 'מיקוד',
    gender: 'מין',
    male: 'זכר',
    female: 'נקבה',
    maritalStatus: 'מצב משפחתי',
    single: 'רווק/ה',
    married: 'נשוי/אה',
    separated: 'פרוד/ה',
    widowed: 'אלמן/ה',
    divorced: 'גרוש/ה',
    spouseHasId: 'האם לבן/בת הזוג יש תעודת זהות?',
    spouseId: 'תעודת זהות בן/בת זוג',
    spousePassport: 'דרכון בן/בת זוג',
    spouseLastName: 'שם משפחה של בן/בת הזוג',
    spouseFirstName: 'שם פרטי של בן/בת הזוג',
    spouseDateOfBirth: 'תאריך לידה של בן/בת הזוג',
    spouseIsImmigrant: 'האם בן/בת הזוג עולה חדש/ה?',
    spouseImmigrationDate: 'תאריך עלייה של בן/בת הזוג',
    spouseHasIncome: 'האם לבן/בת הזוג יש הכנסה?',
    spouseIncomeType: 'סוג הכנסה של בן/בת הזוג',
    jobBusinessAllowance: 'עבודה/עסק/קצבה',
    otherIncome: 'הכנסה אחרת',
    livingInIsrael: 'מתגורר בישראל?',
    kibbutzMember: 'האם אתה חבר קיבוץ או מושב שיתופי?',
    kibbutzOptions: {
      no: 'לא. אינני חבר קיבוץ או מושב שיתופי',
      yesNotTransferred: 'כן. הכנסתי ממעסיק זה אינה מועברת לקיבוץ',
      yesTransferred: 'כן. הכנסתי ממעסיק זה מועברת לקיבוץ',
    },
    healthcareMember: 'האם אתה חבר בקופת חולים?',
    selectHealthcare: 'בחר את קופת החולים שלך',
    healthcareProviders: {
      clalit: 'כללית',
      maccabi: 'מכבי',
      meuhedet: 'מאוחדת',
      leumit: 'לאומית',
    },
    email: 'דואר אלקטרוני',
    phoneNumber: 'מספר טלפון',
    mobilePhone: 'מספר טלפון נייד',
    doYouHaveChildren: 'האם יש לך ילדים?',
    children: 'ילדים',
    childName: 'שם',
    childDateOfBirth: 'תאריך לידה',
    childIdNumber: 'מספר תעודת זהות',
  },
};
