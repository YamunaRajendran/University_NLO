type Language = 'en' | 'ar';

const translations: Record<string, Record<Language, string>> = {
  "Education": {
    en: "Education",
    ar: "التعليم"
  },
  "Education Degree Overview": {
    en: "Education Degree Overview",  
    ar:"نظرة عامة على الدرجات العلمية"
  },
  "Total Metrics": {
    en: "Total Metrics",
    ar: "إجمالي المقاييس"
  },
  "Total Graduates": {
    en: "Total Graduates",
    ar: "إجمالي الخريجين"
  },
  "Average Salary": {
    en: "Average Salary",
    ar: "متوسط الأجور"
  },
  "Employment Rate": {
    en: "Employment Rate",
    ar: "نسبة التوظيف"
  },
  "Time to Employment": {
    en: "Time to Employment",
    ar: "متوسط مدة الانتظار للتوظيف"
  },
  "Job Seekers": {
    en: "Job Seekers",
    ar:"عدد الباحثين عن العمل"  
  },
  "Total Job Seekers": {
    en: "Total Job Seekers",
    ar:"عدد الباحثين عن العمل"
  },
  "months": {
    en: "months",
    ar: "شهر"
  },
  "Total Student Enrollment": {
    en: "Total Student Enrollment",
    ar: "إجمالي عدد الطلاب المسجلين"
  },
  "Number of Universities and Educational Institutions": {
    en: "Number of Universities and Educational Institutions",
    ar: "عدد الجامعات والمؤسسات التعليمية"
  },
  "Public Universities": {
    en: "Public Universities",
    ar: "الجامعات الحكومية"
  },
  "Private Universities": {
    en: "Private Universities",
    ar: "الجامعات الخاصة"
  },
  "Bachelor's": {
    en: "Bachelor's",
    ar: "بكالوريوس"
  },
  "Saudi Arabia Graduates Observation": {
    en: "Saudi Arabia Graduates Observation",
    ar: " رصد الخريجين في المملكة العربية السعودية"  },
  "Saudi Arabia Graduates Observation (Readings, Statistics)": {
    en: "Saudi Arabia Graduates Observation (Readings, Statistics)",
    ar: "مرصد خريجي المملكة العربية السعودية (قراءات وإحصائيات)"
  },
  "Master's": {
    en: "Master's",
    ar: "الماجستير"
  },
  "Associate Diploma": {
    en: "Associate Diploma",
    ar: "الدبلوم المشارك"
  },
  "Intermediate Diploma": {
    en: "Intermediate Diploma",
    ar: "الدبلوم المتوسط"
  },
  "Higher Diploma": {
    en: "Higher Diploma",
    ar: "الدبلوم العالي"
  },
  "Fellowship": {
    en: "Fellowship",
    ar: "الزمالة"
  },
  "PhD": {
    en: "PhD",
    ar: "دكتوراه"
  },
  "Degree": {
    en: "Degree",
    ar: "الدرجة العلمية"
  },
  "Overview": {
    en: "Overview",
    ar: "نظرة عامة"
  },
  "Data Source: National Labor Observatory": {
    en: "Data Source: National Labor Observatory",
    ar: "مصدر البيانات: مرصد العمل الوطني"
  },
  "Last Updated: January 2025": {
    en: "Last Updated: January 2025",
    ar: "اخر تحديث: يناير 2025"
  },
  "The dashboard provides insights from university graduates, helping educational institutes and decision-makers analyze the growth and impact of various majors": {
    en: "The dashboard provides insights from university graduates, helping educational institutes and decision-makers analyze the growth and impact of various majors",
    ar: "يوفر هذا الموقع رؤى من خريجي الجامعات، مما يساعد المؤسسات التعليمية وصناع القرار في تحليل نمو وتأثير مختلف التخصصات"
  },
  // Major names
  "Information Technology": {
    en: "Information Technology",
    ar: "تقنية المعلومات"
  },
  "Business and Law": {
    en: "Business and Law",
    ar: "الأعمال والقانون"
  },
  "Arts and Humanities": {
    en: "Arts and Humanities",
    ar: "الفنون والعلوم الإنسانية"
  },
  "Health and Welfare": {
    en: "Health and Welfare",
    ar: "الصحة والرفاه"
  },
  "Sciences and Mathematics": {
    en: "Sciences and Mathematics",
    ar: "العلوم والرياضيات"
  },
  "Engineering": {
    en: "Engineering",
    ar: "الهندسة"
  },
  "Agriculture": {
    en: "Agriculture",
    ar: "الزراعة"
  },
  "Social Sciences": {
    en: "Social Sciences",
    ar: "العلوم الاجتماعية"
  },
  "Generic Programs": {
    en: "Generic Programs",
    ar: "البرامج العامة"
  },
  "Services": {
    en: "Services",
    ar: "الخدمات"
  },
  "employed": {
    en: "employed",
    ar: "موظف"
  },
  "graduates": {
    en: "graduates",
    ar: "خريج"
  },
  "Before Graduation": {
    en: "Before Graduation",
    ar: "موظف أثناء الدراسة "
  },
  "Within First Year": {
    en: "Within First Year",
    ar: "توظف خلال سنة بعد التخرج"
  },
  "After First Year": {
    en: "After First Year",
    ar: "توظف بعد سنة من التخرج"
  },
  "No data available": {
    en: "No data available",
    ar: "لا توجد بيانات متاحة"
  },
  "Top Popular Occupations": {
    en: "Top Popular Occupations",
    ar: "أكثر الوظائف شيوعاً"
  },
  "Top 5 Occupation by Salary": {
    en: "Top 5 Occupation by Salary",
    ar: "أعلى 5 وظائف من حيث الراتب"
  },
  "Employment Rate by Specialization": {
    en: "Employment Rate by Specialization",
    ar: "نسبة التوظيف حسب التخصصات التفصيلية"
  },
  "Narrow Majors By Time of Employment": {
    en: "Narrow Majors By Time of Employment",
    ar: "التخصصات الدقيقة حسب وقت التوظيف"
  },
  "Top Specialization by Gender": {
    en: "Top Specialization by Gender",
    ar: "توزيع أعلى التخصصات التفصيلية حسب الجنس"
  },
  "Specialization By Time of Employment": {
    en: "Specialization By Time of Employment",
    ar: "توزيع التخصصات حسب وقت التوظيف"
  },
  "Top Narrow Majors by Gender": {
    en: "Top Narrow Majors by Gender",
    ar: "توزيع أعلى التخصصات الدقيقة حسب الجنس"
  },
  "SAR": {
    en: "SAR",
    ar: "ريال"
  },
  
  "Graduate data sources": {
    en: "Graduate data sources",
    ar: "مصادر بيانات الخريجين"
  },
  "Employment data sources": {
    en: "Employment data sources",
    ar: "مصادر بيانات التوظيف"
  },
  "Data sources for job seekers": {
    en: "Data sources for job seekers",
    ar: "مصادر بيانات الباحثين عن عمل"
  },
  "Universities and educational institutions": {
    en: "Universities and educational institutions",
    ar: "الجامعات والمؤسسات التعليمية"
  },
  "Ministry of Human Resources and Social Development, General Organization for Social Insurance": {
    en: "Ministry of Human Resources and Social Development, General Organization for Social Insurance",
    ar: "وزارة الموارد البشرية والتنمية الاجتماعية، المؤسسة العامة للتأمينات الاجتماعية"
  },
  "Jadarat Platform - Human Resources Development Fund (HRDF)": {
    en: "Jadarat Platform - Human Resources Development Fund (HRDF)",
    ar: "منصة جدارات - صندوق تنمية الموارد البشرية"
  },
  "Data for 2022 Graduates and their Employment through December 2023": {
    en: "Data for 2022 Graduates and their Employment through December 2023",
    ar: "بيانات الخريجين لعام 2022 وتوظيفهم حتى ديسمبر 2023"
  },
  "Male": {
    en: "Male",
    ar: "ذكر"
  },
  "Female": {
    en: "Female",
    ar: "أنثى"
  },
};

export function getTranslation(key: string, language: Language): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  return translation[language] || key;
}
