// Russian translations
import { TranslationKeys } from './en';

export const ru: TranslationKeys = {
  // Common
  common: {
    loading: 'Загрузка...',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    add: 'Добавить',
    clear: 'Очистить',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
    previous: 'Назад',
    search: 'Поиск',
    select: 'Выбрать...',
    yes: 'Да',
    no: 'Нет',
    or: 'или',
    fields: 'поля',
    copied: 'Скопировано!',
    copyJson: 'Копировать JSON',
    page: 'Страница',
    of: 'из',
    reset: 'Сброс',
    hidden: 'Скрыто',
    row: 'Строка',
  },

  // PDF Viewer
  pdfViewer: {
    initializingViewer: 'Инициализация просмотра PDF...',
    loadingPdf: 'Загрузка PDF...',
  },

  // Home page
  home: {
    title: 'Умное заполнение PDF',
    subtitle: 'Загрузите PDF, чтобы начать редактирование полей и заполнение информации.',
    browseTemplates: 'Просмотр шаблонов форм',
    uploadNewPdf: 'Загрузить новый PDF',
    supportedFormats: 'Поддерживаемые форматы: только PDF',
  },

  // Templates page
  templates: {
    title: 'Шаблоны форм',
    subtitle: 'Выберите шаблон формы для заполнения',
    backToHome: 'Вернуться на главную',
    searchPlaceholder: 'Поиск форм...',
    allForms: 'Все формы',
    noFormsFound: 'Формы не найдены',
    tryAdjustingSearch: 'Попробуйте изменить поиск',
    addFormTemplates: 'Добавьте шаблоны форм в formsData.ts',
  },

  // Editor page
  editor: {
    uploadPdf: 'Загрузить PDF',
    selectPdfToStart: 'Выберите PDF файл для начала редактирования',
    choosePdfFile: 'Выбрать PDF файл',
    backToHome: '← Вернуться на главную',
    editorMode: 'Режим редактора',
    fillMode: 'Режим заполнения',
    edit: 'Редактор',
    fill: 'Заполнить',
    saveSnapshot: 'Сохранить снимок',
    undo: 'Отменить',
    redo: 'Повторить',
    keyboardShortcuts: 'Горячие клавиши',
    copyFormConfig: 'Копировать конфигурацию формы как JSON',
    goBackConfirm: 'Вернуться на главную? Несохраненные изменения будут потеряны.',
    deleteAllConfirm: 'Вы уверены, что хотите удалить все поля?',
    failedToLoadForm: 'Не удалось загрузить форму. Убедитесь, что PDF файл существует.',
    failedToGeneratePdf: 'Не удалось создать PDF. Попробуйте снова.',
    failedToCopyJson: 'Не удалось скопировать JSON в буфер обмена',
  },

  // Sidebar
  sidebar: {
    editorMode: 'Режим редактора',
    fillForm: 'Заполнить форму',
    configureFields: 'Настройка полей.',
    fillInformation: 'Заполните информацию.',
    back: 'Назад',
    linked: 'Связано',

    // Field properties
    name: 'Название',
    nameHe: 'Название (иврит)',
    section: 'Раздел',
    noSection: 'Без раздела',
    type: 'Тип',
    value: 'Значение',
    placeholder: 'Подсказка',
    placeholderHe: 'Подсказка (иврит)',

    // Translations section
    translations: 'Переводы',
    translationsHelp: 'Добавьте переводы для этого поля',
    optionTranslation: 'Иврит',

    // Field types
    fieldTypes: {
      text: 'Текст',
      textarea: 'Текстовая область',
      number: 'Число',
      date: 'Дата',
      signature: 'Подпись',
      select: 'Выбор',
      radio: 'Радио',
      checkbox: 'Флажок',
      table: 'Таблица',
      composite: 'Составной текст',
    },

    // Date format
    dateFormat: 'Формат даты',
    hideSeparator: 'Скрыть "/" в PDF',

    // Composite field
    compositeTemplate: 'Составной шаблон',
    compositeHelp:
      'Используйте {text:name} для текстовых полей, {date:name} для дат, {number:name} для чисел. Дочерние поля будут созданы для размещения на PDF.',
    template: 'Шаблон',
    syncChildFields: 'Синхронизировать дочерние поля из шаблона',
    clickSyncToCreate: 'Нажмите "Синхронизировать" для создания позиционируемых дочерних полей',
    childFields: 'Дочерние поля',

    // Visual styling
    visualStyling: 'Визуальное оформление',
    textColor: 'Цвет текста',
    background: 'Фон',
    borderColor: 'Цвет границы',
    borderWidth: 'Ширина границы',
    radius: 'Радиус',
    padding: 'Отступ (px)',

    // Typography
    typography: 'Типографика',
    fontSize: 'Размер шрифта',
    letterSpacing: 'Межбуквенный интервал',
    textAlign: 'Выравнивание текста',
    left: 'Слева',
    center: 'По центру',
    right: 'Справа',

    // Position
    position: 'Позиция',
    page: 'Страница',
    xPosition: 'Позиция X',
    yPosition: 'Позиция Y',
    width: 'Ширина',
    height: 'Высота',

    // Options
    options: 'Варианты',
    addOption: 'Добавить вариант',
    markStyle: 'Стиль отметки',
    markStyles: {
      checkmark: 'Галочка ✓',
      x: 'Крестик ✗',
      circle: 'Круг ○',
      square: 'Квадрат □',
      dot: 'Точка •',
      none: 'Нет (скрыто)',
    },

    // Table
    tableSettings: 'Настройки таблицы',
    maxRows: 'Макс. строк',
    showHeaders: 'Показать заголовки',
    cellPadding: 'Отступ ячейки',
    cellGap: 'Промежуток ячеек',
    columns: 'Столбцы',
    addColumn: 'Добавить столбец',
    columnName: 'Название столбца',
    columnType: 'Тип столбца',
    columnWidth: 'Ширина %',

    // Validation
    validation: 'Валидация',
    addRule: 'Добавить правило',
    required: 'Обязательно',
    pattern: 'Шаблон',
    minLength: 'Мин. длина',
    maxLength: 'Макс. длина',
    min: 'Мин. значение',
    max: 'Макс. значение',
    conditional: 'Условное',
    errorMessage: 'Сообщение об ошибке',
    validationPatterns: {
      email: 'Email',
      phone: 'Телефон',
      israeliId: 'Израильский ID',
      israeliPhone: 'Израильский телефон',
      zipCode: 'Почтовый индекс',
      url: 'URL',
      alphanumeric: 'Буквенно-цифровой',
      lettersOnly: 'Только буквы',
      numbersOnly: 'Только цифры',
      custom: 'Пользовательский шаблон',
    },

    // Document attachment
    documentAttachment: 'Прикрепление документа',
    enableAttachment: 'Включить прикрепление документа',
    attachmentLabel: 'Метка',
    attachmentDescription: 'Описание',
    acceptedTypes: 'Допустимые типы',
    maxFiles: 'Макс. файлов',
    attachmentRequired: 'Обязательно',

    // Actions
    actions: 'Действия',
    duplicateField: 'Дублировать поле',
    addLinkedLocation: 'Добавить связанное расположение',
    addNestedField: 'Добавить вложенное поле',
    deleteField: 'Удалить поле',
    clearAllFields: 'Очистить все поля',
    downloadPdf: 'Скачать PDF',

    // Sections
    sections: 'Разделы',
    addSection: 'Добавить раздел',
    newSectionName: 'Название нового раздела',
    unsectioned: 'Без раздела',

    // Fill mode
    fillStep: 'Шаг',
    of: 'из',
    previousField: 'Назад',
    nextField: 'Далее',
    signHere: 'Подпишите здесь',
    tapToSign: 'Нажмите для подписи',
    uploadDocument: 'Загрузить документ',
    attachedFiles: 'Прикрепленные файлы',
    removeFile: 'Удалить',
  },

  // Signature modal
  signature: {
    title: 'Подписать документ',
    drawHere: 'Нарисуйте вашу подпись здесь',
    clear: 'Очистить',
    save: 'Сохранить подпись',
  },

  // Keyboard shortcuts
  shortcuts: {
    title: 'Горячие клавиши',
    pressToToggle: 'Нажмите ? в любое время для переключения этой панели',
    groups: {
      general: 'Общие',
      fieldSelection: 'Выбор поля',
      fieldMovement: 'Перемещение поля',
      fieldResizing: 'Изменение размера поля',
    },
    actions: {
      undo: 'Отменить',
      redo: 'Повторить',
      redoAlt: 'Повторить (альтернатива)',
      toggleShortcuts: 'Переключить горячие клавиши',
      deselectField: 'Снять выделение поля',
      deleteField: 'Удалить выбранное поле',
      duplicateField: 'Дублировать поле',
      moveUp: 'Переместить поле вверх',
      moveDown: 'Переместить поле вниз',
      moveLeft: 'Переместить поле влево',
      moveRight: 'Переместить поле вправо',
      moveFaster: 'Быстрое перемещение (5x)',
      decreaseHeight: 'Уменьшить высоту',
      increaseHeight: 'Увеличить высоту',
      decreaseWidth: 'Уменьшить ширину',
      increaseWidth: 'Увеличить ширину',
      resizeFaster: 'Быстрое изменение размера (5x)',
    },
  },

  // Validation messages
  validation: {
    errors: 'Ошибки валидации',
    someFieldsHaveIssues: 'Некоторые поля имеют проблемы',
    errorsFound: 'ошибок найдено в',
    fieldsWithErrors: 'полях',
    andMore: 'и еще {count}',
    fixErrors: 'Исправить ошибки',
    downloadAnyway: 'Скачать все равно',
  },

  // Form field labels
  formFields: {
    idNumber: 'Номер ID',
    immigrationDate: 'Дата иммиграции',
    taxYear: 'Налоговый год',
    doYouHaveId: 'У вас есть ID?',
    familyName: 'Фамилия',
    passportNumber: 'Номер паспорта',
    firstName: 'Имя',
    dateOfBirth: 'Дата рождения',
    areYouImmigrant: 'Вы иммигрант?',
    streetAddress: 'Адрес улицы',
    streetNumber: 'Номер дома',
    city: 'Город',
    zipCode: 'Почтовый индекс',
    gender: 'Пол',
    male: 'Мужской',
    female: 'Женский',
    maritalStatus: 'Семейное положение',
    single: 'Холост/Не замужем',
    married: 'Женат/Замужем',
    separated: 'Разделен(а)',
    widowed: 'Вдовец/Вдова',
    divorced: 'Разведен(а)',
    spouseHasId: 'У супруга есть ID?',
    spouseId: 'ID супруга',
    spousePassport: 'Паспорт супруга',
    spouseLastName: 'Фамилия супруга',
    spouseFirstName: 'Имя супруга',
    spouseDateOfBirth: 'Дата рождения супруга',
    spouseIsImmigrant: 'Супруг иммигрант?',
    spouseImmigrationDate: 'Дата иммиграции супруга',
    spouseHasIncome: 'У супруга есть доход?',
    spouseIncomeType: 'Тип дохода супруга',
    jobBusinessAllowance: 'Работа/Бизнес/Пособие',
    otherIncome: 'Другой доход',
    livingInIsrael: 'Проживаете в Израиле?',
    kibbutzMember: 'Вы член кибуца или кооперативного мошава?',
    kibbutzOptions: {
      no: 'Нет. Я не член кибуца или кооперативного мошава',
      yesNotTransferred: 'Да. Мой доход от этого работодателя не переводится в кибуц',
      yesTransferred: 'Да. Мой доход от этого работодателя переводится в кибуц',
    },
    healthcareMember: 'Вы член больничной кассы?',
    selectHealthcare: 'Выберите вашу больничную кассу',
    healthcareProviders: {
      clalit: 'Клалит',
      maccabi: 'Маккаби',
      meuhedet: 'Меухедет',
      leumit: 'Леумит',
    },
    email: 'Электронная почта',
    phoneNumber: 'Номер телефона',
    mobilePhone: 'Мобильный телефон',
    doYouHaveChildren: 'У вас есть дети?',
    children: 'Дети',
    childName: 'Имя',
    childDateOfBirth: 'Дата рождения',
    childIdNumber: 'Номер ID',
  },
};
