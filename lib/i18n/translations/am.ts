// Amharic (Ethiopian) translations
import { TranslationKeys } from './en';

export const am: TranslationKeys = {
  // Common
  common: {
    loading: 'በመጫን ላይ...',
    save: 'አስቀምጥ',
    cancel: 'ሰርዝ',
    delete: 'ሰርዝ',
    edit: 'አርትዕ',
    add: 'ጨምር',
    clear: 'አጽዳ',
    close: 'ዝጋ',
    back: 'ተመለስ',
    next: 'ቀጣይ',
    previous: 'ቀዳሚ',
    search: 'ፈልግ',
    select: 'ምረጥ...',
    yes: 'አዎ',
    no: 'አይ',
    or: 'ወይም',
    fields: 'መስኮች',
    copied: 'ተቀድቷል!',
    copyJson: 'JSON ቅዳ',
    page: 'ገጽ',
    of: 'ከ',
    reset: 'ዳግም አስጀምር',
    hidden: 'የተደበቀ',
    row: 'ረድፍ',
  },

  // PDF Viewer
  pdfViewer: {
    initializingViewer: 'PDF አሳይ በማስጀመር ላይ...',
    loadingPdf: 'PDF በመጫን ላይ...',
  },

  // Home page
  home: {
    title: 'ብልጥ PDF መሙያ',
    subtitle: 'መስኮችን ለማርትዕ እና መረጃ ለመሙላት PDF ይስቀሉ።',
    browseTemplates: 'የቅጽ አብነቶችን ያስሱ',
    uploadNewPdf: 'አዲስ PDF ይስቀሉ',
    supportedFormats: 'የሚደገፉ ቅርጸቶች: PDF ብቻ',
  },

  // Templates page
  templates: {
    title: 'የቅጽ አብነቶች',
    subtitle: 'መሙላት ለመጀመር የቅጽ አብነት ይምረጡ',
    backToHome: 'ወደ መነሻ ተመለስ',
    searchPlaceholder: 'ቅጾችን ፈልግ...',
    allForms: 'ሁሉም ቅጾች',
    noFormsFound: 'ቅጾች አልተገኙም',
    tryAdjustingSearch: 'ፍለጋውን ለማስተካከል ይሞክሩ',
    addFormTemplates: 'የቅጽ አብነቶችን ወደ formsData.ts ያክሉ',
  },

  // Editor page
  editor: {
    uploadPdf: 'PDF ስቀል',
    selectPdfToStart: 'ማርትዕ ለመጀመር PDF ፋይል ይምረጡ',
    choosePdfFile: 'PDF ፋይል ምረጥ',
    backToHome: '← ወደ መነሻ ተመለስ',
    editorMode: 'የአርታዒ ሁነታ',
    fillMode: 'የመሙያ ሁነታ',
    edit: 'አርትዕ',
    fill: 'ሙላ',
    saveSnapshot: 'ቅጽበታዊ ምስል አስቀምጥ',
    undo: 'መልስ',
    redo: 'ድገም',
    keyboardShortcuts: 'የቁልፍ ሰሌዳ አቋራጮች',
    copyFormConfig: 'የቅጽ ውቅረትን እንደ JSON ቅዳ',
    goBackConfirm: 'ወደ መነሻ ተመለስ? ያልተቀመጡ ለውጦች ይጠፋሉ።',
    deleteAllConfirm: 'ሁሉንም መስኮች መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት?',
    failedToLoadForm: 'ቅጹን መጫን አልተሳካም። PDF ፋይሉ መኖሩን ያረጋግጡ።',
    failedToGeneratePdf: 'PDF መፍጠር አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
    failedToCopyJson: 'JSON ወደ ቅንጥብ ሰሌዳ መቅዳት አልተሳካም',
  },

  // Sidebar
  sidebar: {
    editorMode: 'የአርታዒ ሁነታ',
    fillForm: 'ቅጽ ሙላ',
    configureFields: 'መስኮችን አዋቅር።',
    fillInformation: 'መረጃ ሙላ።',
    back: 'ተመለስ',
    backToParent: 'ወደ ወላጅ ተመለስ',
    backToRoot: 'ወደ ሁሉም መስኮች ተመለስ',
    linked: 'የተገናኘ',

    // Field properties
    name: 'ስም',
    nameHe: 'ስም (ዕብራይስጥ)',
    section: 'ክፍል',
    noSection: 'ክፍል የለም',
    type: 'ዓይነት',
    value: 'ዋጋ',
    placeholder: 'ቦታ ያዥ ጽሑፍ',
    placeholderHe: 'ቦታ ያዥ ጽሑፍ (ዕብራይስጥ)',

    // Translations section
    translations: 'ትርጉሞች',
    translationsHelp: 'ለዚህ መስክ ትርጉሞችን ያክሉ',
    optionTranslation: 'ዕብራይስጥ',

    // Field types
    fieldTypes: {
      text: 'ጽሑፍ',
      textarea: 'የጽሑፍ ቦታ',
      number: 'ቁጥር',
      date: 'ቀን',
      signature: 'ፊርማ',
      select: 'ምረጥ',
      radio: 'ሬዲዮ',
      checkbox: 'ምልክት ሳጥን',
      table: 'ሰንጠረዥ',
      composite: 'የተቀናጀ ጽሑፍ',
    },

    // Date format
    dateFormat: 'የቀን ቅርጸት',
    hideSeparator: '"/" በPDF ውስጥ ደብቅ',

    // Composite field
    compositeTemplate: 'የተቀናጀ አብነት',
    compositeHelp:
      'ለጽሑፍ ግብዓቶች {text:name}፣ ለቀኖች {date:name}፣ ለቁጥሮች {number:name} ይጠቀሙ። በPDF ላይ ሊያስቀምጧቸው የሚችሉ የልጅ መስኮች ይፈጠራሉ።',
    template: 'አብነት',
    syncChildFields: 'የልጅ መስኮችን ከአብነት አመሳስል',
    clickSyncToCreate: 'ሊቀመጡ የሚችሉ የልጅ መስኮችን ለመፍጠር "አመሳስል" ን ጠቅ ያድርጉ',
    childFields: 'የልጅ መስኮች',

    // Visual styling
    visualStyling: 'ምስላዊ ቅጥ',
    textColor: 'የጽሑፍ ቀለም',
    background: 'ዳራ',
    borderColor: 'የድንበር ቀለም',
    borderWidth: 'የድንበር ስፋት',
    radius: 'ራዲየስ',
    padding: 'ሙሌት (px)',

    // Typography
    typography: 'ታይፖግራፊ',
    fontSize: 'የፊደል መጠን',
    letterSpacing: 'የፊደል ክፍተት',
    textAlign: 'የጽሑፍ አሰላለፍ',
    left: 'ግራ',
    center: 'መሃል',
    right: 'ቀኝ',

    // Signature canvas
    signatureCanvasSize: 'የሸራ መጠን',
    signatureCanvasSizeHelp: 'ለፊርማ መስኮት የስዕል ቦታ መጠን ያዘጋጁ',

    // Position
    position: 'ቦታ',
    page: 'ገጽ',
    xPosition: 'X ቦታ',
    yPosition: 'Y ቦታ',
    width: 'ስፋት',
    height: 'ቁመት',

    // Options
    options: 'አማራጮች',
    addOption: 'አማራጭ ጨምር',
    markStyle: 'የምልክት ቅጥ',
    markStyles: {
      checkmark: 'ምልክት ✓',
      x: 'X ምልክት ✗',
      circle: 'ክብ ○',
      square: 'ካሬ □',
      dot: 'ነጥብ •',
      none: 'ምንም (የተደበቀ)',
    },

    // Table
    tableSettings: 'የሰንጠረዥ ቅንብሮች',
    maxRows: 'ከፍተኛ ረድፎች',
    showHeaders: 'ራስጌዎችን አሳይ',
    cellPadding: 'የሕዋስ ሙሌት',
    cellGap: 'የሕዋስ ክፍተት',
    columns: 'አምዶች',
    addColumn: 'አምድ ጨምር',
    columnName: 'የአምድ ስም',
    columnType: 'የአምድ ዓይነት',
    columnWidth: 'ስፋት %',

    // Validation
    validation: 'ማረጋገጫ',
    addRule: 'ደንብ ጨምር',
    required: 'አስፈላጊ',
    pattern: 'ንድፍ',
    minLength: 'ዝቅተኛ ርዝመት',
    maxLength: 'ከፍተኛ ርዝመት',
    min: 'ዝቅተኛ ዋጋ',
    max: 'ከፍተኛ ዋጋ',
    conditional: 'ሁኔታዊ',
    errorMessage: 'የስህተት መልእክት',
    validationPatterns: {
      email: 'ኢሜይል',
      phone: 'ስልክ',
      israeliId: 'የእስራኤል መታወቂያ',
      israeliPhone: 'የእስራኤል ስልክ',
      zipCode: 'ዚፕ ኮድ',
      url: 'URL',
      alphanumeric: 'ፊደል-ቁጥር',
      lettersOnly: 'ፊደላት ብቻ',
      numbersOnly: 'ቁጥሮች ብቻ',
      custom: 'ብጁ ንድፍ',
    },

    // Document attachment
    documentAttachment: 'ሰነድ አባሪ',
    enableAttachment: 'የሰነድ አባሪን አንቃ',
    attachmentLabel: 'መለያ',
    attachmentDescription: 'መግለጫ',
    acceptedTypes: 'ተቀባይነት ያላቸው ዓይነቶች',
    maxFiles: 'ከፍተኛ ፋይሎች',
    attachmentRequired: 'አስፈላጊ',

    // Actions
    actions: 'ድርጊቶች',
    duplicateField: 'መስክ ድገም',
    addLinkedLocation: 'የተገናኘ ቦታ ጨምር',
    addNestedField: 'የተጠቃለለ መስክ ጨምር',
    deleteField: 'መስክ ሰርዝ',
    clearAllFields: 'ሁሉንም መስኮች አጽዳ',
    downloadPdf: 'PDF አውርድ',

    // Sections
    sections: 'ክፍሎች',
    addSection: 'ክፍል ጨምር',
    newSectionName: 'አዲስ የክፍል ስም',
    unsectioned: 'ክፍል የሌለው',

    // Fill mode
    fillStep: 'ደረጃ',
    of: 'ከ',
    previousField: 'ቀዳሚ',
    nextField: 'ቀጣይ',
    signHere: 'እዚህ ፈርም',
    tapToSign: 'ለመፈረም ንካ',
    uploadDocument: 'ሰነድ ስቀል',
    attachedFiles: 'የተያያዙ ፋይሎች',
    removeFile: 'አስወግድ',
  },

  // Signature modal
  signature: {
    title: 'ሰነድ ፈርም',
    drawHere: 'ፊርማዎን እዚህ ይሳሉ',
    clear: 'አጽዳ',
    save: 'ፊርማ አስቀምጥ',
  },

  // Keyboard shortcuts
  shortcuts: {
    title: 'የቁልፍ ሰሌዳ አቋራጮች',
    pressToToggle: 'ይህን ፓነል ለመቀያየር በማንኛውም ጊዜ ? ይጫኑ',
    groups: {
      general: 'አጠቃላይ',
      fieldSelection: 'መስክ ምርጫ',
      fieldMovement: 'መስክ እንቅስቃሴ',
      fieldResizing: 'መስክ መጠን መቀየር',
    },
    actions: {
      undo: 'መልስ',
      redo: 'ድገም',
      redoAlt: 'ድገም (አማራጭ)',
      toggleShortcuts: 'አቋራጮችን ቀያይር',
      deselectField: 'መስክ ምርጫ ሰርዝ',
      deleteField: 'የተመረጠውን መስክ ሰርዝ',
      duplicateField: 'መስክ ድገም',
      moveUp: 'መስክ ወደ ላይ አንቀሳቅስ',
      moveDown: 'መስክ ወደ ታች አንቀሳቅስ',
      moveLeft: 'መስክ ወደ ግራ አንቀሳቅስ',
      moveRight: 'መስክ ወደ ቀኝ አንቀሳቅስ',
      moveFaster: 'ፈጣን እንቅስቃሴ (5x)',
      decreaseHeight: 'ቁመት ቀንስ',
      increaseHeight: 'ቁመት ጨምር',
      decreaseWidth: 'ስፋት ቀንስ',
      increaseWidth: 'ስፋት ጨምር',
      resizeFaster: 'ፈጣን መጠን መቀየር (5x)',
    },
  },

  // Validation messages
  validation: {
    errors: 'የማረጋገጫ ስህተቶች',
    someFieldsHaveIssues: 'አንዳንድ መስኮች ችግሮች አሏቸው',
    errorsFound: 'ስህተት(ቶች) ተገኝተዋል በ',
    fieldsWithErrors: 'መስክ(ዎች)',
    andMore: 'እና {count} ተጨማሪ',
    fixErrors: 'ስህተቶችን አስተካክል',
    downloadAnyway: 'ለማንኛውም አውርድ',
  },

  // Form field labels
  formFields: {
    idNumber: 'የመታወቂያ ቁጥር',
    immigrationDate: 'የስደት ቀን',
    taxYear: 'የግብር ዓመት',
    doYouHaveId: 'መታወቂያ አለዎት?',
    familyName: 'የቤተሰብ ስም',
    passportNumber: 'የፓስፖርት ቁጥር',
    firstName: 'የመጀመሪያ ስም',
    dateOfBirth: 'የልደት ቀን',
    areYouImmigrant: 'ስደተኛ ነዎት?',
    streetAddress: 'የጎዳና አድራሻ',
    streetNumber: 'የቤት ቁጥር',
    city: 'ከተማ',
    zipCode: 'ዚፕ ኮድ',
    gender: 'ጾታ',
    male: 'ወንድ',
    female: 'ሴት',
    maritalStatus: 'የጋብቻ ሁኔታ',
    single: 'ያላገባ/ች',
    married: 'ያገባ/ች',
    separated: 'የተለያየ/ች',
    widowed: 'ባል/ሚስት የሞተበት/ባት',
    divorced: 'የተፋታ/ች',
    spouseHasId: 'የትዳር ጓደኛ መታወቂያ አለው/ላት?',
    spouseId: 'የትዳር ጓደኛ መታወቂያ',
    spousePassport: 'የትዳር ጓደኛ ፓስፖርት',
    spouseLastName: 'የትዳር ጓደኛ የቤተሰብ ስም',
    spouseFirstName: 'የትዳር ጓደኛ የመጀመሪያ ስም',
    spouseDateOfBirth: 'የትዳር ጓደኛ የልደት ቀን',
    spouseIsImmigrant: 'የትዳር ጓደኛ ስደተኛ ነው/ናት?',
    spouseImmigrationDate: 'የትዳር ጓደኛ የስደት ቀን',
    spouseHasIncome: 'የትዳር ጓደኛ ገቢ አለው/ላት?',
    spouseIncomeType: 'የትዳር ጓደኛ የገቢ ዓይነት',
    jobBusinessAllowance: 'ሥራ/ንግድ/አበል',
    otherIncome: 'ሌላ ገቢ',
    livingInIsrael: 'በእስራኤል ይኖራሉ?',
    kibbutzMember: 'የኪቡትዝ ወይም የትብብር ሞሻቭ አባል ነዎት?',
    kibbutzOptions: {
      no: 'አይ። የኪቡትዝ ወይም የትብብር ሞሻቭ አባል አይደለሁም',
      yesNotTransferred: 'አዎ። ከዚህ አሰሪ የሚገኘው ገቢዬ ወደ ኪቡትዝ አይተላለፍም',
      yesTransferred: 'አዎ። ከዚህ አሰሪ የሚገኘው ገቢዬ ወደ ኪቡትዝ ይተላለፋል',
    },
    healthcareMember: 'የጤና መድን አባል ነዎት?',
    selectHealthcare: 'የጤና መድንዎን ይምረጡ',
    healthcareProviders: {
      clalit: 'ክላሊት',
      maccabi: 'ማካቢ',
      meuhedet: 'መኡሄደት',
      leumit: 'ሌኡሚት',
    },
    email: 'ኢሜይል',
    phoneNumber: 'ስልክ ቁጥር',
    mobilePhone: 'ሞባይል ስልክ ቁጥር',
    doYouHaveChildren: 'ልጆች አሉዎት?',
    children: 'ልጆች',
    childName: 'ስም',
    childDateOfBirth: 'የልደት ቀን',
    childIdNumber: 'የመታወቂያ ቁጥር',
  },
};
