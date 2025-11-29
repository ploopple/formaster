// Arabic translations
import { TranslationKeys } from './en';

export const ar: TranslationKeys = {
  // Common
  common: {
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    clear: 'مسح',
    close: 'إغلاق',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    search: 'بحث',
    select: 'اختر...',
    yes: 'نعم',
    no: 'لا',
    or: 'أو',
    fields: 'حقول',
    copied: 'تم النسخ!',
    copyJson: 'نسخ JSON',
    page: 'صفحة',
    of: 'من',
    reset: 'إعادة تعيين',
    hidden: 'مخفي',
    row: 'صف',
  },

  // PDF Viewer
  pdfViewer: {
    initializingViewer: 'جاري تهيئة عارض PDF...',
    loadingPdf: 'جاري تحميل PDF...',
  },

  // Home page
  home: {
    title: 'تعبئة PDF الذكية',
    subtitle: 'قم بتحميل ملف PDF لبدء تعديل الحقول وملء المعلومات.',
    browseTemplates: 'تصفح قوالب النماذج',
    uploadNewPdf: 'تحميل PDF جديد',
    supportedFormats: 'الصيغ المدعومة: PDF فقط',
  },

  // Templates page
  templates: {
    title: 'قوالب النماذج',
    subtitle: 'اختر قالب نموذج لبدء التعبئة',
    backToHome: 'العودة للرئيسية',
    searchPlaceholder: 'البحث في النماذج...',
    allForms: 'جميع النماذج',
    noFormsFound: 'لم يتم العثور على نماذج',
    tryAdjustingSearch: 'حاول تعديل البحث',
    addFormTemplates: 'أضف قوالب النماذج إلى formsData.ts',
  },

  // Editor page
  editor: {
    uploadPdf: 'تحميل PDF',
    selectPdfToStart: 'اختر ملف PDF لبدء التعديل',
    choosePdfFile: 'اختر ملف PDF',
    backToHome: '← العودة للرئيسية',
    editorMode: 'وضع التحرير',
    fillMode: 'وضع التعبئة',
    edit: 'تحرير',
    fill: 'تعبئة',
    saveSnapshot: 'حفظ لقطة',
    undo: 'تراجع',
    redo: 'إعادة',
    keyboardShortcuts: 'اختصارات لوحة المفاتيح',
    copyFormConfig: 'نسخ إعدادات النموذج كـ JSON',
    goBackConfirm: 'العودة للرئيسية؟ ستفقد التغييرات غير المحفوظة.',
    deleteAllConfirm: 'هل أنت متأكد من حذف جميع الحقول؟',
    failedToLoadForm: 'فشل تحميل النموذج. تأكد من وجود ملف PDF.',
    failedToGeneratePdf: 'فشل إنشاء PDF. حاول مرة أخرى.',
    failedToCopyJson: 'فشل نسخ JSON إلى الحافظة',
  },

  // Sidebar
  sidebar: {
    editorMode: 'وضع التحرير',
    fillForm: 'تعبئة النموذج',
    configureFields: 'إعداد الحقول.',
    fillInformation: 'املأ المعلومات.',
    back: 'رجوع',
    backToParent: 'العودة للحقل الأب',
    backToRoot: 'العودة لجميع الحقول',
    linked: 'مرتبط',

    // Field properties
    name: 'الاسم',
    nameHe: 'الاسم (عبري)',
    section: 'القسم',
    noSection: 'بدون قسم',
    type: 'النوع',
    value: 'القيمة',
    placeholder: 'نص توضيحي',
    placeholderHe: 'نص توضيحي (عبري)',

    // Translations section
    translations: 'الترجمات',
    translationsHelp: 'أضف ترجمات لهذا الحقل',
    optionTranslation: 'عبري',

    // Field types
    fieldTypes: {
      text: 'نص',
      textarea: 'منطقة نص',
      number: 'رقم',
      date: 'تاريخ',
      signature: 'توقيع',
      select: 'اختيار',
      radio: 'اختيار فردي',
      checkbox: 'مربع اختيار',
      table: 'جدول',
      composite: 'نص مركب',
    },

    // Date format
    dateFormat: 'صيغة التاريخ',
    hideSeparator: 'إخفاء "/" في PDF',

    // Composite field
    compositeTemplate: 'قالب مركب',
    compositeHelp:
      'استخدم {text:name} لحقول النص، {date:name} للتواريخ، {number:name} للأرقام. سيتم إنشاء حقول فرعية يمكنك وضعها على PDF.',
    template: 'القالب',
    syncChildFields: 'مزامنة الحقول الفرعية من القالب',
    clickSyncToCreate: 'انقر "مزامنة" لإنشاء حقول فرعية قابلة للتموضع',
    childFields: 'الحقول الفرعية',

    // Visual styling
    visualStyling: 'التنسيق المرئي',
    textColor: 'لون النص',
    background: 'الخلفية',
    borderColor: 'لون الحدود',
    borderWidth: 'عرض الحدود',
    radius: 'نصف القطر',
    padding: 'الحشو (بكسل)',

    // Typography
    typography: 'الطباعة',
    fontSize: 'حجم الخط',
    letterSpacing: 'تباعد الحروف',
    textAlign: 'محاذاة النص',
    left: 'يسار',
    center: 'وسط',
    right: 'يمين',

    // Position
    position: 'الموضع',
    page: 'الصفحة',
    xPosition: 'موضع X',
    yPosition: 'موضع Y',
    width: 'العرض',
    height: 'الارتفاع',

    // Options
    options: 'الخيارات',
    addOption: 'إضافة خيار',
    markStyle: 'نمط العلامة',
    markStyles: {
      checkmark: 'علامة صح ✓',
      x: 'علامة X ✗',
      circle: 'دائرة ○',
      square: 'مربع □',
      dot: 'نقطة •',
      none: 'بدون (مخفي)',
    },

    // Table
    tableSettings: 'إعدادات الجدول',
    maxRows: 'الحد الأقصى للصفوف',
    showHeaders: 'إظهار العناوين',
    cellPadding: 'حشو الخلية',
    cellGap: 'فجوة الخلايا',
    columns: 'الأعمدة',
    addColumn: 'إضافة عمود',
    columnName: 'اسم العمود',
    columnType: 'نوع العمود',
    columnWidth: 'العرض %',

    // Validation
    validation: 'التحقق',
    addRule: 'إضافة قاعدة',
    required: 'مطلوب',
    pattern: 'نمط',
    minLength: 'الحد الأدنى للطول',
    maxLength: 'الحد الأقصى للطول',
    min: 'الحد الأدنى',
    max: 'الحد الأقصى',
    conditional: 'شرطي',
    errorMessage: 'رسالة الخطأ',
    validationPatterns: {
      email: 'بريد إلكتروني',
      phone: 'هاتف',
      israeliId: 'هوية إسرائيلية',
      israeliPhone: 'هاتف إسرائيلي',
      zipCode: 'الرمز البريدي',
      url: 'رابط URL',
      alphanumeric: 'أبجدي رقمي',
      lettersOnly: 'حروف فقط',
      numbersOnly: 'أرقام فقط',
      custom: 'نمط مخصص',
    },

    // Document attachment
    documentAttachment: 'إرفاق مستند',
    enableAttachment: 'تمكين إرفاق المستندات',
    attachmentLabel: 'التسمية',
    attachmentDescription: 'الوصف',
    acceptedTypes: 'الأنواع المقبولة',
    maxFiles: 'الحد الأقصى للملفات',
    attachmentRequired: 'مطلوب',

    // Actions
    actions: 'الإجراءات',
    duplicateField: 'تكرار الحقل',
    addLinkedLocation: 'إضافة موقع مرتبط',
    addNestedField: 'إضافة حقل متداخل',
    deleteField: 'حذف الحقل',
    clearAllFields: 'مسح جميع الحقول',
    downloadPdf: 'تحميل PDF',

    // Sections
    sections: 'الأقسام',
    addSection: 'إضافة قسم',
    newSectionName: 'اسم القسم الجديد',
    unsectioned: 'بدون قسم',

    // Fill mode
    fillStep: 'خطوة',
    of: 'من',
    previousField: 'السابق',
    nextField: 'التالي',
    signHere: 'وقّع هنا',
    tapToSign: 'انقر للتوقيع',
    uploadDocument: 'تحميل مستند',
    attachedFiles: 'الملفات المرفقة',
    removeFile: 'إزالة',
  },

  // Signature modal
  signature: {
    title: 'توقيع المستند',
    drawHere: 'ارسم توقيعك هنا',
    clear: 'مسح',
    save: 'حفظ التوقيع',
  },

  // Keyboard shortcuts
  shortcuts: {
    title: 'اختصارات لوحة المفاتيح',
    pressToToggle: 'اضغط ? في أي وقت لتبديل هذه اللوحة',
    groups: {
      general: 'عام',
      fieldSelection: 'اختيار الحقل',
      fieldMovement: 'تحريك الحقل',
      fieldResizing: 'تغيير حجم الحقل',
    },
    actions: {
      undo: 'تراجع',
      redo: 'إعادة',
      redoAlt: 'إعادة (بديل)',
      toggleShortcuts: 'تبديل الاختصارات',
      deselectField: 'إلغاء تحديد الحقل',
      deleteField: 'حذف الحقل المحدد',
      duplicateField: 'تكرار الحقل',
      moveUp: 'تحريك الحقل للأعلى',
      moveDown: 'تحريك الحقل للأسفل',
      moveLeft: 'تحريك الحقل لليسار',
      moveRight: 'تحريك الحقل لليمين',
      moveFaster: 'تحريك أسرع (5x)',
      decreaseHeight: 'تقليل الارتفاع',
      increaseHeight: 'زيادة الارتفاع',
      decreaseWidth: 'تقليل العرض',
      increaseWidth: 'زيادة العرض',
      resizeFaster: 'تغيير الحجم أسرع (5x)',
    },
  },

  // Validation messages
  validation: {
    errors: 'أخطاء التحقق',
    someFieldsHaveIssues: 'بعض الحقول بها مشاكل',
    errorsFound: 'خطأ/أخطاء في',
    fieldsWithErrors: 'حقل/حقول',
    andMore: 'و {count} أخرى',
    fixErrors: 'إصلاح الأخطاء',
    downloadAnyway: 'تحميل على أي حال',
  },

  // Form field labels
  formFields: {
    idNumber: 'رقم الهوية',
    immigrationDate: 'تاريخ الهجرة',
    taxYear: 'السنة الضريبية',
    doYouHaveId: 'هل لديك هوية؟',
    familyName: 'اسم العائلة',
    passportNumber: 'رقم جواز السفر',
    firstName: 'الاسم الأول',
    dateOfBirth: 'تاريخ الميلاد',
    areYouImmigrant: 'هل أنت مهاجر؟',
    streetAddress: 'عنوان الشارع',
    streetNumber: 'رقم المبنى',
    city: 'المدينة',
    zipCode: 'الرمز البريدي',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    maritalStatus: 'الحالة الاجتماعية',
    single: 'أعزب/عزباء',
    married: 'متزوج/ة',
    separated: 'منفصل/ة',
    widowed: 'أرمل/ة',
    divorced: 'مطلق/ة',
    spouseHasId: 'هل للزوج/ة هوية؟',
    spouseId: 'هوية الزوج/ة',
    spousePassport: 'جواز سفر الزوج/ة',
    spouseLastName: 'اسم عائلة الزوج/ة',
    spouseFirstName: 'الاسم الأول للزوج/ة',
    spouseDateOfBirth: 'تاريخ ميلاد الزوج/ة',
    spouseIsImmigrant: 'هل الزوج/ة مهاجر/ة؟',
    spouseImmigrationDate: 'تاريخ هجرة الزوج/ة',
    spouseHasIncome: 'هل للزوج/ة دخل؟',
    spouseIncomeType: 'نوع دخل الزوج/ة',
    jobBusinessAllowance: 'عمل/تجارة/بدل',
    otherIncome: 'دخل آخر',
    livingInIsrael: 'تعيش في إسرائيل؟',
    kibbutzMember: 'هل أنت عضو في كيبوتس أو موشاف تعاوني؟',
    kibbutzOptions: {
      no: 'لا. لست عضواً في كيبوتس أو موشاف تعاوني',
      yesNotTransferred: 'نعم. دخلي من هذا المشغل لا يُحوّل للكيبوتس',
      yesTransferred: 'نعم. دخلي من هذا المشغل يُحوّل للكيبوتس',
    },
    healthcareMember: 'هل أنت عضو في صندوق صحي؟',
    selectHealthcare: 'اختر صندوقك الصحي',
    healthcareProviders: {
      clalit: 'كلاليت',
      maccabi: 'مكابي',
      meuhedet: 'مئوحيدت',
      leumit: 'لئوميت',
    },
    email: 'البريد الإلكتروني',
    phoneNumber: 'رقم الهاتف',
    mobilePhone: 'رقم الجوال',
    doYouHaveChildren: 'هل لديك أطفال؟',
    children: 'الأطفال',
    childName: 'الاسم',
    childDateOfBirth: 'تاريخ الميلاد',
    childIdNumber: 'رقم الهوية',
  },
};
