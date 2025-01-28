"use client";
import React from "react";
import mockDataMajorEn from "./mock_data_major.json";
import mockDataMajorAr from "./major_insights_arabic.json";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BiFemale } from "react-icons/bi";
import { BiMale } from "react-icons/bi";
import { PiMoneyFill } from "react-icons/pi";
import { FaBusinessTime } from "react-icons/fa6";
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
// import { GiGraduateCap } from "react-icons/gi";
import { Row, Col } from "antd";
import { ResponsiveSankey, SankeyNodeDatum } from "@nivo/sankey";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";

interface SankeyCustomNodeData {
  id: string;
  nodeColor: string;
  source?: { id: string };
}

// source: color: "#7c3aed";
// depth: 0;
// formattedValue: "99.99999999999999";
// height: 211.984375;
// id: "education";
// index: 0;
// label: "education";
// layer: 0;
// nodeColor: "#7c3aed";

interface SankeyCustomLinkData {
  source: string;
  target: string;
  value: number;
}

const translations = {
  charts: {
    timeToEmployment: {
      en: "Time to Employment",
      ar: "متوسط مدة الانتظار للتوظيف",
    },
    topOccupations: {
      en: "Top Popular Occupations",
      ar: "المهن الأكثر إقبالاً",
    },
    topNarrowMajorsByGender: {
      en: "Top Narrow Majors by Gender",
      ar: "توزيع أعلى التخصصات الدقيقة حسب الجنس",
    },
    topOccupationsBySalary: {
      en: "Top 5 Occupation by Salary",
      ar: "أعلى 5 مهن حسب الراتب",
    },
    employmentRate: {
      en: "Employment Rate",
      ar: "نسبة التوظيف",
    },
    employmentRateByMajor: {
      en: "Employment Rate by Narrow Major",
      ar: "نسبة التوظيف حسب التخصصات الدقيقة",
    },
  },
  employmentTiming: {
    beforeGraduation: {
      en: "Before graduation",
      ar: "موظف أثناء الدراسة ",
    },
    withinFirstYear: {
      en: "Within a year",
      ar: "توظف خلال سنة بعد التخرج ",
    },
    afterFirstYear: {
      en: "More than a year",
      ar: "توظف بعد سنة من التخرج",
    },
  },
  employed: {
    en: "employed",
    ar: "مستخدم",
  },
  graduates: {
    en: "graduates",
    ar: "خريجين",
  },
  SAR: {
    en: "SAR",
    ar: "ريال سعودي",
  },
  days: {
    en: "days",
    ar: "أيام",
  },
};

const employmentTimingTranslations = {
  beforeGraduation: translations.employmentTiming.beforeGraduation,
  withinFirstYear: translations.employmentTiming.withinFirstYear,
  afterFirstYear: translations.employmentTiming.afterFirstYear,
};

const chartTitleTranslations = {
  en: translations.charts.timeToEmployment.en,
  ar: translations.charts.timeToEmployment.ar,
};

export default function SecondPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  // Mapping between English and Arabic major names
  const majorNameMapping = {
    en: {
      "Business, administration and law": "Business, administration and law",
      "Arts and Humanities": "Arts and Humanities",
      "Health and Welfare": "Health and Welfare",
      "Natural Sciences, Mathematics and Statistics":
        "Natural Sciences, Mathematics and Statistics",
      "Communications and Information Technology":
        "Communications and Information Technology",
      "Social Sciences, Journalism, Information":
        "Social Sciences, Journalism, Information and Media",
      Services: "Services",
      "Agriculture, Forestry, Fisheries and Veterinary":
        "Agriculture, Forestry, Fisheries and Veterinary",
      "Generic Programs and Qualifications":
        "Generic Programs and Qualifications",
      Education: "Education",
      "Engineering, manufacturing and construction":
        "Engineering, manufacturing and construction",
    },
    ar: {
      "Business, administration and law": "الأعمال والإدارة والقانون",
      "Arts and Humanities": "الفنون والعلوم الإنسانية",
      "Health and Welfare": "الصحة والرفاه",
      "Natural Sciences, Mathematics and Statistics":
        "العلوم الطبيعية والرياضيات والإحصاء",
      "Communications and Information Technology": "تقنية الاتصالات والمعلومات",
      "Social Sciences, Journalism, Information":
        "العلوم الاجتماعية والصحافة والإعلام",
      Services: "الخدمات",
      "Agriculture, Forestry, Fisheries and Veterinary":
        "الزراعة والحراجة ومصائد الأسماك والبيطرة",
      "Generic Programs and Qualifications": "البرامج العامة والمؤهلات",
      Education: "التعليم",
      "Engineering, manufacturing and construction": "الهندسة والتصنيع والبناء",
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

  // Reverse mapping to get English name from Arabic
  const getEnglishName = (name: string) => {
    if (language === "en") return name;

    // Find the English key that maps to this Arabic name
    const englishKey = Object.keys(majorNameMapping.ar).find(
      (key) => majorNameMapping.ar[key] === name
    );

    return englishKey || name;
  };

  // Function to handle navigation to narrow major page
  const handleNarrowMajorClick = (
    narrowMajor: string,
    generalMajor: string
  ) => {
    // Get the English names for both narrow and general majors
    const englishNarrowMajor =
      Object.entries(majorNameMapping).find(
        ([_, value]) => value[language] === narrowMajor
      )?.[0] || narrowMajor;

    const englishGeneralMajor =
      Object.entries(majorNameMapping).find(
        ([_, value]) => value[language] === generalMajor
      )?.[0] || generalMajor;

    router.push(
      `/narrow_major?major=${encodeURIComponent(
        englishNarrowMajor
      )}&generalMajor=${encodeURIComponent(englishGeneralMajor)}`
    );
  };

  const [selectedMajor, setSelectedMajor] = useState(
    majorNameMapping[language]["Business, administration and law"]
  );

  // Color mapping for majors and employment timing
  const colorMapping = {
    // Narrow majors with unique colors
    "Social and behavioral sciences": "#FF1493", // Deep pink
    "Journalism and media": "#9370DB", // Medium purple
    "Business and administration": "#20B2AA", // Light sea green
    Law: "#FFD700", // Gold
    Languages: "#FF4500", // Orange red
    "Human studies except languages": "#4169E1", // Royal blue
    Arts: "#32CD32", // Lime green
    "Physical sciences": "#FF8C00", // Dark orange
    "Biological sciences and related sciences": "#BA55D3", // Medium orchid
    "Mathematics and Statistics": "#00CED1", // Dark turquoise
    Environment: "#FF69B4", // Hot pink
    environment: "#FF69B4", // Hot pink
    "Engineering and engineering crafts": "#7B68EE", // Medium slate blue
    "Architecture and construction": "#3CB371", // Medium sea green
    "Manufacturing and processing": "#CD853F", // Peru
    Health: "#4682B4", // Steel blue
    Welfare: "#FFA07A", // Light salmon
    Agriculture: "#8B4513", // Saddle brown
    Veterinary: "#DAA520", // Goldenrod
    Forestry: "#228B22", // Forest green
    Fisheries: "#00868B", // Turquoise
    "Generic programs and qualifications": "#9932CC", // Dark orchid
    "Computer use": "#4B0082", // Indigo
    "Database and network design": "#8A2BE2", // Blue violet
    "Software development": "#9400D3", // Dark violet
    "Agriculture, forestry, fisheries and veterinary": "#556B2F", // Dark olive green
    "Information and Communication Technologies": "#483D8B", // Dark slate blue
    "Computer sciences": "#6A5ACD", // Slate blue
    "Social sciences": "#FF00FF", // Magenta
    "Natural sciences": "#1E90FF", // Dodger blue
    Humanities: "#FF7F50", // Coral
    "Education science": "#40E0D0", // Turquoise
    "Teacher training": "#EE82EE", // Violet
    "Inter-disciplinary programs": "#DDA0DD", // Plum
    "Basic programs": "#F0E68C", // Khaki
    "Literacy and numeracy": "#87CEEB", // Sky blue
    "Personal skills": "#98FB98", // Pale green
    "Life skills": "#DEB887", // Burlywood
    "Combined programs": "#5F9EA0", // Cadet blue
    "Skills and personal development development": "#E6B333", // Golden yellow
    "Basic programs and qualifications": "#33B2FF", // Bright blue
    "Personal services": "#FF66B2", // Pink
    "General hygiene and occupational health services": "#B233FF", // Purple
    "Transportation services": "#33FFB2", // Mint
    "security service": "#FFB233", // Orange
    "Communications and Information Technology": "#3366FF", // Royal blue
    "Telecommunications and information technology": "#3366FF", // Royal blue
    law: "#FFD700", // Gold
    health: "#FF69B4", // Indigo
    "Generic programs and qualifications include health and wellbeing":
      "#9932CC", // Dark orchid

    // Employment timing nodes
    "Before Graduation": "#FFB74D", // Light orange
    "Within First Year": "#64B5F6", // Light blue
    "After First Year": "#81C784", // Light green
    "موظف أثناء الدراسة ": "#FFB74D", // Light orange (Arabic)
    "توظف خلال سنة بعد التخرج ": "#64B5F6", // Light blue (Arabic)
    "توظف بعد سنة من التخرج": "#81C784", // Light green (Arabic)
  };

  // Helper function to get color for narrow major
  const getNarrowMajorColor = (narrowMajor: string) => {
    // Find the English key for this narrow major
    const englishKey = Object.entries(narrowMajorMapping).find(
      ([key, value]) => value.en === narrowMajor || value.ar === narrowMajor
    )?.[0];

    return colorMapping[englishKey || narrowMajor] || "#6366f1";
  };

  // Helper function to get color for timing nodes
  const getTimingNodeColor = (nodeId: string) => {
    // Create a mapping that includes both English and Arabic translations
    const timingColors = {
      [getTranslation("Before Graduation", "en")]: "#FFB74D",
      [getTranslation("Within First Year", "en")]: "#64B5F6",
      [getTranslation("After First Year", "en")]: "#81C784",
      [getTranslation("Before Graduation", "ar")]: "#FFB74D",
      [getTranslation("Within First Year", "ar")]: "#64B5F6",
      [getTranslation("After First Year", "ar")]: "#81C784",
    };
    return timingColors[nodeId] || "#6366f1";
  };

  // Get the appropriate data file based on language
  const currentData = language === "en" ? mockDataMajorEn : mockDataMajorAr;

  // Update selected major when language changes
  useEffect(() => {
    // Find the English name for the current major
    const currentEnglishName = Object.entries(
      majorNameMapping[language === "en" ? "ar" : "en"]
    ).find(([_, value]) => value === selectedMajor)?.[0];

    if (currentEnglishName) {
      const newMajorName = majorNameMapping[language][currentEnglishName];
      console.log("Language changed:", language);
      console.log("Current major:", selectedMajor);
      console.log("New major name:", newMajorName);
      setSelectedMajor(newMajorName);
    }
  }, [language]);

  useEffect(() => {
    const majorParam = searchParams.get("major");
    if (majorParam) {
      const decodedMajor = decodeURIComponent(majorParam);
      // If the major param is in English, translate it to the current language
      const translatedMajor =
        majorNameMapping[language][decodedMajor] || decodedMajor;
      setSelectedMajor(translatedMajor);
    }
  }, [searchParams, language]);

  // Find the selected major's data
  const majorData = currentData.byGeneralMajor.generalMajors.find((major) => {
    console.log("Comparing:", major.generalMajor, "with:", selectedMajor);
    return major.generalMajor === selectedMajor;
  });

  console.log("Selected Major:", selectedMajor);
  console.log("Current Language:", language);
  console.log("Found Major Data:", majorData);

  const overviewStats = majorData?.overall.totalMetrics;
  const topOccupations =
    majorData?.overall.topOccupationsInsights.highestPaying || [];
  const narrowMajors =
    majorData?.overall.topNarrowMajorsInsights.topByEmploymentTiming || [];

  // Function to get English value from translation mapping
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
    // Handle structure where each key has { en, ar } values
    else {
      // First check if this is already an English value
      const isEnglishValue = Object.values(mappings).some(
        (mapping) => mapping.en === currentValue
      );
      if (isEnglishValue) return currentValue;

      // If not, find the English value from Arabic
      const entry = Object.entries(mappings).find(
        ([_, value]) => value.ar === currentValue
      );
      return entry ? entry[1].en : currentValue;
    }
  };

  const handleMajorSelect = (selectedMajor: string) => {
    // Convert to English if needed
    const englishMajor = getEnglishValue(selectedMajor, majorNameMapping);

    const params = new URLSearchParams();
    params.set("major", encodeURIComponent(englishMajor));
    router.push(`/majors?${params.toString()}`);
  };

  const handleNarrowMajorSelect = (narrowMajor: string) => {
    if (!selectedMajor) return;

    // Convert both to English if needed
    const englishGeneralMajor = getEnglishValue(
      selectedMajor,
      majorNameMapping
    );
    const englishNarrowMajor = getEnglishValue(narrowMajor, narrowMajorMapping);

    router.push(
      `/narrow_major?major=${encodeURIComponent(
        englishNarrowMajor
      )}&generalMajor=${encodeURIComponent(englishGeneralMajor)}`
    );
  };

  // Display functions to show correct language while maintaining English URLs
  const displayMajor = selectedMajor
    ? majorNameMapping[language][decodeURIComponent(selectedMajor)] ||
      decodeURIComponent(selectedMajor)
    : "";

  const sankeyData = useMemo(() => {
    if (!majorData?.overall?.topNarrowMajorsInsights?.topByEmploymentTiming) {
      return { nodes: [], links: [] };
    }

    // Get all majors and their colors first to ensure consistency
    const majorNodes =
      majorData.overall.topNarrowMajorsInsights.topByEmploymentTiming.map(
        (major) => {
          return {
            name: major.narrowMajor, // Keep original name since we're in page.tsx
            color: getNarrowMajorColor(major.narrowMajor), // Use the color mapping directly
            originalName: major.narrowMajor,
          };
        }
      );

    // Define timing node colors
    const timingColors = {
      "Before Graduation": "#c6c630",
      "Within First Year": "#19ce91",
      "After First Year": "#25b0ba",
    };

    const data = {
      nodes:
        language === "ar"
          ? [
              // Right side nodes (timing nodes) for Arabic
              {
                id: getTranslation("Before Graduation", language),
                nodeColor: timingColors["Before Graduation"],
              },
              {
                id: getTranslation("Within First Year", language),
                nodeColor: timingColors["Within First Year"],
              },
              {
                id: getTranslation("After First Year", language),
                nodeColor: timingColors["After First Year"],
              },
              // Left side nodes (majors) for Arabic
              ...majorNodes.map((node) => ({
                id: node.name,
                nodeColor: node.color,
              })),
            ]
          : [
              // Left side nodes (majors) for English
              ...majorNodes.map((node) => ({
                id: node.name,
                nodeColor: node.color,
              })),
              // Right side nodes (timing nodes) for English
              {
                id: getTranslation("Before Graduation", language),
                nodeColor: timingColors["Before Graduation"],
              },
              {
                id: getTranslation("Within First Year", language),
                nodeColor: timingColors["Within First Year"],
              },
              {
                id: getTranslation("After First Year", language),
                nodeColor: timingColors["After First Year"],
              },
            ],
      links: [],
    };

    // Add links for each major
    majorNodes.forEach((node) => {
      const major =
        majorData.overall.topNarrowMajorsInsights.topByEmploymentTiming.find(
          (m) => m.narrowMajor === node.originalName
        );

      if (!major) return;

      // Before Graduation
      if (major.employmentTiming?.beforeGraduation?.percentage > 0) {
        data.links.push({
          source:
            language === "ar"
              ? getTranslation("Before Graduation", language)
              : node.name,
          target:
            language === "ar"
              ? node.name
              : getTranslation("Before Graduation", language),
          value: major.employmentTiming.beforeGraduation.percentage,
        });
      }

      // Within First Year
      if (major.employmentTiming?.withinFirstYear?.percentage > 0) {
        data.links.push({
          source:
            language === "ar"
              ? getTranslation("Within First Year", language)
              : node.name,
          target:
            language === "ar"
              ? node.name
              : getTranslation("Within First Year", language),
          value: major.employmentTiming.withinFirstYear.percentage,
        });
      }

      // After First Year
      if (major.employmentTiming?.afterFirstYear?.percentage > 0) {
        data.links.push({
          source:
            language === "ar"
              ? getTranslation("After First Year", language)
              : node.name,
          target:
            language === "ar"
              ? node.name
              : getTranslation("After First Year", language),
          value: major.employmentTiming.afterFirstYear.percentage,
        });
      }
    });

    return data;
  }, [majorData, language]);

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
      "Social Sciences, Journalism, Information": FaBook,
      "Generic Programs and Qualifications": FaUserGraduate,
      Services: FaCog,
    };

    // Get English version of major name for mapping
    const englishMajor =
      Object.entries(majorNameMapping.ar).find(
        ([_, value]) => value === majorName
      )?.[0] || majorName;

    return iconMapping[englishMajor as keyof typeof iconMapping];
  };

  return (
    <div
      className={`min-h-screen ${
        language === "ar" ? "text-right" : "text-left"
      }bg-transparent backdrop-blur-sm px-2`}
      style={{ marginTop: "-30px" }}
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 py-8 max-w-full w-[99%]">
        {/* Major Title */}
        <div className="mb-5 flex justify-center items-center gap-3">
          {selectedMajor && getMajorIcon(selectedMajor) && (
            <div className="text-3xl text-[#2CCAD3]">
              {React.createElement(getMajorIcon(selectedMajor))}
            </div>
          )}
          <h1 className="text-white text-2xl text-center">{displayMajor}</h1>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 w-full px-1">
          {/* Graduates */}
          <div
            className={`bg-gradient-to-r ${
              language === "ar"
                ? "from-[#2CCAD3]/20 to-transparent rounded-2xl"
                : "from-transparent to-[#2CCAD3]/20 rounded-2xl"
            } p-3 pt-4 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center`}
          >
            <div
              className={`flex items-center gap-7 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className="bg-[#2CCAD3]/10 p-2"
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                <Image
                  src="/icons/graduateicon.svg"
                  alt={getTranslation("Total Graduates", language)}
                  width={52}
                  height={42}
                  style={{ marginLeft: -10 }}
                />
              </div>
              <div style={{ marginLeft: -20 }}>
                <p className="text-sm text-white">
                  {getTranslation("Total Graduates", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.graduates.totalGraduates.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div
                    className={`flex items-center gap-1 ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <BiMale className="text-[#2CCAD3]" size={20} />
                    <span className="text-white text-sm">
                      {getTranslation("Male", language)}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <BiFemale className="text-[#fe1672]" size={20} />
                    <span className="text-white text-sm">
                      {getTranslation("Female", language)}
                    </span>
                  </div>
                </div>
              </div>
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
              className={`flex items-center gap-6 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className="bg-[#2CCAD3]/10 p-3"
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
                    marginLeft: -10,
                  }}
                />
              </div>
              <div style={{ marginLeft: -10 }}>
                <p className="text-sm text-white">
                  {getTranslation("Average Salary", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.averageSalary.toLocaleString()}
                  <span className="font-normal text-lg">
                    {" "}
                    {getTranslation("SAR", language)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Time to Employment */}
          <div
            className={`bg-gradient-to-r ${
              language === "ar"
                ? "from-[#2CCAD3]/20 to-transparent rounded-2xl"
                : "from-transparent to-[#2CCAD3]/20 rounded-2xl"
            } p-3 pt-7 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center`}
          >
            <div
              className={`flex items-center gap-6 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className="bg-[#2CCAD3]/10 p-4"
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
              <div style={{ marginLeft: -10 }}>
                <p className="text-sm text-white">
                  {getTranslation("Time to Employment", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.timeToEmployment.overall.days}
                  <span className="font-normal text-lg">
                    {" "}
                    {getTranslation("months", language)}
                  </span>
                </p>
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
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className="bg-[#2CCAD3]/10 p-4"
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
              <div style={{ marginLeft: -10 }}>
                <p className="text-sm text-white">
                  {getTranslation("Job Seekers", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.totalJobSeekers}
                </p>
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
              className={`flex items-center gap-6 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className="bg-[#2CCAD3]/10 p-4"
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                <Image
                  src="/icons/employmentrateicon.svg"
                  alt="Employment"
                  width={52}
                  height={42}
                  style={{ marginLeft: -10 }}
                />
              </div>
              <div style={{ marginLeft: -20 }}>
                <p className="text-sm text-white">
                  {getTranslation("Employment Rate", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.employmentRate}%
                </p>
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
                    className={`p-0.5 flex justify-between items-center ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                    style={{
                      background:
                        "linear-gradient(90deg, #176481 0%, #1E1F5E 100%)",
                    }}
                  >
                    <span className="text-sm text-white mx-1">
                      {getTranslation(
                        employmentTimingTranslations.beforeGraduation[language],
                        language
                      )}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {
                        majorData?.overall.totalMetrics.timeToEmployment
                          .beforeGraduation.percentage
                      }
                      %
                    </span>
                  </div>

                  {/* Within First Year */}
                  <div
                    className={`p-0.5 flex justify-between items-center ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                    style={{
                      background:
                        "linear-gradient(90deg, #176481 0%, #1E1F5E 100%)",
                    }}
                  >
                    <span className="text-sm text-white mx-1">
                      {getTranslation(
                        employmentTimingTranslations.withinFirstYear[language],
                        language
                      )}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {
                        majorData?.overall.totalMetrics.timeToEmployment
                          .withinFirstYear.percentage
                      }
                      %
                    </span>
                  </div>

                  {/* After First Year */}
                  <div
                    className={`p-0.5 flex justify-between items-center ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                    style={{
                      background:
                        "linear-gradient(90deg, #176481 0%, #1E1F5E 100%)",
                    }}
                  >
                    <span className="text-sm text-white mx-1">
                      {getTranslation(
                        employmentTimingTranslations.afterFirstYear[language],
                        language
                      )}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {
                        majorData?.overall.totalMetrics.timeToEmployment
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
      </div>
      <Row
        gutter={[12, 12]}
        className="w-full"
        style={{
          padding: "0em 0.2em 0em 1.4em",
          marginTop: "-0.5em",
        }}
      >
        {/* Top Popular Occupations */}
        <Col xs={24} lg={13}>
          <div
            className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            <div
              className={`w-full flex ${
                language === "ar" ? "justify-end" : "justify-start"
              } mb-6`}
            >
              <div className="flex items-center gap-2">
                {language === "en" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/occupation.svg"
                      alt="Occupation"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <span className="text-white text-xl">
                  {translations.charts.topOccupations[language]}
                </span>
                {language === "ar" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/occupation.svg"
                      alt="Occupation"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            </div>
            <div
              className="h-[254px] flex flex-col justify-end relative"
              style={{ top: "10px", marginBottom: "10px" }}
            >
              <div
                className={`flex justify-between items-end h-[200px] ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                {majorData?.overall?.topOccupationsInsights?.mostPopular?.map(
                  (occupation, index) => {
                    // Fixed percentage scale for each bar
                    const percentages = [
                      100, 90, 80, 70, 60, 50, 40, 30, 20, 10,
                    ];
                    const height = percentages[index] || 12;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center group w-[40px]"
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
                                "linear-gradient(to top, #2CD7C4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)",
                            }}
                          />
                        </div>
                        {/* horizontal line */}
                        <div
                          className="absolute right-0 h-[2px] w-full bg-gray-100 top-52 transform -translate-y-1/6"
                          style={{ marginTop: "-10px" }}
                        />

                        {/* {text} */}
                        <div
                          className={`mt-4 text-center px-1 min-h-[27px] ${
                            language === "ar" ? "text-right" : ""
                          }`}
                        >
                          <span
                            className="text-[10px] text-white block break-words capitalize transform translate-y-8 w-24"
                            style={{
                              transform:
                                language === "ar"
                                  ? "rotate(45deg) translateY(8px) translateX(2px)"
                                  : "rotate(-45deg) translateY(10px) translateX(-2px)",
                              transformOrigin:
                                language === "ar"
                                  ? "right bottom"
                                  : "left bottom",
                              direction: language === "ar" ? "rtl" : "ltr",
                            }}
                          >
                            {occupation.occupation}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            {!majorData?.overall?.topOccupationsInsights?.mostPopular
              ?.length && (
              <div className="flex items-center justify-center h-[200px] text-white">
                {getTranslation("No data available", language)}
              </div>
            )}
          </div>
        </Col>

        {/* Degrees */}
        <Col xs={24} lg={11}>
          <div
            className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            <div
              className={`w-full flex ${
                language === "ar" ? "justify-end" : "justify-start"
              } mb-6`}
            >
              <div className="flex items-center gap-2">
                {language === "en" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/degree.svg"
                      alt="Degree"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <span className="text-white text-xl">
                  {getTranslation("Degree", language)}
                </span>
                {language === "ar" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/degree.svg"
                      alt="Degree"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4 relative" style={{ top: "30px" }}>
              {/* Vertical line */}
              <div
                className={`absolute ${
                  language === "ar" ? "right-[200px]" : "left-[200px]"
                } top-0 bottom-0 w-[1.5px] bg-gray-100`}
              />
              {[
                ...(majorData?.overall?.topNarrowMajorsInsights?.topByGender ||
                  []),
              ]
                .sort((a, b) => b.employmentRate - a.employmentRate)
                .slice(0, 5) // Added slice to limit to top 5
                .map((major, index) => {
                  const width = major.employmentRate;
                  return (
                    <div
                      key={index}
                      className={`flex items-center group ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className="w-[200px] relative cursor-pointer"
                        onClick={() =>
                          handleNarrowMajorSelect(major.narrowMajor)
                        }
                      >
                        <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                        <span
                          className={`relative z-10 text-sm text-white px-3 py-1 block break-words ${
                            language === "ar" ? "text-right" : "text-left"
                          }`}
                        >
                          {major.narrowMajor}
                        </span>
                      </div>
                      <div className="relative flex-1 h-18">
                        <div
                          className={`absolute border-[1px] border-white ${
                            language === "ar"
                              ? "right-0 rounded-l-full"
                              : "left-0 rounded-r-full"
                          } top-1/2 -translate-y-1/2 h-7 group-hover:opacity-90 transition-opacity cursor-pointer`}
                          style={{
                            width: `${width}%`,
                            maxWidth: "100%",
                            background:
                              language === "ar"
                                ? "linear-gradient(to left, #2CD7C4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)"
                                : "linear-gradient(to right, #2CD7C4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)",
                          }}
                          onClick={() =>
                            handleNarrowMajorSelect(major.narrowMajor)
                          }
                        >
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 ${
                              language === "ar" ? "right-2" : "left-2"
                            }`}
                          >
                            <span className="text-base font-bold text-white">
                              {major.employmentRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {!majorData?.overall?.topNarrowMajorsInsights?.topByGender
                ?.length && (
                <div className="flex items-center justify-center h-[200px] text-white">
                  {getTranslation("No data available", language)}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row
        gutter={[12, 12]}
        className="w-full"
        style={{
          padding: "0em 0.2em 0em 1.4em",
          marginTop: "1em",
        }}
      >
        {/* Top Majors by Gender */}
        <Col xs={24} lg={6}>
          <div
            className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            <div
              className={`w-full flex ${
                language === "ar" ? "justify-end" : "justify-start"
              } mb-6`}
            >
              <div className="flex items-center gap-2">
                {language === "en" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/degree.svg"
                      alt="Degree"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <span className="text-white text-xl">
                  {translations.charts.topNarrowMajorsByGender[language]}
                </span>
                {language === "ar" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/degree.svg"
                      alt="Degree"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {majorData?.overall?.topNarrowMajorsInsights?.topByGender
                ?.slice(0, 5)
                .map((major, index) => (
                  <div key={index} className="relative">
                    <div className="mb-1 flex justify-between items-center">
                      <span className="text-sm text-white">
                        {major.narrowMajor}
                      </span>
                      <span className="text-xs text-white">
                        {major.graduates}{" "}
                        {getTranslation("graduates", language)}
                      </span>
                    </div>
                    <div className="relative h-8 bg-[#1E1F5E] rounded-full overflow-hidden">
                      {/* Male percentage */}
                      <div
                        className="absolute h-full bg-gradient-to-r from-[#2cd7c4]/30 to-[#2cd7c4]/100 group-hover:opacity-90 transition-opacity cursor-pointer"
                        style={{
                          width: `${major.genderDistribution.male.percentage}%`,
                          left: 0,
                        }}
                        onClick={() =>
                          handleNarrowMajorSelect(major.narrowMajor)
                        }
                      >
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <BiMale className="text-[#2CCAD3]" />
                          <span className="text-xs text-white">
                            {major.genderDistribution.male.percentage}%
                          </span>
                        </div>
                      </div>
                      {/* Female percentage */}
                      <div
                        className="absolute h-full bg-gradient-to-r from-[#fe1684]/100 to-[#fe1684]/30 group-hover:opacity-90 transition-opacity cursor-pointer"
                        style={{
                          width: `${major.genderDistribution.female.percentage}%`,
                          right: 0,
                        }}
                        onClick={() =>
                          handleNarrowMajorSelect(major.narrowMajor)
                        }
                      >
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="text-xs text-white">
                            {major.genderDistribution.female.percentage}%
                          </span>
                          <BiFemale style={{ color: "#fe1672" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {!majorData?.overall?.topNarrowMajorsInsights?.topByGender
                ?.length && (
                <div className="flex items-center justify-center h-[200px] text-white">
                  {getTranslation("No data available", language)}
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* Sankey Chart Row */}
        <Col xs={10} lg={12}>
          <div
            className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            <div
              className={`w-full flex ${
                language === "ar" ? "justify-end" : "justify-start"
              } mb-6`}
            >
              <div className="flex items-center gap-2">
                {language === "en" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg flex justify-center items-center">
                    <Image
                      src="/icons/major.svg"
                      alt="Major"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <span className="text-white text-xl">
                  {translations.charts.timeToEmployment[language]}
                </span>
                {language === "ar" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg flex justify-center items-center">
                    <Image
                      src="/icons/major.svg"
                      alt="Major"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="flex justify-center">
              <div className="h-[400px] w-full max-w-[700px]">
                {sankeyData.nodes.length > 0 && (
                  <ResponsiveSankey
                    data={sankeyData}
                    margin={{ top: 20, right: 150, bottom: 20, left: 150 }}
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
                    nodeThickness={18}
                    nodeInnerPadding={1}
                    nodeSpacing={16}
                    nodeBorderWidth={0}
                    nodeBorderRadius={3}
                    linkOpacity={0.3}
                    linkHoverOpacity={0.7}
                    linkContract={2}
                    enableLinkGradient={true}
                    labelPosition="outside"
                    labelOrientation="horizontal"
                    labelPadding={6}
                    labelTextColor={{
                      from: "color",
                      modifiers: [["darker", 1]],
                    }}
                    animate={true}
                    label={(node) => {
                      const text = node.id;
                      const maxLineWidth = 25;
                      const words = text.split(" ");
                      let lines = [];
                      let currentLine = words[0];

                      for (let i = 1; i < words.length; i++) {
                        const word = words[i];
                        if ((currentLine + " " + word).length <= maxLineWidth) {
                          currentLine += " " + word;
                        } else {
                          lines.push(currentLine);
                          currentLine = word;
                        }
                      }
                      lines.push(currentLine);

                      const isTimingNode = [
                        getTranslation("Before Graduation", language),
                        getTranslation("Within First Year", language),
                        getTranslation("After First Year", language),
                      ].includes(node.id);

                      return lines.map((line, index) => (
                        <tspan
                          key={index}
                          x={isTimingNode ? 5 : -5}
                          dy={index === 0 ? 0 : 14}
                          textAnchor={isTimingNode ? "start" : "end"}
                          dominantBaseline="middle"
                        >
                          {line}
                        </tspan>
                      ));

                      // For timing nodes, don't add word breaks
                      if (isTimingNode) {
                        return language === "ar"
                          ? `${node.id} ←`
                          : `→ ${node.id}`;
                      }

                      // For major nodes, add word breaks
                      const breakText = addWordBreaks(node.id, 20);
                      return language === "ar"
                        ? `→ ${breakText}`
                        : `${breakText} ←`;
                    }}
                    theme={{
                      labels: {
                        text: {
                          fontSize: 13,
                          fill: "#fff",
                          fontWeight: "bold",
                        },
                      },
                      tooltip: {
                        container: {
                          background: "#1E1F5E",
                          color: "#fff",
                          fontSize: 12,
                          borderRadius: 8,
                          padding: "8px 12px",
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Col>

        {/* Employment Rate by Narrow Major */}
        <Col xs={24} lg={6}>
          <div
            className={`bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border border-[#2CCAD3]/30 hover:border-white transition-colors h-full ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            <div
              className={`w-full flex ${
                language === "ar" ? "justify-end" : "justify-start"
              } mb-6`}
            >
              <div className="flex items-center gap-2">
                {language === "en" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/employmentrateicon.svg"
                      alt="Employment Rate"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <span className="text-white text-xl">
                  {translations.charts.employmentRateByMajor[language]}
                </span>
                {language === "ar" && (
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/employmentrateicon.svg"
                      alt="Employment Rate"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4 relative" style={{ top: "30px" }}>
              {/* Vertical line */}
              <div
                className={`absolute ${
                  language === "ar" ? "right-[200px]" : "left-[200px]"
                } top-0 bottom-0 w-[1.5px] bg-gray-100`}
              />
              {[
                ...(majorData?.overall?.topNarrowMajorsInsights?.topByGender ||
                  []),
              ]
                .sort((a, b) => b.employmentRate - a.employmentRate)
                .slice(0, 5) // Added slice to limit to top 5
                .map((major, index) => {
                  const width = major.employmentRate;
                  return (
                    <div
                      key={index}
                      className={`flex items-center group ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className="w-[200px] relative cursor-pointer"
                        onClick={() =>
                          handleNarrowMajorSelect(major.narrowMajor)
                        }
                      >
                        <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                        <span
                          className={`relative z-10 text-sm text-white px-3 py-1 block break-words ${
                            language === "ar" ? "text-right" : "text-left"
                          }`}
                        >
                          {major.narrowMajor}
                        </span>
                      </div>
                      <div className="relative flex-1 h-18">
                        <div
                          className={`absolute border-[1px] border-white ${
                            language === "ar"
                              ? "right-0 rounded-l-full"
                              : "left-0 rounded-r-full"
                          } top-1/2 -translate-y-1/2 h-7 group-hover:opacity-90 transition-opacity cursor-pointer`}
                          style={{
                            width: `${width}%`,
                            maxWidth: "100%",
                            background:
                              language === "ar"
                                ? "linear-gradient(to left, #2CD7C4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)"
                                : "linear-gradient(to right, #2CD7C4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)",
                          }}
                          onClick={() =>
                            handleNarrowMajorSelect(major.narrowMajor)
                          }
                        >
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 ${
                              language === "ar" ? "right-2" : "left-2"
                            }`}
                          >
                            <span className="text-base font-bold text-white">
                              {major.employmentRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {!majorData?.overall?.topNarrowMajorsInsights?.topByGender
                ?.length && (
                <div className="flex items-center justify-center h-[200px] text-white">
                  {getTranslation("No data available", language)}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
