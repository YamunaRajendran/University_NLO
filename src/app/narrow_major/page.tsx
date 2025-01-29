"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BiFemale } from "react-icons/bi";
import { BiMale } from "react-icons/bi";
import { PiMoneyFill } from "react-icons/pi";
import { FaBusinessTime } from "react-icons/fa6";
// import { GiGraduateCap } from "react-icons/gi";
import { Row, Col } from "antd";
import { ResponsiveSankey, SankeyNodeDatum } from "@nivo/sankey";
import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";
import { cn } from "../utils/cn";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
// import mockDataMajorEn from "@/app/majors/final_data_15-01 (version2).json";
// import mockDataMajorAr from "@/app/majors/major_insights_arabic.json";
import mockDataMajorEn from "@/app/majors/mock_data_major.json";
import mockDataMajorAr from "@/app/majors/major_insights_arabic.json";
import React from "react";
import {
  FaGraduationCap,
  FaLaptopCode,
  FaBalanceScale,
  FaPaintBrush,
  FaHeartbeat,
  FaFlask,
  FaCogs,
  FaSeedling,
  FaBook,
  FaUserGraduate,
  FaCog,
} from "react-icons/fa";

interface SankeyCustomNodeData {
  id: string;
  nodeColor: string;
}

interface SankeyCustomLinkData {
  source: string;
  target: string;
  value: number;
}

const colorMapping = {
  "Before Graduation": "#c6c630",
  "Within First Year": "#19ce91",
  "After First Year": "#25b0ba",
  "موظف أثناء الدراسة ": "#c6c630",
  "توظف خلال سنة بعد التخرج ": "#19ce91",
  "توظف بعد سنة من التخرج": "#25b0ba",
};

const majorColorMap = {
  "Business Administration": "#2E9C89",
  "Human Resources": "#C3A1F1",
  "Management Information Systems": "#F163F7",
  "English Language (General)": "#4D6A99",
  "Programming and Computer Science": "#D2A53D",
  "Supply Chain Management": "#91B5F4",
  "Mechanical Engineering": "#F7A056",
  "Electrical Engineering Technology": "#6C8DE4",
  "Chemical Engineering Technology": "#E9C835",
  "Mechanical Engineering Technology": "#B7A48B",
  "Control and Automation Engineering Technology": "#E24698",
  "Public Relations": "#9F3DA5",
  "Law": "#6F89D3",
  "Banking and Financial Markets Management": "#3C6BC4",
  "Sharia (Islamic Law)": "#C0E5A9",
  "Mathematics": "#F26C75",
  "Arabic Language and Literature": "#D6AB33",
  "Information Security": "#8E9B6A",
  "Accounting": "#7F6BE5",
  "Medical Laboratory Science": "#F79C1E",
  "Information Technology": "#50B4F3",
  "E-Commerce": "#6F7E40",
  "Public Health": "#EDCD1E",
  "Health Informatics": "#9F8DAF",
  "Marketing": "#F91A7D",
  "Surveying and Geomatics": "#8C435B",
  "Unknown Specializations": "#88E264",
  "Technical Support": "#C9F56E",
  "Tourism Management": "#C775D2",
  "Early Childhood Education": "#F9C176",
  "Home Economics (Educational)": "#55719A",
  "Graphic Design and Digital Media": "#7840B7",
  "Interior Design": "#76B2E5",
  "Library and Information Science": "#7A2F5A",
  "Islamic Da'wah (Preaching)": "#A73654",
  "Islamic Creed (Aqeedah)": "#F16E5C",
  "Quranic Studies": "#7F9C9A",
  "History": "#F37830",
  "Health Promotion": "#1DB5D6",
  "Pharmaceutical Care": "#F00A50",
  "Curricula and Teaching Methods": "#6E8B3B",
  "Social Work": "#22DA3D",
  "Media and Communication": "#F0BC4E",
  "Geography": "#3C1F63",
  "Finance and Investment Management": "#8A56AC",
  "Risk Management and Insurance": "#5A8E7E",
  "Economics (General)": "#8A2B99",
  "General Biology": "#F6A623",
  "Physics": "#4B70D4",
  "Medical Physics": "#7F8047",
  "Chemistry": "#5A3E12",
  "Clinical Nutrition": "#61B23A",
  "Physical Therapy": "#0A9A67",
  "Islamic Studies": "#9B5B2A",
  "Literature, Criticism, and Rhetoric": "#6D60D9",
  "Grammar and Morphology": "#1F7C78",
  "General Dentistry": "#43B5C9",
  "Hisbah (Islamic Accountability)": "#EE1E6F",
  "Arabic for Non-Native Speakers": "#595E96",
  "Hajj and Umrah Management": "#31D2A5",
  "Office Administration": "#BA07F3",
  "Educational Leadership": "#54E88E",
  "Behavioral Disorders and Autism": "#6F94C4",
  "Early Intervention": "#F9A264",
  "Learning Disabilities": "#CB4C29",
  "Toxicology": "#FC004F",
  "Genetics": "#8064AC",
  "Neurology": "#94D64A",
  "Biochemistry": "#663B3B",
  "Arabic Linguistics": "#9B8C10",
  "Sports and Recreational Management": "#B2D13E",
  "Physical Education": "#C057C2",
  "Sports Training": "#2C04E3",
  "Computer Engineering": "#77C7B0",
  "Judicial Studies": "#D9D72D",
  "Epidemiology": "#ED5A8E",
  "Broadcasting, Television, and Film": "#6E8C81",
  "Microbiology": "#C5937F",
  "Construction Engineering Technology": "#774F89",
  "Industrial Engineering and Systems": "#E05B8D",
  "Civil Engineering": "#FC9B1D",
  "Energy Engineering": "#279B76",
  "Advertising and Marketing Communication": "#93929D",
  "Financial Management": "#D88C6F",
  "Sociology": "#8A6A32",
  "Geographical Information Systems (GIS)": "#BB3F8A",
  "English Language and Literature": "#02B0EC",
  "Respiratory Therapy": "#C4F5A6",
  "Biotechnology": "#5588D1",
  "Environmental Sciences": "#C8F1A1",
  "Statistics": "#43B8FC",
  "Molecular and Cellular Biology": "#35A5E3",
  "English Language and Translation": "#81A54C",
  "Biomedical Engineering": "#F04178",
  "Information Systems": "#7A9B88",
  "Diagnostic Radiology": "#F5D2A5",
  "Emergency Medical Services": "#3F1C68",
  "Sunnah and Its Sciences": "#F18E9C",
  "English Language (Educational)": "#234897",
  "Psychology": "#D56F3F",
  "Network Systems Management": "#4A7FB0",
  "Executive Secretarial": "#82A24A",
  "Islamic Education": "#C4F53D",
  "Personality and Social Psychology": "#C7794D",
  "Applied Linguistics": "#6F91A5",
  "Electrical Engineering": "#9A5E87",
  "Pre-Primary Education (Kindergarten)": "#B27D6E",
  "Pharmaceutical Sciences": "#8BCE26",
  "Aviation Administration": "#C1A042",
  "Engineering Administration": "#E52C1F",
  "Carving, Sculpture, and Decoration": "#F04B94",
  "Drawing and Arts": "#93D56A",
  "Printing and Packaging": "#B9E370",
  "Fashion and Textile Design": "#FC2C2E",
  "Product Design": "#7F6E11",
  "Health Education": "#D57B2E",
  "Speech and Language Therapy": "#A91F71",
  "Clinical Psychology": "#79B1C1",
  "French Language and Translation": "#A39E81",
  "Network Engineering": "#A33729",
  "Hotel Management": "#9F4F64",
  "Data Science": "#35E7E4",
  "Language and Communication Disorders": "#72C4D9",
  "Art Education": "#D2C7F0",
  "Clinical Nursing": "#C0E156",
  "Nutrition and Food Science": "#548C7A",
  "Medical Secretarial": "#F3B48E",
  "Oral Public Health": "#D4D9A4",
  "Architecture": "#624593",
  "Special Education": "#51D846",
  "Pharmacy": "#D26D1A",
  "Rehabilitation Medicine": "#9B2F3A",
  "Housing and Family Institution Management": "#F98A4E",
  "Clothing and Textile": "#36BEB3",
  "Family and Childhood Science": "#9138B9",
  "Chemical Engineering": "#E71D64",
  "Sports Science and Physical Activity": "#8A3DC7",
  "Animal Science": "#F88F9A",
  "Computer Engineering Technology": "#31F91A",
  "Other Specializations in Telecommunications and Information Technology Not Classified Elsewhere": "#6D3A0A",
  "Guidance Psychology": "#2D71D0",
  "Translation": "#FF5E9F",
  "Hearing Impairment": "#F583AB",
  "Intellectual Disability": "#28B17C",
  "Forensic Science": "#D7AB78",
  "Science (Educational)": "#17B474",
  "Fundamentals of Education": "#7F4B31",
  "Animal Production and Breeding": "#BE6B8F",
  "Plant Production and Protection": "#6F96AB",
  "Radiology Technology": "#CE5319",
  "Sales Management": "#4C2B7E",
  "Biology (Educational)": "#E345D4",
  "Family Education": "#8F7C45",
  "Foundations of Religion": "#F5921B",
  "Security Sciences": "#A48A90",
  "Occupational Health and Safety": "#A83772",
  "Educational Technology": "#7F5E1F",
  "Elementary Mathematics Education": "#9B9A7F",
  "Anesthesia Technology": "#6A98D0",
  "Islamic Financial Management": "#E299D4",
  "Heritage Resource Management": "#FA1C62",
  "Tourist Guidance": "#D8A69B",
  "Actuarial Sciences": "#A2449F",
  "Plant Science": "#7D70A7",
  "Artificial Intelligence": "#FA4D84",
  "Software Engineering": "#1F8D61",
  "Chinese Language": "#76DBA6",
  "Private Law": "#41C02D",
  "Public Law": "#F8BC4A",
  "Hematology": "#17F9A6",
  "Records and Electronic Archiving Management": "#F3762D",
  "Information Resources and Services Management": "#FF72BC",
  "Political Science": "#3973B5",
  "Sports Operations Research": "#FE9D61",
  "Geology": "#D55329",
  "Hebrew Language": "#E9BCF0",
  "Event Management and Organization": "#C6B916",
  "Functional Studies": "#17E5B0",
  "Health Services Administration": "#B27E6C",
  "Public Administration": "#91B729",
  "Ports and Maritime Transport": "#D06C71",
  "Marine Engineering": "#A74D9F",
  "Mining Engineering": "#D1A66B",
  "Aviation Engineering": "#D3DBF9",
  "Primary Science Education": "#50E55C",
  "Project Management": "#8F1F34",
  "Health Information Management": "#A35479",
  "Electronic Media": "#C5A6F5",
  "Islamic Culture": "#826441",
  "Archaeology": "#D7B4F1",
  "The Holy Quran and Islamic Studies (Educational)": "#58AF7C",
  "Chemistry (Educational)": "#7C4AC5",
  "Arabic Language (Educational)": "#A9C536",
  "Computer Science (Educational)": "#CD51D1",
  "Mathematics (Educational)": "#42F1D4",
  "Physics (Educational)": "#EDBB93",
  "Nuclear Medicine": "#7E3B2A",
  "Industrial Chemistry": "#C16F71",
  "Industrial Engineering Technology": "#7039F7",
  "Network Engineering Technology": "#49B1D5",
  "Cranes": "#6E37F9",
  "Islamic Economics": "#E74D89",
  "Unspecified Specialization in Security Services": "#7C80A7",
  "Car Mechanics": "#1D2B58",
  "Architectural Engineering Technology": "#D7B34C",
  "General Medicine": "#F94D6D",
  "Psychology (Educational)": "#3F8A7A",
  "Organic Chemistry": "#EA5B9A",
  "Primary Education": "#99D89C",
  "Measurement and Evaluation": "#C67A4A",
  "History of Clothing and Embroidery": "#D7A850",
  "Medical Microbiology": "#C23F85",
  "Commercial Law": "#46C935",
  "Environmental Health Sciences": "#A0E327",
  "Environmental Engineering": "#9178F0",
  "Electronics Engineering": "#8B3137",
  "Transport Engineering": "#DE6E2D",
  "Innovative Advertisement Design": "#F69F5F",
  "Survey Engineering": "#9C5F63",
  "Cardiac Planning": "#31F1C4",
  "Heart Catheterization Technology": "#F55A5A",
  "Condensed Matter Physics": "#E47F51",
  "Urban and Regional Planning": "#BC44F1",
  "Construction Engineering and Management": "#C4A256",
  "Basic Medical Sciences": "#6C9A34",
  "Construction Engineering": "#F09371",
  "Computational Linguistics": "#5E8A0A",
  "Unspecified Specialization in Physical Sciences": "#B07FB2",
  "Interdisciplinary Programs in Natural Sciences, Mathematics, and Statistics": "#57A5E6",
  "Human Geography": "#94C725",
  "Educational Psychology": "#5F8D73",
  "Therapeutic Radiology": "#F3A33A",
  "Food Production (Cooking)": "#CD3D5E",
  "Infection Control": "#D3C07B",
  "Electronics and Communications Engineering Technology": "#2D75B0",
  "Women's Studies": "#DBF5E6",
  "Nursing Education": "#91D1CC",
  "Analytical Chemistry": "#4E32AE",
  "Preventive Medicine and Public Health": "#D35B1E",
  "Nursing Research Science": "#96A25F",
  "Other Specializations in Natural Sciences, Mathematics, and Statistics Not Classified Elsewhere": "#FFB839",
  "Early Childhood Development (Nursery)": "#5C4F78",
  "Genetic Medicine": "#D1A17F",
  "Other Specializations in Engineering and Engineering Crafts Not Classified Elsewhere": "#F0A1D3",
  "Nanoscience and Nanotechnology": "#78C1D4",
  "Other Specializations in Health Not Classified Elsewhere": "#D6923E",
  "Veterinary Medicine": "#D2F17E",
  "Optometry": "#4C15F6",
  "Oral and Dental Health": "#F95325",
  "Customer Services": "#C445B3",
  "Physical Chemistry": "#56E7E0",
  "General Surgery": "#8E79AE",
  "Unspecified Specialization in Social and Behavioral Sciences": "#1C1D5A",
  "Primary Education - Islamic Studies": "#4E7A4B",
  "Primary Education - Arabic Language": "#B5D66D",
  "Visual Impairment": "#B25D61",
  "Dental Technology": "#9A83B2",
  "Diabetic Foot Care": "#F6E942",
  "Anatomical Pathology": "#79E76B",
  "Unspecified Specialization in Business, Administration, and Law": "#CF758B",
  "Orthodontics, Face, and Jaw": "#E1D9B1",
  "Maxillofacial Surgery": "#36DA78",
  "Endocrinology": "#C193A1",
  "Emergency Medicine": "#7AB3F7",
  "Behavioral and Emotional Disorders": "#B562A1",
  "Pediatrics": "#A235D1",
  "Clinical Pathology": "#6C87F6",
  "Maternity and Child Nursing": "#D24490",
  "Plastic Surgery": "#C7F78D",
  "Medical Education": "#F6999F",
  "Community Health Nursing / Public Health": "#F2B2D1",
  "Adult and Continuing Education": "#3DFFD0",
  "Quality Management": "#60759E",
  "Criminology": "#AC88A6",
  "Developmental Psychology": "#6B4951",
  "Unspecified Specialization in Health": "#2B6D94",
  "Oral, Maxillofacial, and Jaw Diseases": "#DB93F6",
  "Otolaryngology (ENT) and Head and Neck Surgery": "#8B3E40",
  "Gastrointestinal Surgery": "#DE5F9B",
  "Ophthalmology": "#68A674",
  "Ultrasound Technology": "#4F767B",
  "Vascular Surgery": "#9A4387",
  "Midwifery": "#B28D6F",
  "Astronomy": "#A7C8DA",
  "Nephrology": "#799B0D",
  "Nuclear Physics": "#D19A8C",
  "Arthropods and Parasitology": "#925B6C",
  "Geophysics": "#5F1E9B",
  "Spanish Language": "#B593AF",
  "German Language": "#4F812C",
  "Russian Language": "#C98279",
  "Persian Language": "#93B8A4",
  "Electronics": "#72F5A4",
  "Medical-Surgical Nursing": "#3D4C6F",
  "Agricultural Engineering": "#9E7F6A",
  "Pediatric Dentistry": "#F0E5D1",
  "Rangeland and Forestry": "#7A35A7",
  "Horticulture and Crop Science": "#E5575F",
  "Gastroenterology": "#72E9D5",
  "Dermatology": "#9A71B4",
  "Inorganic Chemistry": "#AD3E59",
  "Rheumatology": "#47B2F9",
  "Anesthesiology": "#D3A3F0",
  "Obstetrics and Gynecology": "#B4E68B",
  "Energy Engineering Technology": "#3B84E2",
  "Pediatric Nursing": "#6C6D78",
  "Periodontology": "#8C5D75",
  "Colon and Rectal Surgery": "#FC9A16",
  "Orthopedic Surgery": "#5B2920",
  "Petroleum and Natural Gas Engineering": "#A46997",
  "Cardiac Imaging": "#4B934B",
  "Materials Engineering": "#71F0A5",
  "Food Manufacturing Engineering": "#F69B64",
  "Japanese Language": "#6B19A6",
  "Geotechnical Engineering": "#9A6F0E",
  "Neuropathology": "#92D2F3",
  "Turkish Language": "#F2A7B7",
  "Arid Land Agriculture": "#8C4C28",
  "Meteorology": "#CAFC8C",
  "Pharmacology": "#6A4F9A",
  "Water Resources Science and Management": "#1F8E5C",
  "Medical Sterilization": "#4B8A96",
  "Maritime Navigation": "#5B7FBF",
  "Mental Health Nursing": "#73B0E3",
  "Control and Measurement Systems Engineering": "#7CBA9A",
  "Geomatics": "#EF8269",
  "Optical Physics": "#4D8CC9",
  "Irrigation and Drainage Engineering": "#9B1B59",
  "Marine Surveying": "#3E76AC",
  "Nuclear Engineering": "#F09F68",
  "Environmental Protection": "#2D4F87",
  "Skills and Personal Development": "#F2D0A6",
  "Unspecified Specialization in Business and Management": "#F7F45B",
  "School Psychology": "#D8C2C4",
  "Emergency Nursing": "#8B3C2A",
  "Applied Behavior Analysis": "#50F284",
  "Prosthetics": "#497B7C",
  "Digital and Visual Production": "#22E7F1",
  "General Advanced Dentistry": "#5F2E77",
  "Prosthodontics": "#E95D78",
  "Other Specializations in Education Not Classified Elsewhere": "#A61C58",
  "Mechatronics Engineering": "#6D508C",
  "Palliative Nursing, Oncology Nursing, and Hematology Nursing": "#83B9B3",
  "Intellectual Security": "#BCA3C1",
  "Dental Restoration": "#D8B47B",
  "Rubber Industry Technology": "#C9723A",
  "General Programs and Qualifications (More Specific)": "#4E72D5",
  "Dental Assistant": "#F3C7A0",
  "Critical Care Nursing for Adults": "#95C141",
  "Agricultural Economics and Food Marketing": "#7D764D",
  "Engines and Vehicles": "#DA5A7B",
  "Intellectual Excellence and Innovation": "#5A8F8F",
  "Unspecified Specialization in the Arts": "#9F9F91",
  "Unspecified Specialization in Humanities (Excluding Languages)": "#4676D0",
  "Civil Defense": "#70BC91",
  "Philosophy": "#8E8A65",
  "Social Studies (Educational)": "#F5C199",
  "Cardiovascular Medicine": "#F4A73C",
  "Multidisciplinary programs and qualifications include health and wellbeing": "#2A8B4F"
};


// Helper function to get English value from translation mapping
const getEnglishValue = (
  currentValue: string,
  mappings:
    | Record<string, { en: string; ar: string }>
    | { en: Record<string, string>; ar: Record<string, string> }
) => {
  // Check if mappings has the structure { en: Record, ar: Record }
  if ("en" in mappings && typeof mappings.en === "object") {
    const isEnglishValue = Object.values(mappings.en).includes(currentValue);
    if (isEnglishValue) return currentValue;

    // Find the key in Arabic values that matches currentValue
    const arabicKey = Object.entries(mappings.ar).find(
      ([_, value]) => value === currentValue
    )?.[0];
    return arabicKey ? mappings.en[arabicKey] : currentValue;
  }

  // For regular mappings with { key: { en, ar } } structure
  const englishKey = Object.entries(mappings).find(
    ([_, value]) => value.en === currentValue || value.ar === currentValue
  )?.[0];
  return englishKey || currentValue;
};

// Major name translations mapping
const majorTranslations = {'Business Administration': 'إدارة الأعمال', 'Human Resources': 'الموارد البشرية', 'Management Information Systems': 'نظم المعلومات الإدارية', 'English Language (General)': 'اللغة الإنجليزية (عام)', 'Programming and Computer Science': 'البرمجة وعلوم الحاسب', 'Supply Chain Management': 'إدارة سلسلة الإمدادات', 'Mechanical Engineering': 'الهندسة الميكانيكية', 'Electrical Engineering Technology': 'تقنية الهندسة الكهربائية', 'Chemical Engineering Technology': 'تقنية الهندسة الكيميائية', 'Mechanical Engineering Technology': 'تقنية الهندسة الميكانيكية', 'Control and Automation Engineering Technology': 'تقنية هندسة التحكم والأتمتة', 'Public Relations': 'العلاقات العامة', 'Law': 'القانون', 'Banking and Financial Markets Management': 'إدارة المصارف والأسواق المالية', 'Sharia (Islamic Law)': 'الشريعة', 'Mathematics': 'الرياضيات', 'Arabic Language and Literature': 'اللغة العربية وآدابها', 'Information Security': 'أمن المعلومات', 'Accounting': 'المحاسبة', 'Medical Laboratory Science': 'المختبرات الطبية', 'Information Technology': 'تقنية المعلومات', 'E-Commerce': 'التجارة الإلكترونية', 'Public Health': 'الصحة العامة', 'Health Informatics': 'المعلوماتية الصحية', 'Marketing': 'التسويق', 'Surveying and Geomatics': 'المساحة', 'Unknown Specializations': 'تخصصات غير معروفة', 'Technical Support': 'الدعم الفني', 'Tourism Management': 'الإدارة السياحية', 'Early Childhood Education': 'الطفولة المبكرة', 'Home Economics (Educational)': 'الاقتصاد المنزلي (تربوي)', 'Graphic Design and Digital Media': 'التصميم الجرافيكي والوسائط الرقمية', 'Interior Design': 'التصميم الداخلي', 'Library and Information Science': 'علوم المكتبات والمعلومات', "Islamic Da'wah (Preaching)": 'الدعوة', 'Islamic Creed (Aqeedah)': 'العقيدة', 'Quranic Studies': 'القرآن وعلومه', 'History': 'التاريخ', 'Health Promotion': 'تعزيز الصحة', 'Pharmaceutical Care': 'الرعاية الصيدلانية', 'Curricula and Teaching Methods': 'المناهج وطرق التدريس', 'Social Work': 'الخدمة الاجتماعية', 'Media and Communication': 'الإعلام', 'Geography': 'الجغرافيا', 'Finance and Investment Management': 'إدارة التمويل والاستثمار', 'Risk Management and Insurance': 'إدارة المخاطر والتأمين', 'Economics (General)': 'الاقتصاد العام', 'General Biology': 'الأحياء العامة', 'Physics': 'الفيزياء', 'Medical Physics': 'الفيزياء الطبية', 'Chemistry': 'الكيمياء', 'Clinical Nutrition': 'التغذية العلاجية', 'Physical Therapy': 'العلاج الطبيعي', 'Islamic Studies': 'الدراسات الإسلامية', 'Literature, Criticism, and Rhetoric': 'الأدب والنقد والبلاغة', 'Grammar and Morphology': 'النحو والصرف', 'General Dentistry': 'طب الأسنان العام', 'Hisbah (Islamic Accountability)': 'الحسبة', 'Arabic for Non-Native Speakers': 'اللغة العربية لغير الناطقين بها', 'Hajj and Umrah Management': 'إدارة أعمال الحج والعمرة', 'Office Administration': 'الإدارة المكتبية', 'Educational Leadership': 'القيادة التربوية', 'Behavioral Disorders and Autism': 'الاضطرابات السلوكية والتوحد', 'Early Intervention': 'التدخل المبكر', 'Learning Disabilities': 'صعوبات التعلم', 'Toxicology': 'علم السموم', 'Genetics': 'علم الوراثة', 'Neurology': 'طب الأعصاب', 'Biochemistry': 'الكيمياء الحيوية', 'Arabic Linguistics': 'اللغويات العربية', 'Sports and Recreational Management': 'الإدارة الرياضية والترويحية', 'Physical Education': 'التربية البدنية', 'Sports Training': 'التدريب الرياضي', 'Computer Engineering': 'هندسة الحاسب الآلي', 'Judicial Studies': 'الدراسات القضائية', 'Epidemiology': 'الوبائيات', 'Broadcasting, Television, and Film': 'الإذاعة والتلفزيون والفيلم', 'Microbiology': 'الأحياء الدقيقة', 'Construction Engineering Technology': 'تقنية هندسة الإنشاءات', 'Industrial Engineering and Systems': 'الهندسة الصناعية والنظم', 'Civil Engineering': 'الهندسة المدنية', 'Energy Engineering': 'هندسة الطاقة', 'Advertising and Marketing Communication': 'الإعلان والاتصال التسويقي', 'Financial Management': 'الإدارة المالية', 'Sociology': 'علم الاجتماع', 'Geographical Information Systems (GIS)': 'نظم المعلومات الجغرافية', 'English Language and Literature': 'اللغة الإنجليزية وآدابها', 'Respiratory Therapy': 'العلاج التنفسي', 'Biotechnology': 'التقنية الحيوية', 'Environmental Sciences': 'العلوم البيئية', 'Statistics': 'الإحصاء', 'Molecular and Cellular Biology': 'علم الأحياء الجزيئية والخلوية', 'English Language and Translation': 'اللغة الإنجليزية والترجمة', 'Biomedical Engineering': 'الهندسة الطبية الحيوية', 'Information Systems': 'نظم المعلومات', 'Diagnostic Radiology': 'الأشعة التشخيصية', 'Emergency Medical Services': 'الخدمات الطبية الطارئة', 'Sunnah and Its Sciences': 'السنة وعلومها', 'English Language (Educational)': 'اللغة الإنجليزية (تربوي)', 'Psychology': 'علم النفس', 'Network Systems Management': 'إدارة أنظمة الشبكات', 'Executive Secretarial': 'السكرتارية التنفيذية', 'Islamic Education': 'التربية الإسلامية', 'Personality and Social Psychology': 'الشخصية وعلم النفس الاجتماعي', 'Applied Linguistics': 'اللغويات التطبيقية', 'Electrical Engineering': 'الهندسة الكهربائية', 'Pre-Primary Education (Kindergarten)': 'تعليم ما قبل الابتدائي (رياض الأطفال)', 'Pharmaceutical Sciences': 'العلوم الصيدلانية', 'Aviation Administration': 'إدارة الطيران', 'Engineering Administration': 'الإدارة الهندسية', 'Carving, Sculpture, and Decoration': 'الحفر والنحت والزخرفة', 'Drawing and Arts': 'الرسم والفنون', 'Printing and Packaging': 'الطباعة والتغليف', 'Fashion and Textile Design': 'تصميم الأزياء والنسيج', 'Product Design': 'تصميم المنتجات', 'Health Education': 'التثقيف الصحي', 'Speech and Language Therapy': 'علاج النطق والتخاطب', 'Clinical Psychology': 'علم النفس العيادي', 'French Language and Translation': 'اللغة الفرنسية والترجمة', 'Network Engineering': 'هندسة الشبكات', 'Hotel Management': 'الإدارة الفندقية', 'Data Science': 'علوم البيانات', 'Language and Communication Disorders': 'اضطرابات اللغة والتواصل', 'Art Education': 'التربية الفنية', 'Clinical Nursing': 'التمريض السريري', 'Nutrition and Food Science': 'التغذية وعلوم الأطعمة', 'Medical Secretarial': 'السكرتارية الطبية', 'Oral Public Health': 'الصحة العامة للأسنان', 'Architecture': 'العمارة', 'Special Education': 'التربية الخاصة', 'Pharmacy': 'الصيدلة', 'Rehabilitation Medicine': 'طب التأهيل', 'Housing and Family Institution Management': 'إدارة السكن والمؤسسات الأسرية', 'Clothing and Textile': 'الملابس والنسيج', 'Family and Childhood Science': 'علوم الأسرة والطفولة', 'Chemical Engineering': 'الهندسة الكيميائية', 'Sports Science and Physical Activity': 'علوم الرياضة والنشاط البدني', 'Animal Science': 'علوم الحيوان', 'Computer Engineering Technology': 'تقنية هندسة الحاسب الآلي', 'Other Specializations in Telecommunications and Information Technology Not Classified Elsewhere': 'تخصصات أخرى في تقنية الاتصالات والمعلومات غير مصنفة في مكان آخر', 'Guidance Psychology': 'علم النفس الإرشادي', 'Translation': 'الترجمة', 'Hearing Impairment': 'الإعاقة السمعية', 'Intellectual Disability': 'الإعاقة العقلية', 'Forensic Science': 'الأدلة الجنائية', 'Science (Educational)': 'العلوم (تربوي)', 'Fundamentals of Education': 'أصول التربية', 'Animal Production and Breeding': 'إنتاج الحيوان وتربيته', 'Plant Production and Protection': 'إنتاج النبات ووقايته', 'Radiology Technology': 'تقنية الأشعة', 'Sales Management': 'إدارة المبيعات', 'Biology (Educational)': 'الأحياء (تربوي)', 'Family Education': 'التربية الأسرية', 'Foundations of Religion': 'أصول الدين', 'Security Sciences': 'العلوم الأمنية', 'Occupational Health and Safety': 'الصحة والسلامة المهنية', 'Educational Technology': 'تقنيات التعليم', 'Elementary Mathematics Education': 'التعليم الابتدائي رياضيات', 'Anesthesia Technology': 'تقنية التخدير', 'Islamic Financial Management': 'الإدارة المالية الإسلامية', 'Heritage Resource Management': 'إدارة موارد التراث', 'Tourist Guidance': 'الإرشاد السياحي', 'Actuarial Sciences': 'العلوم الاكتوارية', 'Plant Science': 'علوم النبات', 'Artificial Intelligence': 'الذكاء الاصطناعي', 'Software Engineering': 'هندسة البرمجيات', 'Chinese Language': 'اللغة الصينية', 'Private Law': 'القانون الخاص', 'Public Law': 'القانون العام', 'Hematology': 'طب أمراض الدم', 'Records and Electronic Archiving Management': 'إدارة السجلات والحفظ الإلكتروني', 'Information Resources and Services Management': 'إدارة مصادر المعلومات وخدماتها', 'Political Science': 'العلوم السياسية', 'Sports Operations Research': 'بحوث العمليات الرياضية', 'Geology': 'الجيولوجيا', 'Hebrew Language': 'اللغة العبرية', 'Event Management and Organization': 'إدارة وتنظيم الفعاليات', 'Functional Studies': 'العلاج الوظيفي', 'Health Services Administration': 'إدارة الخدمات الصحية', 'Public Administration': 'الإدارة العامة', 'Ports and Maritime Transport': 'الموانئ والنقل البحري', 'Marine Engineering': 'الهندسة البحرية', 'Mining Engineering': 'هندسة التعدين', 'Aviation Engineering': 'هندسة الطيران', 'Primary Science Education': 'التعليم الابتدائي علوم', 'Project Management': 'إدارة المشاريع', 'Health Information Management': 'إدارة المعلومات الصحية', 'Electronic Media': 'الإعلام الإلكتروني', 'Islamic Culture': 'الثقافة الإسلامية', 'Archaeology': 'الآثار', 'The Holy Quran and Islamic Studies (Educational)': 'القرآن الكريم والدراسات الإسلامية (تربوي)', 'Chemistry (Educational)': 'الكيمياء (تربوي)', 'Arabic Language (Educational)': 'اللغة العربية (تربوي)', 'Computer Science (Educational)': 'علوم الحاسب الآلي (تربوي)', 'Mathematics (Educational)': 'الرياضيات (تربوي)', 'Physics (Educational)': 'الفيزياء (تربوي)', 'Nuclear Medicine': 'الطب النووي', 'Industrial Chemistry': 'الكيمياء الصناعية', 'Industrial Engineering Technology': 'تقنية الهندسة الصناعية', 'Network Engineering Technology': 'تقنية هندسة الشبكات', 'Cranes': 'الرافعات', 'Islamic Economics': 'الاقتصاد الإسلامي', 'Unspecified Specialization in Security Services': 'تخصص غير محدد في خدمات الأمن', 'Car Mechanics': 'ميكانيكا السيارات', 'Architectural Engineering Technology': 'تقنية الهندسة المعمارية', 'General Medicine': 'الطب العام', 'Psychology (Educational)': 'علم النفس (تربوي)', 'Organic Chemistry': 'الكيمياء العضوية', 'Primary Education': 'التعليم الابتدائي', 'Measurement and Evaluation': 'القياس والتقويم', 'History of Clothing and Embroidery': 'تاريخ الملابس والتطريز', 'Medical Microbiology': 'علم الأحياء الدقيقة الطبية', 'Commercial Law': 'القانون التجاري', 'Environmental Health Sciences': 'علوم صحة البيئة', 'Environmental Engineering': 'الهندسة البيئية', 'Electronics Engineering': 'هندسة الإلكترونيات', 'Transport Engineering': 'هندسة النقل', 'Innovative Advertisement Design': 'التصميم الابتكاري للإعلان', 'Survey Engineering': 'هندسة المساحة', 'Cardiac Planning': 'تخطيط القلب', 'Heart Catheterization Technology': 'تقنية قسطرة القلب', 'Condensed Matter Physics': 'فيزياء الحالة المكثفة', 'Urban and Regional Planning': 'التخطيط الحضري والإقليمي', 'Construction Engineering and Management': 'هندسة وإدارة التشييد', 'Basic Medical Sciences': 'العلوم الطبية الأساسية', 'Construction Engineering': 'هندسة الإنشاءات', 'Computational Linguistics': 'اللغويات الحاسوبية', 'Unspecified Specialization in Physical Sciences': 'تخصص غير محدد في العلوم الفيزيائية', 'Interdisciplinary Programs in Natural Sciences, Mathematics, and Statistics': 'برامج ومؤهلات متعددة التخصصات تتضمن العلوم الطبيعية والرياضيات والإحصاء', 'Human Geography': 'الجغرافية البشرية', 'Educational Psychology': 'علم النفس التربوي', 'Therapeutic Radiology': 'الأشعة العلاجية', 'Food Production (Cooking)': 'إنتاج الطعام (الطهي)', 'Infection Control': 'مكافحة العدوى', 'Electronics and Communications Engineering Technology': 'تقنية هندسة الإلكترونيات والاتصالات', "Women's Studies": 'دراسات المرأة', 'Nursing Education': 'تعليم التمريض', 'Analytical Chemistry': 'الكيمياء التحليلية', 'Preventive Medicine and Public Health': 'الطب الوقائي والصحة العامة', 'Nursing Research Science': 'علوم بحوث تمريض', 'Other Specializations in Natural Sciences, Mathematics, and Statistics Not Classified Elsewhere': 'تخصصات أخرى في العلوم الطبيعية والرياضيات والإحصاء غير مصنفة في مكان آخر', 'Early Childhood Development (Nursery)': 'تنمية الطفولة المبكرة (حضانة)', 'Genetic Medicine': 'طب الوراثة', 'Other Specializations in Engineering and Engineering Crafts Not Classified Elsewhere': 'تخصصات أخرى في الهندسة والحرف الهندسية غير مصنفة في مكان آخر', 'Nanoscience and Nanotechnology': 'علم وتقنية النانو', 'Other Specializations in Health Not Classified Elsewhere': 'تخصصات أخرى في الصحة غير مصنفة في مكان آخر', 'Veterinary Medicine': 'الطب البيطري', 'Optometry': 'البصريات', 'Oral and Dental Health': 'صحة الفم والأسنان', 'Customer Services': 'خدمات العملاء', 'Physical Chemistry': 'الكيمياء الفيزيائية', 'General Surgery': 'الجراحة العامة', 'Unspecified Specialization in Social and Behavioral Sciences': 'تخصص غير محدد في العلوم الاجتماعية والسلوكية', 'Primary Education - Islamic Studies': 'التعليم الابتدائي دراسات إسلامية', 'Primary Education - Arabic Language': 'التعليم الابتدائي لغة عربية', 'Visual Impairment': 'الإعاقة البصرية', 'Dental Technology': 'تقنية الأسنان', 'Diabetic Foot Care': 'تمريض رعاية القدم السكرية', 'Anatomical Pathology': 'علم الأمراض التشريحي', 'Unspecified Specialization in Business, Administration, and Law': 'تخصص غير محدد في الأعمال والإدارة والقانون', 'Orthodontics, Face, and Jaw': 'تقویم الأسنان والوجه والفكین', 'Maxillofacial Surgery': 'جراحة الوجه والفكين', 'Endocrinology': 'طب أمراض الغدد الصماء', 'Emergency Medicine': 'طب الطوارئ', 'Behavioral and Emotional Disorders': 'الاضطرابات السلوكية والانفعالية', 'Pediatrics': 'طب الأطفال', 'Clinical Pathology': 'علم الأمراض السريرية', 'Maternity and Child Nursing': 'تمريض الأمومة والطفولة', 'Plastic Surgery': 'جراحة التجميل', 'Medical Education': 'التعليم الطبي', 'Community Health Nursing / Public Health': 'تمريض صحة المجتمع / صحة عامة', 'Adult and Continuing Education': 'تعليم الكبار والتعليم المستمر', 'Quality Management': 'إدارة الجودة', 'Criminology': 'علم الجريمة', 'Developmental Psychology': 'علم نفس النمو', 'Unspecified Specialization in Health': 'تخصص غير محدد في الصحة', 'Oral, Maxillofacial, and Jaw Diseases': 'أمراض الفم والوجه والفكين', 'Otolaryngology (ENT) and Head and Neck Surgery': 'جراحة الأنف والأذن والحنجرة والرأس والعنق', 'Gastrointestinal Surgery': 'جراحة الجهاز الهضمي', 'Ophthalmology': 'طب العيون', 'Ultrasound Technology': 'الأشعة فوق الصوتية', 'Vascular Surgery': 'جراحة الأوعية الدموية', 'Midwifery': 'القبالة', 'Astronomy': 'الفلك', 'Nephrology': 'طب الكلى', 'Nuclear Physics': 'الفيزياء النووية', 'Arthropods and Parasitology': 'المفصليات والطفيليات', 'Geophysics': 'الجيوفيزياء', 'Spanish Language': 'اللغة الإسبانية', 'German Language': 'اللغة الألمانية', 'Russian Language': 'اللغة الروسية', 'Persian Language': 'اللغة الفارسية', 'Electronics': 'الإلكترونيات', 'Medical-Surgical Nursing': 'تمريض الباطنة والجراحة', 'Agricultural Engineering': 'الهندسة الزراعية', 'Pediatric Dentistry': 'طب أسنان الاطفال', 'Rangeland and Forestry': 'المراعي والغابات', 'Horticulture and Crop Science': 'البستنة والمحاصيل', 'Gastroenterology': 'أمراض الجهاز الهضمي', 'Dermatology': 'طب الأمراض الجلدية', 'Inorganic Chemistry': 'الكيمياء غير العضوية', 'Rheumatology': 'طب الأمراض الرثوية', 'Anesthesiology': 'طب التخدير', 'Obstetrics and Gynecology': 'طب النساء والولادة', 'Energy Engineering Technology': 'تقنية هندسة الطاقة', 'Pediatric Nursing': 'تمريض الأطفال', 'Periodontology': 'طب دواعم السن', 'Colon and Rectal Surgery': 'جراحة القولون والمستقيم', 'Orthopedic Surgery': 'جراحة العظام', 'Petroleum and Natural Gas Engineering': 'هنـدسـة النفط والغاز الطبيعي', 'Cardiac Imaging': 'تصوير القلب', 'Materials Engineering': 'هندسة المواد', 'Food Manufacturing Engineering': 'هندسة التصنيع الغذائي', 'Japanese Language': 'اللغة اليابانية', 'Geotechnical Engineering': 'الهندسة الجيوتكنيكية', 'Neuropathology': 'علم أمراض الأعصاب', 'Turkish Language': 'اللغة التركية', 'Arid Land Agriculture': 'زراعة المناطق الجافة', 'Meteorology': 'الأرصاد', 'Pharmacology': 'علم الأدوية', 'Water Resources Science and Management': 'علوم وإدارة موارد المياه', 'Medical Sterilization': 'التعقيم الطبي', 'Maritime Navigation': 'الملاحة البحرية', 'Mental Health Nursing': 'تمريض الصحة النفسية والعقلية', 'Control and Measurement Systems Engineering': 'هندسة نظم التحكم والقياس', 'Geomatics': 'الجيوماتكس', 'Optical Physics': 'فيزياء البصريات', 'Irrigation and Drainage Engineering': 'هندسة الري والصرف', 'Marine Surveying': 'المساحة البحرية', 'Nuclear Engineering': 'الهندسة النووية', 'Environmental Protection': 'حماية البيئة', 'Skills and Personal Development': 'تنمية المهارات والتنمية الشخصية', 'Unspecified Specialization in Business and Management': 'تخصص غير محدد في الأعمال والإدارة', 'School Psychology': 'علم النفس المدرسي', 'Emergency Nursing': 'تمريض الطوارئ', 'Applied Behavior Analysis': 'تحليل السلوك التطبيقي', 'Prosthetics': 'الأطراف الصناعية', 'Digital and Visual Production': 'الإنتاج الرقمي والمرئي', 'General Advanced Dentistry': 'طب الأسنان المتقدم العام', 'Prosthodontics': 'طب الأسنان التعويضي', 'Other Specializations in Education Not Classified Elsewhere': 'تخصصات أخرى في التعليم غير مصنفه في مكان آخر', 'Mechatronics Engineering': 'هندسة الميكاترونكس', 'Palliative Nursing, Oncology Nursing, and Hematology Nursing': 'التمريض التلطيفي وتمريض الأورام وأمراض الدم', 'Intellectual Security': 'الأمن الفكري', 'Dental Restoration': 'اصلاح الأسنان', 'Rubber Industry Technology': 'تقنية صناعة المطاط', 'General Programs and Qualifications (More Specific)': 'البرامج العامة والمؤهلات غير محددة أكثر', 'Dental Assistant': 'مساعد طبيب أسنان', 'Critical Care Nursing for Adults': 'تمريض الرعاية الحرجة للكبار', 'Agricultural Economics and Food Marketing': 'الاقتصاد الزراعي والتسويق الغذائي', 'Engines and Vehicles': 'المحركات والمركبات', 'Intellectual Excellence and Innovation': 'التفوق العقلي والابتكار', 'Unspecified Specialization in the Arts': 'تخصص غير محدد في الفنون', 'Unspecified Specialization in Humanities (Excluding Languages)': 'تخصص غير محدد في الدراسات الإنسانية باستثناء اللغات', 'Civil Defense': 'الدفاع المدني', 'Philosophy': 'الفلسفة', 'Social Studies (Educational)': 'الاجتماعيات (تربوي)', 'Cardiovascular Medicine': 'طب القلب والأوعية الدموية', 'Multidisciplinary programs and qualifications include health and wellbeing': 'البرامج والمؤهلات متعددة التخصصات تتضمن الصحة والرفاه', 'Echocardiography': 'تقنية الموجات الصوتية للقلب'};

// Helper function to get English name from Arabic
const getEnglishFromArabic = (arabicName: string): string => {
  // First check our direct translations
  const entry = Object.entries(majorTranslations).find(([_, ar]) => ar === arabicName);
  if (entry) {
    return entry[0]; // Return the English name
  }
  return arabicName;
};

// Helper function to get Arabic name from English
const getArabicFromEnglish = (englishName: string): string => {
  return majorTranslations[englishName] || englishName;
};

// Helper function to get English name for a major
const getEnglishMajorName = (majorName: string): string => {
  // If we're dealing with an Arabic name, try to get its English equivalent
  const englishName = getEnglishFromArabic(majorName);
  
  // If we found a translation, use it
  if (englishName !== majorName) {
    return englishName;
  }
  
  // If not found in translations, try the mapping objects
  const narrowEntry = Object.entries(narrowMajorMapping).find(
    ([_, value]) => value.en === majorName || value.ar === majorName
  );
  if (narrowEntry) {
    return narrowEntry[1].en;
  }

  return majorName;
};

// Helper function to get color for narrow major using English name
const getMajorColor = (majorName: string) => {
  // Get the English name for consistent color mapping
  const englishName = getEnglishMajorName(majorName);
  return majorColorMap[englishName] || "#666666";
};

// Helper function to get color for timing nodes
const getTimingNodeColor = (nodeId: string) => {
  const timingColors = {
    // English translations
    [getTranslation("Before Graduation", "en")]: colorMapping["Before Graduation"],
    [getTranslation("Within First Year", "en")]: colorMapping["Within First Year"],
    [getTranslation("After First Year", "en")]: colorMapping["After First Year"],
    // Arabic translations
    [getTranslation("Before Graduation", "ar")]: colorMapping["Before Graduation"],
    [getTranslation("Within First Year", "ar")]: colorMapping["Within First Year"],
    [getTranslation("After First Year", "ar")]: colorMapping["After First Year"],
    // Direct mappings for both languages
    "Before Graduation": "#c6c630",
    "Within First Year": "#19ce91",
    "After First Year": "#25b0ba",
    "موظف أثناء الدراسة": "#c6c630",
    "توظف خلال سنة بعد التخرج ": "#19ce91",
    "توظف بعد سنة من التخرج": "#25b0ba"
  };
  return timingColors[nodeId] || "#666666";
};

const majorNameMapping = {
  "Business, administration and law": {
    en: "Business, administration and law",
    ar: "الأعمال والإدارة والقانون",
  },
  "Arts and Humanities": {
    en: "Arts and Humanities",
    ar: "الفنون والعلوم الإنسانية",
  },
  "Health and Welfare": {
    en: "Health and Welfare",
    ar: "الصحة والرفاه",
  },
  "Natural Sciences, Mathematics and Statistics": {
    en: "Natural Sciences, Mathematics and Statistics",
    ar: "العلوم الطبيعية والرياضيات والإحصاء",
  },
  "Communications and Information Technology": {
    en: "Communications and Information Technology",
    ar: "تقنية الاتصالات والمعلومات",
  },
  "Social Sciences, Journalism, Information and Media": {
    en: "Social Sciences, Journalism, Information and Media",
    ar: "العلوم الاجتماعية والصحافة والإعلام",
  },
  Services: {
    en: "Services",
    ar: "الخدمات",
  },
  "Agriculture, Forestry, Fisheries and Veterinary": {
    en: "Agriculture, Forestry, Fisheries and Veterinary",
    ar: "الزراعة والحراجة ومصائد الأسماك والبيطرة",
  },
  "Generic Programs and Qualifications": {
    en: "Generic Programs and Qualifications",
    ar: "البرامج العامة والمؤهلات",
  },
  Education: {
    en: "Education",
    ar: "التعليم",
  },
  "Engineering, manufacturing and construction": {
    en: "Engineering, manufacturing and construction",
    ar: "الهندسة والتصنيع والبناء",
  },
};

const narrowMajorMapping = {
  "Business and administration": {
    en: "Business and administration",
    ar: "الأعمال والإدارة",
  },
  law: {
    en: "law",
    ar: "القانون",
  },
  health: {
    en: "health",
    ar: "الصحة",
  },
  Welfare: {
    en: "Welfare",
    ar: "الرفاه",
  },
  Education: {
    en: "Education",
    ar: "التعليم",
  },
  "Personal services": {
    en: "Personal services",
    ar: "الخدمات الشخصية",
  },
  "Transportation services": {
    en: "Transportation services",
    ar: "خدمات النقل",
  },
  "security service": {
    en: "security service",
    ar: "خدمات الأمن",
  },
  "Basic programs and qualifications": {
    en: "Basic programs and qualifications",
    ar: "البرامج الأساسية والمؤهلات",
  },
  "Skills and personal development development": {
    en: "Skills and personal development development",
    ar: "تنمية المهارات والتنمية الشخصية",
  },
  "General hygiene and occupational health services": {
    en: "General hygiene and occupational health services",
    ar: "خدمات النظافة العامة والصحة المهنية",
  },
  "Social and behavioral sciences": {
    en: "Social and behavioral sciences",
    ar: "العلوم الاجتماعية والسلوكية",
  },
  "Journalism and media": {
    en: "Journalism and media",
    ar: "الصحافة والإعلام",
  },
  Languages: {
    en: "Languages",
    ar: "اللغات",
  },
  "Human studies except languages": {
    en: "Human studies except languages",
    ar: "الدراسات الإنسانية باستثناء اللغات",
  },
  Arts: {
    en: "Arts",
    ar: "الفنون",
  },
  "Physical sciences": {
    en: "Physical sciences",
    ar: "العلوم الفيزيائية",
  },
  "Biological sciences and related sciences": {
    en: "Biological sciences and related sciences",
    ar: "العلوم البيولوجية والعلوم المتصلة بها",
  },
  "Mathematics and Statistics": {
    en: "Mathematics and Statistics",
    ar: "الرياضيات والإحصاء",
  },
  environment: {
    en: "environment",
    ar: "البيئة",
  },
  "Engineering and engineering crafts": {
    en: "Engineering and engineering crafts",
    ar: "الهندسة والحرف الهندسية",
  },
  "Architecture and construction": {
    en: "Architecture and construction",
    ar: "الهندسة المعمارية والبناء",
  },
  "Manufacturing and processing": {
    en: "Manufacturing and processing",
    ar: "التصنيع والمعالجة",
  },
  Forestry: {
    en: "Forestry",
    ar: "الحراجة",
  },
  Veterinary: {
    en: "Veterinary",
    ar: "البيطرة",
  },
  Agriculture: {
    en: "Agriculture",
    ar: "الزراعة",
  },
  "Communications and Information Technology": {
    en: "Communications and Information Technology",
    ar: "تقنية الاتصالات والمعلومات",
  },
  "Multi -disciplinary programs and qualifications include telecommunications and information technology":
    {
      en: "Multi -disciplinary programs and qualifications include telecommunications and information technology",
      ar: "البرامج والمؤهلات متعددة التخصصات تتضمن تقنية الاتصالات والمعلومات",
    },
  "Unlimited programs in business, administration and law": {
    en: "Unlimited programs in business, administration and law",
    ar: "برامج غير محددة في الأعمال والإدارة والقانون",
  },
  "Multidisciplinary programs and qualifications include health and wellbeing":
    {
      en: "Multidisciplinary programs and qualifications include health and wellbeing",
      ar: "البرامج والمؤهلات متعددة التخصصات تتضمن الصحة والرفاه",
    },
  "Other programs in natural sciences, mathematics and statistics are not classified elsewhere":
    {
      en: "Other programs in natural sciences, mathematics and statistics are not classified elsewhere",
      ar: "برامج أخرى في العلوم الطبيعية والرياضيات والإحصاء غير مصنفة في مكان آخر",
    },
  "Multiple specialties programs and qualifications include natural sciences, mathematics and statistics":
    {
      en: "Multiple specialties programs and qualifications include natural sciences, mathematics and statistics",
      ar: "برامج ومؤهلات متعددة التخصصات تتضمن العلوم الطبيعية والرياضيات والإحصاء",
    },
  "Multi -disciplinary programs and qualifications include engineering, manufacturing and construction":
    {
      en: "Multi -disciplinary programs and qualifications include engineering, manufacturing and construction",
      ar: "برامج ومؤهلات متعددة التخصصات تتضمن الهندسة والتصنيع والبناء",
    },
};

export default function ThirdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [currentData, setCurrentData] = useState(
    language === "en" ? mockDataMajorEn : mockDataMajorAr
  );
  const [generalMajorData, setGeneralMajorData] = useState<any>(null);
  const [narrowMajorData, setNarrowMajorData] = useState<any>(null);

  // Get English parameters from URL
  const selectedNarrowMajor = searchParams.get("major"); // This will be in English
  const selectedGeneralMajor = searchParams.get("generalMajor"); // This will be in English

  useEffect(() => {
    // Update current data based on language
    setCurrentData(language === "en" ? mockDataMajorEn : mockDataMajorAr);

    // Find general major data - keep English in URL but display in current language
    const generalMajorName = selectedGeneralMajor
      ? decodeURIComponent(selectedGeneralMajor)
      : "";

    // Find the mapping key by comparing case-insensitively
    // const generalMajorKey = Object.keys(majorNameMapping).find(
    //   key => key.toLowerCase() === generalMajorName.toLowerCase()
    // ) || generalMajorName;

    // const mappedGeneralMajorName = majorNameMapping[generalMajorKey]?.[language] || generalMajorName;
    const mappedGeneralMajorName =
      majorNameMapping[generalMajorName]?.[language] || generalMajorName;
    console.log("Looking for general major:", mappedGeneralMajorName);

    const foundGeneralMajor = currentData.byGeneralMajor.generalMajors.find(
      // (major) => major.generalMajor.toLowerCase() === mappedGeneralMajorName.toLowerCase()
      (major) => major.generalMajor === mappedGeneralMajorName
    );

    setGeneralMajorData(foundGeneralMajor);

    // Find narrow major data if general major is found
    if (foundGeneralMajor) {
      const narrowMajorName = selectedNarrowMajor
        ? decodeURIComponent(selectedNarrowMajor)
        : "";

      // Find the mapping key by comparing case-insensitively
      // const narrowMajorKey = Object.keys(narrowMajorMapping).find(
      //   key => key.toLowerCase() === narrowMajorName.toLowerCase()
      // ) || narrowMajorName;

      // const mappedNarrowMajorName = narrowMajorMapping[narrowMajorKey]?.[language] || narrowMajorName;
      const mappedNarrowMajorName =
        narrowMajorMapping[narrowMajorName]?.[language] || narrowMajorName;

      console.log("Looking for narrow major:", mappedNarrowMajorName);

      const foundNarrowMajor =
        foundGeneralMajor.byNarrowMajor.narrowMajors.find(
          // (major) => major.narrowMajor.toLowerCase() === mappedNarrowMajorName.toLowerCase()
          (major) => major.narrowMajor === mappedNarrowMajorName
        );

      console.log("Found narrow major:", foundNarrowMajor);
      setNarrowMajorData(foundNarrowMajor);
    }
  }, [language, selectedGeneralMajor, selectedNarrowMajor, currentData]);

  // Display the title in the current language
  const displayNarrowMajor = selectedNarrowMajor
    ? narrowMajorMapping[decodeURIComponent(selectedNarrowMajor)]?.[language] ||
      decodeURIComponent(selectedNarrowMajor)
    : "";

  // Get the mapped name for the Sankey chart
  const getMappedNarrowMajorName = (narrowMajorName: string) => {
    if (!narrowMajorName) return "";
    const decodedName = decodeURIComponent(narrowMajorName);
    // Find the mapping key by comparing case-insensitively
    const mappingKey = Object.keys(narrowMajorMapping).find(
      (key) => key.toLowerCase() === decodedName.toLowerCase()
    );
    return mappingKey ? narrowMajorMapping[mappingKey][language] : decodedName;
  };

  console.log("Selected General Major (English):", selectedGeneralMajor);
  console.log("Selected Narrow Major (English):", selectedNarrowMajor);
  console.log("Current Language:", language);
  console.log("Found General Major Data:", generalMajorData);
  console.log("Found Narrow Major Data:", narrowMajorData);
  console.log("Display Narrow Major:", displayNarrowMajor);

  const overviewStats = narrowMajorData?.overall.totalMetrics;
  const topOccupations =
    narrowMajorData?.overall.topOccupationsInsights.highestPaying || [];
  const educationLevels = overviewStats?.educationLevelInsights || [];
  // const topMajors = narrowMajorData?.overall.topMajorsInsights || [];

  const getTimingNodeColor = (nodeId: string) => {
    const timingNodes = {
      [getTranslation("Before Graduation", "en")]: colorMapping["Before Graduation"],
      [getTranslation("Within First Year", "en")]: colorMapping["Within First Year"],
      [getTranslation("After First Year", "en")]: colorMapping["After First Year"],
      [getTranslation("Before Graduation", "ar")]: colorMapping["Before Graduation"],
      [getTranslation("Within First Year", "ar")]: colorMapping["Within First Year"],
      [getTranslation("After First Year", "ar")]: colorMapping["After First Year"],
    };
    return timingNodes[nodeId] || "#808080";
  };

  // Get icon based on major name
  const getMajorIcon = (majorName: string) => {
    const iconMapping = {
      Education: FaGraduationCap,
      "Communications and Information Technology": FaLaptopCode,
      "Business, administration and law": FaBalanceScale,
      "Arts and Humanities": FaPaintBrush,
      "Health and Welfare": FaHeartbeat,
      "Natural Sciences, Mathematics and Statistics": FaFlask,
      "Engineering, manufacturing and construction": FaCogs,
      "Agriculture, Forestry, Fisheries and Veterinary": FaSeedling,
      "Social Sciences, Journalism, Information and Media": FaBook,
      "Generic Programs and Qualifications": FaUserGraduate,
      Services: FaCog,
    };

    // Get English version of major name for mapping
    const englishMajor =
      Object.entries(majorNameMapping).find(
        ([_, value]) => value[language] === majorName
      )?.[0] || majorName;

    return iconMapping[englishMajor as keyof typeof iconMapping];
  };

  const sankeyData = useMemo(() => {
    if (!narrowMajorData?.overall?.topMajorsInsights?.topByEmploymentTiming) {
      return { nodes: [], links: [] };
    }

    // Process all majors first to ensure consistent color mapping
    const majorNodes = narrowMajorData.overall.topMajorsInsights.topByEmploymentTiming.map((major) => {
      // Get the English name for color mapping
      const englishName = getEnglishMajorName(major.name);
      
      // Get the display name based on current language
      const displayName = language === 'ar' ? getArabicFromEnglish(englishName) : englishName;
      
      // Get the color using the English name
      const color = majorColorMap[englishName] || "#666666";

      return {
        id: displayName,
        englishName,
        color,
      };
    });

    // Define timing node colors
    const timingColors = {
      "Before Graduation": "#c6c630",
      "Within First Year": "#19ce91",
      "After First Year": "#25b0ba",
    };

    // Create links array first to determine which timing nodes are actually used
    const links: SankeyCustomLinkData[] = [];
    const usedTimingNodes = new Set<string>();

    // Add links for each major and track which timing nodes are used
    majorNodes.forEach((node) => {
      const major = narrowMajorData.overall.topMajorsInsights.topByEmploymentTiming.find(
        m => {
          const englishName = getEnglishMajorName(m.name);
          const displayName = language === 'ar' ? getArabicFromEnglish(englishName) : englishName;
          return displayName === node.id;
        }
      );
      
      if (!major) return;

      // Before Graduation
      if (major.employmentTiming?.beforeGraduation?.percentage > 0) {
        const timingNode = getTranslation("Before Graduation", language);
        usedTimingNodes.add(timingNode);
        links.push({
          source: language === 'ar' ? timingNode : node.id,
          target: language === 'ar' ? node.id : timingNode,
          value: major.employmentTiming.beforeGraduation.percentage,
        });
      }

      // Within First Year
      if (major.employmentTiming?.withinFirstYear?.percentage > 0) {
        const timingNode = getTranslation("Within First Year", language);
        usedTimingNodes.add(timingNode);
        links.push({
          source: language === 'ar' ? timingNode : node.id,
          target: language === 'ar' ? node.id : timingNode,
          value: major.employmentTiming.withinFirstYear.percentage,
        });
      }

      // After First Year
      if (major.employmentTiming?.afterFirstYear?.percentage > 0) {
        const timingNode = getTranslation("After First Year", language);
        usedTimingNodes.add(timingNode);
        links.push({
          source: language === 'ar' ? timingNode : node.id,
          target: language === 'ar' ? node.id : timingNode,
          value: major.employmentTiming.afterFirstYear.percentage,
        });
      }
    });

    // Create timing nodes array based on which ones are actually used
    const timingNodes = [
      { id: getTranslation("Before Graduation", language), nodeColor: timingColors["Before Graduation"] },
      { id: getTranslation("Within First Year", language), nodeColor: timingColors["Within First Year"] },
      { id: getTranslation("After First Year", language), nodeColor: timingColors["After First Year"] },
    ].filter(node => usedTimingNodes.has(node.id));

    // Create nodes array based on language, only including used timing nodes
    const nodes = language === 'ar' ? [
      // Right side nodes (timing nodes) for Arabic - only used ones
      ...timingNodes,
      // Left side nodes (majors) for Arabic - using English name for color lookup
      ...majorNodes.map(node => ({
        id: node.id,
        nodeColor: majorColorMap[node.englishName] || "#666666",
      })),
    ] : [
      // Left side nodes (majors) for English
      ...majorNodes.map(node => ({
        id: node.id,
        nodeColor: majorColorMap[node.englishName] || "#666666",
      })),
      // Right side nodes (timing nodes) for English - only used ones
      ...timingNodes,
    ];

    return { nodes, links };
  }, [narrowMajorData, language]);

  return (
    <div
      className="min-h-screen bg-transparent backdrop-blur-sm px-2"
      style={{ marginTop: "-30px" }}
    >
      {/* Content */}
      <div
        className={`relative z-10 container mx-auto px-2 py-8 max-w-full w-[99%] ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {/* Major Title */}
        <div className="mb-5">
          {/* General Major Title */}
          <div className={cn("flex justify-center items-center gap-3 mb-3",language==="ar"?"flex-row-reverse text-right":"text-left")}>
            {generalMajorData?.generalMajor &&
              getMajorIcon(generalMajorData.generalMajor) && (
                <div className="text-3xl text-[#2CCAD3]">
                  {React.createElement(
                    getMajorIcon(generalMajorData.generalMajor)
                  )}
                </div>
              )}
            <h1 className="text-white text-2xl text-center">
              {displayNarrowMajor}
              {/* {generalMajorData?.generalMajor} */}
            </h1>
          </div>
          {/* Narrow Major Title */}
          {/* <h2 className="text-white/70  text-xl text-center">
            {narrowMajorData?.narrowMajor}
          </h2> */}
        </div>

        {/* Overview Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 w-full px-1 ${language === "ar" ? "dir-rtl" : ""}`} style={{ direction: language === "ar" ? "rtl" : "ltr" }}>

        {/* <div
          className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 w-full px-1 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        > */}
          {/* Graduates */}
          <div
            className={`bg-gradient-to-r ${
              language === "ar"
                ? "from-[#2CCAD3]/20 to-transparent rounded-2xl"
                : "from-transparent to-[#2CCAD3]/20 rounded-2xl"
            } p-3 pt-4 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center`}
          >
            <div
              className={`flex items-center ${
                language === "ar" ? "flex-row-reverse justify-end gap-4" : "justify-center gap-6"
              }`}
            >
              {language === "ar" ? (
                <div style={{ marginLeft: -20 }}>
                  <p className="text-sm  text-white">
                    {getTranslation("Total Graduates", language)}
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {overviewStats?.graduates.totalGraduates.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="bg-[#2CCAD3]/20 rounded-full flex items-center gap-1 px-1 py-0.5">
                      <BiMale style={{ color: "#2CCAD3" }} />
                      <span className="text-xs text-white">
                        {overviewStats?.graduates.male.percentage}%
                      </span>
                    </div>
                    <div className="bg-[#2CCAD3]/20 rounded-full flex items-center gap-1 px-1 py-0.5">
                      <BiFemale style={{ color: "#fe1672" }} />
                      <span className="text-xs text-white">
                        {overviewStats?.graduates.female.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-[#2CCAD3]/10 p-1"
                  style={{
                    backgroundColor: "transparent",
                    borderRadius: 0,
                  }}
                >
                  <Image
                    src="/icons/graduateicon.svg"
                    alt={getTranslation("Total Graduates", language)}
                    width={52}
                    height={42}
                    style={{ marginLeft: -10 , marginTop:15}}
                  />
                </div>
              )}
              {language === "ar" ? (
                <div
                  className="bg-[#2CCAD3]/10 p-1"
                  style={{
                    backgroundColor: "transparent",
                    borderRadius: 0,
                  }}
                >
                  <Image
                    src="/icons/graduateicon.svg"
                    alt={getTranslation("Total Graduates", language)}
                    width={42}
                    height={42}
                  />
                </div>
              ) : (
                <div style={{ marginLeft: -20 }}>
                  <p className="text-sm  text-white">
                    {getTranslation("Total Graduates", language)}
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {overviewStats?.graduates.totalGraduates.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="bg-[#2CCAD3]/20 rounded-full flex items-center gap-1 px-1 py-0.5">
                      <BiMale style={{ color: "#2CCAD3" }} />
                      <span className="text-xs text-white">
                        {overviewStats?.graduates.male.percentage}%
                      </span>
                    </div>
                    <div className="bg-[#2CCAD3]/20 rounded-full flex items-center gap-1 px-1 py-0.5">
                      <BiFemale style={{ color: "#fe1672" }} />
                      <span className="text-xs text-white">
                        {overviewStats?.graduates.female.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Average Salary */}
          <div
            className={`bg-gradient-to-r ${
              language === "ar"
                ? "from-[#2CCAD3]/20 to-transparent rounded-2xl"
                : "from-transparent to-[#2CCAD3]/20 rounded-2xl"
            } p-3 pt-7 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center`}
          >
            <div
              className={`flex items-center gap-6  ${
                language === "ar" ? "flex-row-reverse justify-end pr-3" : "justify-center"
              }`}
            >
              <div
               className={cn(
                "bg-[#2CCAD3]/10 p-4",
                {
                  "hidden" : language === "ar",
                }
              )}
              style={{
                backgroundColor: "transparent",
                borderRadius: 0,
                marginLeft: 8,
              }}
              >
                <PiMoneyFill
                  style={{
                    color: "#2CCAD3",
                    width: 42,
                    height: 42,
                    marginLeft: -15,
                  }}
                />
              </div>
             
              <div style={{ marginLeft: -20 }}>
                <p className="text-sm text-white">
                  {getTranslation("Average Salary", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {narrowMajorData?.overall.totalMetrics.averageSalary.toLocaleString()}
                  <span className="font-normal text-lg">
                    {" "}
                    {getTranslation("SAR", language)}
                  </span>
                </p>
              </div>
              <div
               className={cn(
                "bg-[#2CCAD3]/10",
                {
                  "hidden" : language === "en",
                }
              )}
              style={{
                backgroundColor: "transparent",
                borderRadius: 0,
                marginLeft: 8,
              }}
              >
                <PiMoneyFill
                  style={{
                    color: "#2CCAD3",
                    width: 42,
                    height: 42,
                    marginLeft: -15,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Employment Rate */}
          <div
            className={`bg-gradient-to-r ${
              language === "ar"
                ? "from-[#2CCAD3]/20 to-transparent rounded-2xl"
                : "from-transparent to-[#2CCAD3]/20 rounded-2xl"
            } p-3 pt-7 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center`}
          >
            <div
              className={`flex items-center gap-4 ${
                language === "ar" ? "flex-row-reverse justify-end" : ""
              }`}
            >
              <div
               className={cn(
                "bg-[#2CCAD3]/10 p-4",
                {
                  "hidden" : language === "ar",
                }
              )}
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                
                <FaBusinessTime
                  style={{
                    color: "#2CCAD3",
                    width: 42,
                    height: 42,
                    marginLeft: -10,
                  }}
                />
              </div>
              <div style={{ marginLeft: -20 }}>
                <p className="text-sm text-white text-nowrap">
                  {getTranslation("Time to Employment", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {
                    narrowMajorData?.overall.totalMetrics.timeToEmployment
                      .overall.days
                  }
                  <span className="font-normal text-lg">
                    {" "}
                    {getTranslation("months", language)}
                  </span>
                </p>
              </div>
              <div
                className={cn(
                  "bg-[#2CCAD3]/10 p-0",
                  {
                    "hidden" : language === "en",
                  }
                )}
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                
                <FaBusinessTime
                  style={{
                    color: "#2CCAD3",
                    width: 42,
                    height: 42,
                    marginLeft: -10,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Job Seekers */}
          <div
            className={`bg-gradient-to-r ${
              language === "ar"
                ? "from-[#2CCAD3]/20 to-transparent rounded-2xl"
                : "from-transparent to-[#2CCAD3]/20 rounded-2xl"
            } p-3 pt-7 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center`}
          >
            <div
              className={`flex items-center gap-6 ${
                language === "ar" ? "flex-row-reverse justify-end" : "justify-start"
              }`}
            >
              <div
                className={cn("bg-[#2CCAD3]/10 p-4", language === "ar" && "hidden")}
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                <FaUserGraduate
                  style={{
                    color: "#2CCAD3",
                    width: 40,
                    height: 40,
                    marginLeft: -10,
                  }}
                />
              </div>
              <div style={{ marginLeft: -20 }}>
                <p className="text-sm text-white">
                  {getTranslation("Job Seekers", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {narrowMajorData?.overall.totalMetrics.totalJobSeekers}
                </p>
              </div>
              <div
                className={cn("bg-[#2CCAD3]/10", language === "en" && "hidden")}
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                <FaUserGraduate
                  style={{
                    color: "#2CCAD3",
                    width: 40,
                    height: 40,
                    marginLeft: -10,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Employment Rate */}
          <div
            className={`bg-gradient-to-r ${
              language === "ar"
                ? "from-[#2CCAD3]/20 to-transparent rounded-r-2xl"
                : "from-transparent to-[#2CCAD3]/20 rounded-l-2xl"
            } p-3 pt-7 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center`}
          >
            <div
              className={`flex items-center ${
                language === "ar" ? "flex-row-reverse justify-end gap-2" : "justify-start gap-6"
              }`}
            >
              <div
                className={cn( "bg-[#2CCAD3]/10 p-2", language === 'ar' && 'hidden' )}
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                <Image
                  src="/icons/employmentrateicon.svg"
                  alt="Employment"
                  width={62}
                  height={62}
                  style={{ marginLeft: -10 }}
                />
              </div>
              <div style={{ marginLeft: -30 }}>
                <p className="text-sm text-white">
                  {getTranslation("Employment Rate", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.employmentRate}%
                </p>
              </div>
              <div
                className={cn( "bg-[#2CCAD3]/10", language === 'en' && 'hidden' )}
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                <Image
                  src="/icons/employmentrateicon.svg"
                  alt="Employment"
                  width={62}
                  height={62}
                  style={{ marginLeft: -10 }}
                  // sizes="102px"
                />
              </div>
            </div>
          </div>

          {/* Time to Employment Breakdown */}
          <div className="rounded-xl py-1">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="space-y-1.5">
                  {/* Before Graduate */}
                  <div
                    className="p-0.5 flex justify-between items-center"
                    style={{
                      background:
                        "linear-gradient(90deg, #176481 0%, #1E1F5E 100%)",
                    }}
                  >
                    <span className="text-sm text-white ml-1">
                      {getTranslation("Before Graduation", language)}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {
                        narrowMajorData?.overall.totalMetrics.timeToEmployment
                          .beforeGraduation.percentage
                      }
                      %
                    </span>
                  </div>

                  {/* Within First Year */}
                  <div
                    className="p-0.5 flex justify-between items-center"
                    style={{
                      background:
                        "linear-gradient(90deg, #176481 0%, #1E1F5E 100%)",
                    }}
                  >
                    <span className="text-sm text-white ml-1">
                      {getTranslation("Within First Year", language)}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {
                        narrowMajorData?.overall.totalMetrics.timeToEmployment
                          .withinFirstYear.percentage
                      }
                      %
                    </span>
                  </div>

                  {/* After First Year */}
                  <div
                    className="p-0.5 flex justify-between items-center"
                    style={{
                      background:
                        "linear-gradient(90deg, #176481 0%, #1E1F5E 100%)",
                    }}
                  >
                    <span className="text-sm text-white ml-1">
                      {getTranslation("After First Year", language)}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {
                        narrowMajorData?.overall.totalMetrics.timeToEmployment
                          .afterFirstYear.percentage
                      }
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Using Ant Design Grid */}
        <Row
          gutter={[12, 12]}
          // className={`w-full ${language === "ar" ? "" : ""}`}
          style={{ padding: "0em 0em 0em 0em", marginTop: "2.5em" }}
        >
          {/* Top Popular Occupations */}
          <Col xs={24} lg={13}>
            <div
              className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              <h2
                className={`text-xl mb-6 flex items-center ${
                  language === "ar" ? "flex-row-reverse" : ""
                } gap-2`}
              >
                <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                  <Image
                    src="/icons/occupation.svg"
                    alt="Occupation"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-white">
                  {getTranslation("Top Popular Occupations", language)}
                </span>
              </h2>
              <div
                className="h-[254px] flex flex-col justify-end relative"
                style={{ top: "10px", marginBottom: "15px" }}
              >
                <div
                  className={`flex justify-between items-end h-[200px] ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  {narrowMajorData?.overall?.topOccupationsInsights?.mostPopular?.map(
                    (occupation, index) => {
                      // Fixed percentage scale for each bar
                      const percentages = [
                        100, 90, 80, 70, 60, 50, 40, 30, 20, 10,
                      ];
                      const height = percentages[index] || 12;

                      return (
                        <div
                          key={index}
                          className={`flex flex-col items-center group w-[40px] ${
                            language === "ar" ? "flex-row-reverse" : ""
                          }`}
                        >
                          {/* Value on top of bar */}
                          <div
                            className="text-sm text-white mb-1"
                            style={{ marginBottom: "15px" }}
                          >
                            {occupation.totalGraduates.toLocaleString()}
                          </div>
                          <div
                            className="w-[30px] relative"
                            style={{
                              height: `${height * 2}px`,
                              marginBottom: "2px",
                            }}
                          >
                            <div
                              className="w-full absolute bottom-0 border border-white group-hover:opacity-90 transition-opacity rounded-t-full"
                              style={{
                                height: "100%",
                                marginBottom: "10px",
                                background:
                                  "linear-gradient(to top, #2cd7c4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)",
                              }}
                            />
                          </div>
                          {/* horizontal line */}
                          <div
                            className="absolute right-0 h-[2px] w-full bg-gray-100 top-52 transform -translate-y-1/6"
                            style={{ marginTop: "-10px" }}
                          />

                          {/* {text} */}
                          <div className="mt-4 text-center px-1 min-h-[27px]">
                            <span
                              className={`text-[10px] text-white block break-words capitalize transform origin-top-left w-24 ${
                                language === "ar"
                                  ? "rotate-45 translate-y-20 translate-x-2"
                                  : "-rotate-45 translate-y-20 -translate-x-2"
                              }`}
                              style={
                                language === "ar"
                                  ? {
                                      wordBreak: "break-word",
                                      lineHeight: "1.2",
                                      marginTop: "-100px",
                                      marginLeft: "40px",
                                    }
                                  : {
                                      wordBreak: "break-word",
                                      lineHeight: "1.2",
                                      marginTop: "-40px",
                                      marginLeft: "20px",
                                    }
                              }
                            >
                              {occupation.occupation.split(" ").join("\n")}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </Col>

          {/* Degrees - Wider column */}
          <Col xs={26} lg={11}>
            <div
              className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              <h2
                className={`text-xl mb-6 flex items-center gap-2 ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                  <Image
                    src="/icons/degree.svg"
                    alt="Degree"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-white">
                  {getTranslation("Degree", language)}
                </span>
              </h2>
              <div
                className={`space-y-4 relative ${
                  language === "ar" ? "pl-28" : "pr-28"
                }`}
                style={{ top: "10px" }}
              >
                {/* Vertical line */}
                <div
                  className={`absolute ${
                    language === "ar" ? "right-[160px]" : "left-[160px]"
                  } top-0 bottom-0 w-[1.5px] bg-gray-100`}
                />

                {narrowMajorData?.overall.totalMetrics.educationLevelInsights
                  ?.slice(0, 5)
                  .map((level, index) => {
                    const percentages = [98, 75, 45, 30, 15];
                    const percentage = percentages[index] || 12;
                    const isSmallBar = percentage < 30;

                    return (
                      <div
                        key={index}
                        className={`flex items-center group ${
                          language === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-[160px] relative">
                          <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                          <span
                            className="relative z-10 text-sm text-white px-3 py-1 block truncate"
                            style={{ wordBreak: "break-word" }}
                          >
                            {level.educationLevel}
                          </span>
                        </div>
                        <div className="relative flex-1 h-8 flex items-center">
                          {/* Bar with total graduates */}
                          <div
                            className={`absolute border-[1px] border-white ${
                              language === "ar"
                                ? "right-0 rounded-l-full"
                                : "left-0 rounded-r-full"
                            } top-1/2 -translate-y-1/2 h-7 group-hover:opacity-90 transition-opacity`}
                            style={{
                              width: `${percentage}%`,
                              maxWidth: "100%",
                              background:
                                language === "ar"
                                  ? "linear-gradient(to left, #2cd7c4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)"
                                  : "linear-gradient(to right, #2cd7c4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)",
                            }}
                          >
                            {/* Total Graduates */}
                            <div
                              className={`absolute ${
                                language === "ar" ? "left-2" : "right-2"
                              } top-1/2 -translate-y-1/2`}
                            >
                              <span
                                className="text-sm font-bold text-white whitespace-nowrap"
                                style={{ wordBreak: "break-word" }}
                              >
                                {level.totalGraduates.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Employment Rate */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{
                              [language === "ar"
                                ? "right"
                                : "left"]: `calc(${percentage}% + 16px)`,
                            }}
                          >
                            <div
                              className="bg-[#2CCAD3]/20 rounded-full px-3 py-1"
                              style={{ wordBreak: "break-word" }}
                            >
                              <span
                                className="text-white text-sm whitespace-nowrap"
                                style={{ wordBreak: "break-word" }}
                              >
                                {level.employmentRate}%{" "}
                                {getTranslation("employed", language)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {!narrowMajorData?.overall.totalMetrics.educationLevelInsights
                  ?.length && (
                  <div
                    className="flex items-center justify-center h-[200px] text-white"
                    style={{ wordBreak: "break-word" }}
                  >
                    {getTranslation("No data available", language)}
                  </div>
                )}
              </div>
            </div>
          </Col>
          {/* Top 5 Occupation by Salary */}
          {/* <Col xs={24} lg={11}>
            <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
              <h2 className="text-xl font-[Roboto_Regular'] mb-6 flex items-center gap-2">
                <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                  <Image
                    src="/icons/occupation.svg"
                    alt="Occupation"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-white">
                  {getTranslation("Top 5 Occupation by Salary", language)}
                </span>
              </h2>
              <div className="flex flex-col items-center gap-4">
                <div className="h-[300px] w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="30%"
                      outerRadius="110%"
                      data={topOccupations
                        .slice(0, 5)
                        .sort((a, b) => a.averageSalary - b.averageSalary) // Sort by average salary in descending order
                        .map((occupation, index) => ({
                          name: occupation.occupation,
                          value: occupation.averageSalary,
                          fill: [
                            "#2ab1bb",
                            "#ac4863",
                            "#2c828c",
                            "#778899",
                            "#996515",
                          ][topOccupations.indexOf(occupation)],
                        }))}
                      startAngle={90}
                      endAngle={-270}
                      cx="50%"
                      cy="50%"
                    >
                      <RadialBar
                        background={{ fill: "#ffffff10" }}
                        label={{
                          position: "insideStart",
                          fill: "#fff",
                          formatter: (value: number) =>
                            `${value.toLocaleString()} SAR`,
                          fontSize: 12,
                          fontFamily: "Roboto",
                        }}
                        dataKey="value"
                        cornerRadius={30}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {[...topOccupations]
                  .slice(0, 5)
                  .sort((a, b) => b.averageSalary - a.averageSalary)
                  .map((occupation, index) => {
                    const colors = [
                      "#996515",
                      "#778899",
                      "#2c828c",
                      "#ac4863",
                      "#2ab1bb",
                    ];
                    const sortedIndex = topOccupations
                      .slice(0, 5)
                      .sort((a, b) => a.averageSalary - b.averageSalary)
                      .findIndex((o) => o.occupation === occupation.occupation);

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          style={{
                            backgroundColor: colors[sortedIndex],
                          }}
                          className="w-4 h-4 rounded-sm"
                        ></div>
                        <span className="text-white text-sm font-['Roboto']">
                          {occupation.occupation}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Col> */}
        </Row>

        <Row
          gutter={[12, 12]}
          className="w-full"
          style={{ padding: "0em 0em 0em 0em", marginTop: "1.5em" }}
        >
          {/* Top Majors by Gender */}
          <Col xs={24} lg={6}>
            <div
              className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              <h2
                className={`text-xl mb-6 flex items-center ${
                  language === "ar" ? "flex-row-reverse" : ""
                } gap-2`}
              >
                {/* <h2 className="text-xl mb-6 flex items-center gap-2"> */}
                <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg flex justify-center items-center">
                  <Image
                    src="/icons/degree.svg"
                    alt="Degree"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-white">
                  {getTranslation("Top Specialization by Gender", language)}
                </span>
              </h2>
              <div className="space-y-4">
                {narrowMajorData?.overall.topMajorsInsights.topByGender
                  ?.sort((a, b) => b.graduates - a.graduates) // Sort by number of graduates in descending order
                  ?.slice(0, 5)
                  .map((major, index) => (
                    <div key={index} className="relative">
                      <div
                        className={`mb-1 flex justify-between rounded-2xl items-center ${
                          language === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-sm text-white">{major.name}</span>
                        <span
                          className={`text-xs text-white ${
                            language === "ar" ? "ml-2" : "mr-2"
                          }`}
                        >
                          {getTranslation("graduates", language)}{" "}
                          {major.graduates}
                        </span>
                      </div>
                      <div className="relative h-8 bg-[#1E1F5E] rounded-full overflow-hidden">
                        {/* Male percentage */}
                        <div
                          className={`absolute h-full ${
                            language === "ar"
                              ? "right-0 bg-gradient-to-l"
                              : "left-0 bg-gradient-to-r"
                          } from-[#2cd7c4]/30 to-[#2cd7c4]/100 group-hover:opacity-90 transition-opacity`}
                          style={{
                            width: `${major.genderDistribution.male.percentage}%`,
                          }}
                        >
                          <div
                            className={`absolute ${
                              language === "ar" ? "right-2" : "left-2"
                            } top-1/2 -translate-y-1/2 flex items-center gap-1 ${
                              language === "ar" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <BiMale style={{ color: "#2CCAD3" }} />
                            <span className="text-xs text-white">
                              {major.genderDistribution.male.percentage}%
                            </span>
                          </div>
                        </div>
                        {/* Female percentage */}
                        <div
                          className={`absolute h-full ${
                            language === "ar"
                              ? "left-0 bg-gradient-to-r"
                              : "right-0 bg-gradient-to-l"
                          }  from-[#fe1684]/30 to-[#fe1684]/100 group-hover:opacity-90 transition-opacity`}
                          style={{
                            width: `${major.genderDistribution.female.percentage}%`,
                          }}
                        >
                          <div
                            className={`absolute ${
                              language === "ar" ? "left-2" : "right-2"
                            } top-1/2 -translate-y-1/2 flex items-center gap-1 ${
                              language === "ar" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span className="text-xs text-white">
                              {major.genderDistribution.female.percentage}%
                            </span>
                            <BiFemale style={{ color: "#fe1672" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {!narrowMajorData?.overall.topMajorsInsights.topByGender
                  ?.length && (
                  <div
                    className="flex items-center justify-center h-[200px] text-white"
                    style={{ wordBreak: "break-word" }}
                  >
                    {getTranslation("No data available", language)}
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Sankey Chart */}
          <Col xs={10} lg={12}>
            <div className="">
              <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full">
                {/* <h2 className="text-xl mb-6 flex items-center gap-2"> */}
                <h2
                  className={`text-xl mb-6 flex items-center ${
                    language === "ar" ? "flex-row-reverse" : ""
                  } gap-2`}
                >
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg flex justify-center items-center">
                    <Image
                      src="/icons/employment.svg"
                      alt="Employment Flow"
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="text-white">
                    {getTranslation(
                      "Specialization By Time of Employment",
                      language
                    )}
                  </span>
                </h2>

                <div className="flex justify-center">
                  <div className="h-[400px] w-full max-w-[700px]">
                    {narrowMajorData?.overall.topMajorsInsights
                      .topByEmploymentTiming && (
                      <ResponsiveSankey
                        data={sankeyData}
                        margin={{ top: 20, right: 140, bottom: 20, left: 170 }}
                        align="justify"
                        sort={(a, b) => {
                          const order = {
                            [getTranslation("Before Graduation", language)]: 0,
                            [getTranslation("Within First Year", language)]: 1,
                            [getTranslation("After First Year", language)]: 2,
                          };
                          return (order[a.id] ?? -1) - (order[b.id] ?? -1);
                        }}
                        colors={(node) => node.nodeColor || "#6366f1"}
                        nodeOpacity={1}
                        nodeThickness={20}
                        nodeInnerPadding={3}
                        nodeSpacing={24}
                        nodeBorderWidth={0}
                        nodeBorderRadius={3}
                        linkOpacity={0.3}
                        linkHoverOpacity={0.7}
                        linkContract={3}
                        enableLinkGradient={true}
                        labelPosition="outside"
                        labelOrientation="horizontal"
                        labelPadding={4}
                        labelTextColor={{
                          from: "color",
                          modifiers: [["darker", 1]],
                        }}
                        animate={true}
                        label={(node) => {
                          const text = node.id;
                          const maxLineWidth = 20;
                          const words = text.split(" ");
                          let lines = [];
                          let currentLine = words[0];

                          for (let i = 1; i < words.length; i++) {
                            const word = words[i];
                            if (
                              (currentLine + " " + word).length <= maxLineWidth
                            ) {
                              currentLine += " " + word;
                            } else {
                              lines.push(currentLine);
                              currentLine = word;
                            }
                          }
                          lines.push(currentLine);

                          return lines.map((line, index) => (
                            <tspan key={index} dy={index > 0 ? 12 : -10} x="0">
                              {line}
                            </tspan>
                          ));
                        }
                      }
                        theme={{
                          labels: {
                            text: {
                              fontSize: 15,
                              fill: "#fff",
                              fontWeight: "bold",
                            },
                          },
                          tooltip: {
                            container: {
                              background: "#1E1F5E",
                              color: "#fff",
                              fontSize: 15,
                              borderRadius: 8,
                              padding: "8px 12px",
                            },
                          },
                        }}
                      />
                    )}
                    {!narrowMajorData?.overall.topMajorsInsights
                      .topByEmploymentTiming && (
                      <div
                        className="flex items-center justify-center h-[20px] text-white"
                        style={{ wordBreak: "break-word" }}
                      >
                        {getTranslation("No data available", language)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Employment Rate by Narrow Major */}
          <Col xs={24} lg={6}>
            <div
              className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              <h2
                className={`text-xl mb-6 flex items-center ${
                  language === "ar" ? "flex-row-reverse" : ""
                } gap-2`}
              >
                <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                  <Image
                    src="/icons/employmentrateicon.svg"
                    alt="Employment Rate"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-white">
                  {getTranslation("Employment Rate by Specialization", language)}
                </span>
              </h2>
              <div className="space-y-4 relative" style={{ top: "30px" }}>
                {/* Vertical line */}
                <div
                  className={`absolute ${
                    language === "ar" ? "right-[180px]" : "left-[180px]"
                  } top-0 bottom-0 w-[1.5px] bg-gray-100`}
                />

                {narrowMajorData?.overall.topMajorsInsights.topByEmploymentRate
                  ?.sort((a, b) => b.employmentRate - a.employmentRate) // Sort by employment rate in descending order
                  ?.slice(0, 5)
                  ?.map((major, index) => {
                    const width = major.employmentRate;
                    return (
                      <div
                        key={index}
                        className={`flex items-center group ${
                          language === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-[180px] relative">
                          <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                          <span
                          className={`relative z-10 text-sm text-white px-3 py-1 block break-words ${
                            language === "ar" ? "text-right" : "text-left"
                          }`}
                        >
                            {major.name}
                          </span>
                        </div>
                        <div className="relative flex-1 h-8 flex items-center">
                          {/* Bar with employment rate */}
                          <div
                            className={`absolute border-[1px] border-white ${
                              language === "ar"
                                ? "right-0 rounded-l-full"
                                : "left-0 rounded-r-full"
                            } top-1/2 -translate-y-1/2 h-7 group-hover:opacity-90 transition-opacity`}
                            style={{
                              width: `${width+20}%`,
                              maxWidth: "110%",
                              background:
                                language === "ar"
                                  ? "linear-gradient(to left, #2cd7c4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)"
                                  : "linear-gradient(to right, #2cd7c4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)",
                            }}
                          >
                            {/* Employment Rate */}
                            <div
                              className={`absolute ${
                                language === "ar" ? "right-0" : "left"
                              } top-1/2 -translate-y-1/2`}
                            >
                              <span
                                className="text-sm font-bold text-white whitespace-nowrap"
                                style={{ wordBreak: "break-word" }}
                              >
                                {width}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {!narrowMajorData?.overall.topMajorsInsights.topByEmploymentRate
                  ?.length && (
                  <div
                    className="flex items-center justify-center h-[200px] text-white"
                    style={{ wordBreak: "break-word" }}
                  >
                    {getTranslation("No data available", language)}
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}