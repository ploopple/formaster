const fs = require('fs');
const path = require('path');

// Translation mappings for common field names
const translations = {
  "ID number": { nameHe: "מספר זהות", nameAr: "رقم الهوية", nameRu: "Номер удостоверения", nameAm: "የመታወቂያ ቁጥር" },
  "Immigration Date": { nameHe: "תאריך עלייה", nameAr: "تاريخ الهجرة", nameRu: "Дата иммиграции", nameAm: "የስደት ቀን" },
  "Tax Year": { nameHe: "שנת מס", nameAr: "السنة الضريبية", nameRu: "Налоговый год", nameAm: "የግብር ዓመት" },
  "Do you have an ID?": { nameHe: "האם יש לך תעודת זהות?", nameAr: "هل لديك هوية؟", nameRu: "Есть ли у вас удостоверение?", nameAm: "መታወቂያ አለዎት?" },
  "Family Name": { nameHe: "שם משפחה", nameAr: "اسم العائلة", nameRu: "Фамилия", nameAm: "የቤተሰብ ስም" },
  "Passport Number": { nameHe: "מספר דרכון", nameAr: "رقم جواز السفر", nameRu: "Номер паспорта", nameAm: "የፓስፖርት ቁጥር" },
  "First Name": { nameHe: "שם פרטי", nameAr: "الاسم الأول", nameRu: "Имя", nameAm: "የመጀመሪያ ስም" },
  "Date of Birth": { nameHe: "תאריך לידה", nameAr: "تاريخ الميلاد", nameRu: "Дата рождения", nameAm: "የልደት ቀን" },
  "Are you an immigrant?": { nameHe: "האם אתה עולה חדש?", nameAr: "هل أنت مهاجر؟", nameRu: "Вы иммигрант?", nameAm: "ስደተኛ ነዎት?" },
  "Street Address": { nameHe: "כתובת רחוב", nameAr: "عنوان الشارع", nameRu: "Адрес улицы", nameAm: "የጎዳና አድራሻ" },
  "Street address number": { nameHe: "מספר בית", nameAr: "رقم المنزل", nameRu: "Номер дома", nameAm: "የቤት ቁጥር" },
  "City": { nameHe: "עיר", nameAr: "المدينة", nameRu: "Город", nameAm: "ከተማ" },
  "ZIP Code": { nameHe: "מיקוד", nameAr: "الرمز البريدي", nameRu: "Почтовый индекс", nameAm: "የፖስታ ኮድ" },
  "Gender": { nameHe: "מין", nameAr: "الجنس", nameRu: "Пол", nameAm: "ጾታ" },
  "marital status": { nameHe: "מצב משפחתי", nameAr: "الحالة الاجتماعية", nameRu: "Семейное положение", nameAm: "የጋብቻ ሁኔታ" },
  "does spouse have ID?": { nameHe: "האם לבן/בת הזוג יש תעודת זהות?", nameAr: "هل لدى الزوج/ة هوية؟", nameRu: "Есть ли у супруга удостоверение?", nameAm: "የትዳር ጓደኛ መታወቂያ አለው?" },
  "spouse ID": { nameHe: "מספר זהות בן/בת זוג", nameAr: "رقم هوية الزوج/ة", nameRu: "Номер удостоверения супруга", nameAm: "የትዳር ጓደኛ መታወቂያ ቁጥር" },
  "spuse passport": { nameHe: "מספר דרכון בן/בת זוג", nameAr: "رقم جواز سفر الزوج/ة", nameRu: "Номер паспорта супруга", nameAm: "የትዳር ጓደኛ ፓስፖርት" },
  "spuse last name": { nameHe: "שם משפחה בן/בת זוג", nameAr: "اسم عائلة الزوج/ة", nameRu: "Фамилия супруга", nameAm: "የትዳር ጓደኛ የቤተሰብ ስም" },
  "spouse first name": { nameHe: "שם פרטי בן/בת זוג", nameAr: "الاسم الأول للزوج/ة", nameRu: "Имя супруга", nameAm: "የትዳር ጓደኛ የመጀመሪያ ስም" },
  "spouse date of birth": { nameHe: "תאריך לידה בן/בת זוג", nameAr: "تاريخ ميلاد الزوج/ة", nameRu: "Дата рождения супруга", nameAm: "የትዳር ጓደኛ የልደት ቀን" },
  "is spuse an immigrant?": { nameHe: "האם בן/בת הזוג עולה חדש?", nameAr: "هل الزوج/ة مهاجر؟", nameRu: "Супруг иммигрант?", nameAm: "የትዳር ጓደኛ ስደተኛ ነው?" },
  "spouse immigration date": { nameHe: "תאריך עלייה בן/בת זוג", nameAr: "تاريخ هجرة الزوج/ة", nameRu: "Дата иммиграции супруга", nameAm: "የትዳር ጓደኛ የስደት ቀን" },
  "does spouse have an income?": { nameHe: "האם לבן/בת הזוג יש הכנסה?", nameAr: "هل لدى الزوج/ة دخل؟", nameRu: "Есть ли у супруга доход?", nameAm: "የትዳር ጓደኛ ገቢ አለው?" },
  "spuse income type": { nameHe: "סוג הכנסה בן/בת זוג", nameAr: "نوع دخل الزوج/ة", nameRu: "Тип дохода супруга", nameAm: "የትዳር ጓደኛ የገቢ አይነት" },
  "living in israel?": { nameHe: "מתגורר בישראל?", nameAr: "هل تعيش في إسرائيل؟", nameRu: "Проживаете в Израиле?", nameAm: "በእስራኤል ይኖራሉ?" },
  "Are you a member of a Kibbutz or Cooperative Moshav?": { nameHe: "האם אתה חבר קיבוץ או מושב שיתופי?", nameAr: "هل أنت عضو في كيبوتس أو موشاف تعاوني؟", nameRu: "Вы член кибуца или кооперативного мошава?", nameAm: "የኪቡትዝ ወይም የትብብር ሞሻቭ አባል ነዎት?" },
  "Are you a member of a healthcare provider?": { nameHe: "האם אתה חבר בקופת חולים?", nameAr: "هل أنت عضو في صندوق صحي؟", nameRu: "Вы член больничной кассы?", nameAm: "የጤና መድን አባል ነዎት?" },
  "Select your healthcare provider": { nameHe: "בחר קופת חולים", nameAr: "اختر صندوقك الصحي", nameRu: "Выберите больничную кассу", nameAm: "የጤና መድንዎን ይምረጡ" },
  "email": { nameHe: "דואר אלקטרוני", nameAr: "البريد الإلكتروني", nameRu: "Электронная почта", nameAm: "ኢሜይል" },
  "phone number": { nameHe: "מספר טלפון", nameAr: "رقم الهاتف", nameRu: "Номер телефона", nameAm: "ስልክ ቁጥር" },
  "mobile phone number": { nameHe: "מספר טלפון נייד", nameAr: "رقم الهاتف المحمول", nameRu: "Номер мобильного телефона", nameAm: "የሞባይል ስልክ ቁጥር" },
  "Do you have children": { nameHe: "האם יש לך ילדים?", nameAr: "هل لديك أطفال؟", nameRu: "Есть ли у вас дети?", nameAm: "ልጆች አሉዎት?" },
  "Children": { nameHe: "ילדים", nameAr: "الأطفال", nameRu: "Дети", nameAm: "ልጆች" },
  "Details of my incomes from this employer": { nameHe: "פרטי הכנסותיי ממעסיק זה", nameAr: "تفاصيل دخلي من هذا المشغل", nameRu: "Детали моего дохода от этого работодателя", nameAm: "ከዚህ አሰሪ የገቢዬ ዝርዝሮች" },
  "Current date": { nameHe: "תאריך נוכחי", nameAr: "التاريخ الحالي", nameRu: "Текущая дата", nameAm: "የአሁኑ ቀን" },
  "Sign here": { nameHe: "חתום כאן", nameAr: "وقع هنا", nameRu: "Подпишите здесь", nameAm: "እዚህ ይፈርሙ" },
};

// Option value translations
const optionTranslations = {
  "Yes": { valueHe: "כן", valueAr: "نعم", valueRu: "Да", valueAm: "አዎ" },
  "No": { valueHe: "לא", valueAr: "لا", valueRu: "Нет", valueAm: "አይ" },
  "yes": { valueHe: "כן", valueAr: "نعم", valueRu: "Да", valueAm: "አዎ" },
  "no": { valueHe: "לא", valueAr: "لا", valueRu: "Нет", valueAm: "አይ" },
  "Male": { valueHe: "זכר", valueAr: "ذكر", valueRu: "Мужской", valueAm: "ወንድ" },
  "Female": { valueHe: "נקבה", valueAr: "أنثى", valueRu: "Женский", valueAm: "ሴት" },
  "Single": { valueHe: "רווק/ה", valueAr: "أعزب/عزباء", valueRu: "Холост/Не замужем", valueAm: "ያላገባ" },
  "married": { valueHe: "נשוי/אה", valueAr: "متزوج/ة", valueRu: "Женат/Замужем", valueAm: "ያገባ" },
  "Separated": { valueHe: "פרוד/ה", valueAr: "منفصل/ة", valueRu: "В разводе", valueAm: "የተለያየ" },
  "Widowed": { valueHe: "אלמן/ה", valueAr: "أرمل/ة", valueRu: "Вдовец/Вдова", valueAm: "መበለት" },
  "Divorced": { valueHe: "גרוש/ה", valueAr: "مطلق/ة", valueRu: "Разведен/а", valueAm: "የተፋታ" },
  "Clalit": { valueHe: "כללית", valueAr: "كلاليت", valueRu: "Клалит", valueAm: "ክላሊት" },
  "Macabit": { valueHe: "מכבי", valueAr: "مكابي", valueRu: "Маккаби", valueAm: "ማካቢ" },
  "meuhadet": { valueHe: "מאוחדת", valueAr: "ميؤحيدت", valueRu: "Меухедет", valueAm: "መውሀደት" },
  "Luimet": { valueHe: "לאומית", valueAr: "ليئوميت", valueRu: "Леумит", valueAm: "ሉሚት" },
  "Monthly salary": { valueHe: "משכורת חודשית", valueAr: "راتب شهري", valueRu: "Ежемесячная зарплата", valueAm: "ወርሃዊ ደመወዝ" },
  "Salary for additional employment": { valueHe: "משכורת לעבודה נוספת", valueAr: "راتب لعمل إضافي", valueRu: "Зарплата за дополнительную работу", valueAm: "ለተጨማሪ ስራ ደመወዝ" },
  "Partial salary": { valueHe: "משכורת חלקית", valueAr: "راتب جزئي", valueRu: "Частичная зарплата", valueAm: "ከፊል ደመወዝ" },
  "Wage (Daily rate of pay)": { valueHe: "שכר יומי", valueAr: "أجر يومي", valueRu: "Дневная ставка", valueAm: "የቀን ክፍያ" },
  "Allowance": { valueHe: "קצבה", valueAr: "بدل", valueRu: "Пособие", valueAm: "አበል" },
  "Scholarship": { valueHe: "מלגה", valueAr: "منحة دراسية", valueRu: "Стипендия", valueAm: "ስኮላርሺፕ" },
  "Work": { valueHe: "עבודה", valueAr: "عمل", valueRu: "Работа", valueAm: "ስራ" },
  "Other": { valueHe: "אחר", valueAr: "آخر", valueRu: "Другое", valueAm: "ሌላ" },
  "job/busniss/allownce": { valueHe: "עבודה/עסק/קצבה", valueAr: "عمل/تجارة/بدل", valueRu: "Работа/бизнес/пособие", valueAm: "ስራ/ንግድ/አበል" },
  "other income": { valueHe: "הכנסה אחרת", valueAr: "دخل آخر", valueRu: "Другой доход", valueAm: "ሌላ ገቢ" },
};


// Read the formsData.ts file
const filePath = path.join(__dirname, '..', 'formsData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Parse the file to extract the formsData array
const formsDataMatch = content.match(/export const formsData: FormTemplate\[\] = (\[[\s\S]*\]);/);
if (!formsDataMatch) {
  console.error('Could not find formsData array in file');
  process.exit(1);
}

let formsData;
try {
  formsData = eval(formsDataMatch[1]);
} catch (e) {
  console.error('Error parsing formsData:', e);
  process.exit(1);
}

// Function to add translations to an option
function addTranslationsToOption(option) {
  const optionValue = option.value;
  
  // Skip if already has all translations
  if (option.valueHe && option.valueAr && option.valueRu && option.valueAm) {
    return option;
  }
  
  // Check if we have translations for this option value
  if (optionTranslations[optionValue]) {
    const trans = optionTranslations[optionValue];
    if (!option.valueHe) option.valueHe = trans.valueHe;
    if (!option.valueAr) option.valueAr = trans.valueAr;
    if (!option.valueRu) option.valueRu = trans.valueRu;
    if (!option.valueAm) option.valueAm = trans.valueAm;
  } else {
    // Add empty translations for options without predefined translations
    if (!option.valueHe) option.valueHe = "";
    if (!option.valueAr) option.valueAr = "";
    if (!option.valueRu) option.valueRu = "";
    if (!option.valueAm) option.valueAm = "";
  }
  
  return option;
}

// Function to add translations to a field
function addTranslationsToField(field) {
  const fieldName = field.name;
  
  // Add field name translations if not present
  if (!field.nameHe && !field.nameAr && !field.nameRu && !field.nameAm) {
    if (translations[fieldName]) {
      const trans = translations[fieldName];
      field.nameHe = trans.nameHe;
      field.nameAr = trans.nameAr;
      field.nameRu = trans.nameRu;
      field.nameAm = trans.nameAm;
    } else {
      field.nameHe = "";
      field.nameAr = "";
      field.nameRu = "";
      field.nameAm = "";
    }
  }
  
  // Process options for radio/checkbox/select fields
  if (field.options && Array.isArray(field.options)) {
    field.options = field.options.map(addTranslationsToOption);
  }
  
  return field;
}

// Process all forms and their fields
formsData.forEach(form => {
  if (form.fields && Array.isArray(form.fields)) {
    form.fields = form.fields.map(addTranslationsToField);
  }
});

// Generate the new content
const newFormsDataStr = JSON.stringify(formsData, null, 2);

// Replace the formsData in the original content
const newContent = content.replace(
  /export const formsData: FormTemplate\[\] = \[[\s\S]*\];/,
  `export const formsData: FormTemplate[] = ${newFormsDataStr};`
);

// Write back to file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Translations added to fields and options successfully!');