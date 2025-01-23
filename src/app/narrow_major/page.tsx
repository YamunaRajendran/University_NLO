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
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLanguage } from '@/app/context/LanguageContext';
import { getTranslation } from '@/app/utils/translations';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import mockDataMajorEn from "@/app/majors/final_data_15-01 (version2).json";
import mockDataMajorAr from "@/app/majors/major_insights_arabic.json";

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
  "قبل التخرج": "#c6c630",
  "خلال السنة الأولى": "#19ce91",
  "بعد السنة الأولى": "#25b0ba",
};

const getNarrowMajorColor = (
  narrowMajor: string,
  selectedMajor: string | null
) => {
  return "#2CCAD3";
};

const majorNameMapping = {
  'Business, administration and law': {
    en: 'Business, administration and law',
    ar: 'الأعمال والإدارة والقانون'
  },
  'Arts and Humanities': {
    en: 'Arts and Humanities',
    ar: 'الفنون والعلوم الإنسانية'
  },
  'Health and Welfare': {
    en: 'Health and Welfare',
    ar: 'الصحة والرفاه'
  },
  'Natural Sciences, Mathematics and Statistics': {
    en: 'Natural Sciences, Mathematics and Statistics',
    ar: 'العلوم الطبيعية والرياضيات والإحصاء'
  },
  'Communications and Information Technology': {
    en: 'Communications and Information Technology',
    ar: 'تقنية الاتصالات والمعلومات'
  },
  'Social Sciences, Journalism, Information': {
    en: 'Social Sciences, Journalism, Information and Media',
    ar: 'العلوم الاجتماعية والصحافة والإعلام'
  },
  'Services': {
    en: 'Services',
    ar: 'الخدمات'
  },
  'Agriculture, Forestry, Fisheries and Veterinary': {
    en: 'Agriculture, Forestry, Fisheries and Veterinary',
    ar: 'الزراعة والحراجة ومصائد الأسماك والبيطرة'
  },
  'Generic Programs and Qualifications': {
    en: 'Generic Programs and Qualifications',
    ar: 'البرامج العامة والمؤهلات'
  },
  'education': {
    en: 'Education',
    ar: 'التعليم'
  },
  'Engineering, manufacturing and construction': {
    en: 'Engineering, manufacturing and construction',
    ar: 'الهندسة والتصنيع والبناء'
  }
};

const narrowMajorMapping = {
  'Business and administration': {
    en: 'Business and administration',
    ar: 'الأعمال والإدارة'
  },
  'law': {
    en: 'law',
    ar: 'القانون'
  },
  'health': {
    en: 'health',
    ar: 'الصحة'
  },
  'Welfare': {
    en: 'Welfare',
    ar: 'الرفاه'
  },
  'Education': {
    en: 'Education',
    ar: 'التعليم'
  },
  'Personal services': {
    en: 'Personal services',
    ar: 'الخدمات الشخصية'
  },
  'Transportation services': {
    en: 'Transportation services',
    ar: 'خدمات النقل'
  },
  'Security service': {
    en: 'Security service',
    ar: 'خدمات الأمن'
  },
  'Basic programs and qualifications': {
    en: 'Basic programs and qualifications',
    ar: 'البرامج الأساسية والمؤهلات'
  },
  'Skills and personal development development': {
    en: 'Skills and personal development development',
    ar: 'تنمية المهارات والتنمية الشخصية'
  },
  'General hygiene and occupational health services': {
    en: 'General hygiene and occupational health services',
    ar: 'خدمات النظافة العامة والصحة المهنية'
  },
  'Social and behavioral sciences': {
    en: 'Social and behavioral sciences',
    ar: 'العلوم الاجتماعية والسلوكية'
  },
  'Journalism and media': {
    en: 'Journalism and media',
    ar: 'الصحافة والإعلام'
  },
  'Languages': {
    en: 'Languages',
    ar: 'اللغات'
  },
  'Human studies except languages': {
    en: 'Human studies except languages',
    ar: 'الدراسات الإنسانية باستثناء اللغات'
  },
  'Arts': {
    en: 'Arts',
    ar: 'الفنون'
  },
  'Physical sciences': {
    en: 'Physical sciences',
    ar: 'العلوم الفيزيائية'
  },
  'Biological sciences and related sciences': {
    en: 'Biological sciences and related sciences',
    ar: 'العلوم البيولوجية والعلوم المتصلة بها'
  },
  'Mathematics and Statistics': {
    en: 'Mathematics and Statistics',
    ar: 'الرياضيات والإحصاء'
  },
  'environment': {
    en: 'environment',
    ar: 'البيئة'
  },
  'Engineering and engineering crafts': {
    en: 'Engineering and engineering crafts',
    ar: 'الهندسة والحرف الهندسية'
  },
  'Architecture and construction': {
    en: 'Architecture and construction',
    ar: 'الهندسة المعمارية والبناء'
  },
  'Manufacturing and processing': {
    en: 'Manufacturing and processing',
    ar: 'التصنيع والمعالجة'
  },
  'Forestry': {
    en: 'Forestry',
    ar: 'الحراجة'
  },
  'Veterinary': {
    en: 'Veterinary',
    ar: 'البيطرة'
  },
  'Agriculture': {
    en: 'Agriculture',
    ar: 'الزراعة'
  },
  'Communications and Information Technology': {
    en: 'Communications and Information Technology',
    ar: 'تقنية الاتصالات والمعلومات'
  },
  'Multi -disciplinary programs and qualifications include telecommunications and information technology': {
    en: 'Multi -disciplinary programs and qualifications include telecommunications and information technology',
    ar: 'البرامج والمؤهلات متعددة التخصصات تتضمن تقنية الاتصالات والمعلومات'
  },
  'Unlimited programs in business, administration and law': {
    en: 'Unlimited programs in business, administration and law',
    ar: 'برامج غير محددة في الأعمال والإدارة والقانون'
  },
  'Multidisciplinary programs and qualifications include health and wellbeing': {
    en: 'Multidisciplinary programs and qualifications include health and wellbeing',
    ar: 'البرامج والمؤهلات متعددة التخصصات تتضمن الصحة والرفاه'
  },
  'Other programs in natural sciences, mathematics and statistics are not classified elsewhere': {
    en: 'Other programs in natural sciences, mathematics and statistics are not classified elsewhere',
    ar: 'برامج أخرى في العلوم الطبيعية والرياضيات والإحصاء غير مصنفة في مكان آخر'
  },
  'Multiple specialties programs and qualifications include natural sciences, mathematics and statistics': {
    en: 'Multiple specialties programs and qualifications include natural sciences, mathematics and statistics',
    ar: 'برامج ومؤهلات متعددة التخصصات تتضمن العلوم الطبيعية والرياضيات والإحصاء'
  },
  'Multi -disciplinary programs and qualifications include engineering, manufacturing and construction': {
    en: 'Multi -disciplinary programs and qualifications include engineering, manufacturing and construction',
    ar: 'برامج ومؤهلات متعددة التخصصات تتضمن الهندسة والتصنيع والبناء'
  }
};



export default function ThirdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const [currentData, setCurrentData] = useState(language === 'en' ? mockDataMajorEn : mockDataMajorAr);
  const [generalMajorData, setGeneralMajorData] = useState<any>(null);
  const [narrowMajorData, setNarrowMajorData] = useState<any>(null);

  // Get English parameters from URL
  const selectedNarrowMajor = searchParams.get("major"); // This will be in English
  const selectedGeneralMajor = searchParams.get("generalMajor"); // This will be in English

  useEffect(() => {
    // Update current data based on language
    setCurrentData(language === 'en' ? mockDataMajorEn : mockDataMajorAr);

    // Find general major data - keep English in URL but display in current language
    const generalMajorName = selectedGeneralMajor ? decodeURIComponent(selectedGeneralMajor) : '';
    
    // Find the mapping key by comparing case-insensitively
    const generalMajorKey = Object.keys(majorNameMapping).find(
      key => key.toLowerCase() === generalMajorName.toLowerCase()
    ) || generalMajorName;
    
    const mappedGeneralMajorName = majorNameMapping[generalMajorKey]?.[language] || generalMajorName;

    console.log('Looking for general major:', mappedGeneralMajorName);
    
    const foundGeneralMajor = currentData.majorsInsights.byGeneralMajor.generalMajors.find(
      (major) => major.generalMajor.toLowerCase() === mappedGeneralMajorName.toLowerCase()
    );
    
    setGeneralMajorData(foundGeneralMajor);

    // Find narrow major data if general major is found
    if (foundGeneralMajor) {
      const narrowMajorName = selectedNarrowMajor ? decodeURIComponent(selectedNarrowMajor) : '';
      
      // Find the mapping key by comparing case-insensitively
      const narrowMajorKey = Object.keys(narrowMajorMapping).find(
        key => key.toLowerCase() === narrowMajorName.toLowerCase()
      ) || narrowMajorName;
      
      const mappedNarrowMajorName = narrowMajorMapping[narrowMajorKey]?.[language] || narrowMajorName;

      console.log('Looking for narrow major:', mappedNarrowMajorName);
      
      const foundNarrowMajor = foundGeneralMajor.byNarrowMajor.narrowMajors.find(
        (major) => major.narrowMajor.toLowerCase() === mappedNarrowMajorName.toLowerCase()
      );

      console.log('Found narrow major:', foundNarrowMajor);
      setNarrowMajorData(foundNarrowMajor);
    }
  }, [language, selectedGeneralMajor, selectedNarrowMajor, currentData]);

  // Display the title in the current language
  const displayNarrowMajor = selectedNarrowMajor ? 
    (narrowMajorMapping[decodeURIComponent(selectedNarrowMajor)]?.[language] || decodeURIComponent(selectedNarrowMajor)) : '';

  // Get the mapped name for the Sankey chart
  const getMappedNarrowMajorName = (narrowMajorName: string) => {
    if (!narrowMajorName) return '';
    const decodedName = decodeURIComponent(narrowMajorName);
    // Find the mapping key by comparing case-insensitively
    const mappingKey = Object.keys(narrowMajorMapping).find(
      key => key.toLowerCase() === decodedName.toLowerCase()
    );
    return mappingKey ? narrowMajorMapping[mappingKey][language] : decodedName;
  };

  console.log('Selected General Major (English):', selectedGeneralMajor);
  console.log('Selected Narrow Major (English):', selectedNarrowMajor);
  console.log('Current Language:', language);
  console.log('Found General Major Data:', generalMajorData);
  console.log('Found Narrow Major Data:', narrowMajorData);
  console.log('Display Narrow Major:', displayNarrowMajor);

  const overviewStats = narrowMajorData?.overall.totalMetrics;
  const topOccupations =
    narrowMajorData?.overall.topOccupationsInsights.highestPaying || [];
  const educationLevels = overviewStats?.educationLevelInsights || [];
  // const topMajors = narrowMajorData?.overall.topMajorsInsights || [];

  const getTimingNodeColor = (nodeId: string) => {
    const timingNodes = {
      [getTranslation("Before Graduation", "en")]: "#FFB74D",
      [getTranslation("Within First Year", "en")]: "#64B5F6",
      [getTranslation("After First Year", "en")]: "#81C784",
      [getTranslation("Before Graduation", "ar")]: "#FFB74D",
      [getTranslation("Within First Year", "ar")]: "#64B5F6",
      [getTranslation("After First Year", "ar")]: "#81C784",
    };
    return timingNodes[nodeId] || "#6366f1";
  };

  return (
    <div className="min-h-screen bg-transparent backdrop-blur-sm px-2">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 py-8 max-w-full w-[99%]">
        {/* Major Title */}
        <div className="mb-5">
          <h1 className="text-white font-['Roboto_Regular'] text-2xl text-center">
            {displayNarrowMajor}
          </h1>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 w-full px-1">
          {/* Graduates */}
          <div className="bg-gradient-to-r from-transparent to-[#2CCAD3]/20 rounded-2xl p-3 pt-4 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center">
            <div className="flex items-center gap-6">
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
                />
              </div>
              <div>
                <p className="text-sm font-['Roboto_Regular'] text-white">
                  {getTranslation("Total Graduates", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.graduates.totalGraduates.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-[#2CCAD3]/20 rounded-full flex items-center gap-1 px-2 py-0.5">
                    <BiMale style={{ color: "#2CCAD3" }} />
                    <span className="text-xs font-['Roboto_Regular'] text-white">
                      {overviewStats?.graduates.male.percentage}%
                    </span>
                  </div>
                  <div className="bg-[#2CCAD3]/20 rounded-full flex items-center gap-1 px-2 py-0.5">
                    <BiFemale style={{ color: "#2CCAD3" }} />
                    <span className="text-xs font-['Roboto_Regular'] text-white">
                      {overviewStats?.graduates.female.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Rate */}
          <div className="bg-gradient-to-r from-transparent to-[#2CCAD3]/20 rounded-2xl p-3 pt-7 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center">
            <div className="flex items-center gap-6">
              <div
                className="bg-[#2CCAD3]/10 p-2"
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                <FaBusinessTime
                  style={{ color: "#2CCAD3", width: 52, height: 42 }}
                />
              </div>
              <div>
                <p className="text-sm font-['Roboto_Regular'] text-white">
                  {getTranslation("Time to Employment", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {narrowMajorData?.overall.totalMetrics.timeToEmployment.overall.days}
                  <span className="font-normal text-lg"> {getTranslation("days", language)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Average Salary */}
          <div className="bg-gradient-to-r from-transparent to-[#2CCAD3]/20 rounded-2xl p-3 pt-7 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center">
            <div className="flex items-center gap-6">
              <div
                className="bg-[#2CCAD3]/10 p-2"
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 0,
                  marginLeft: 8,
                }}
              >
                <PiMoneyFill
                  style={{ color: "#2CCAD3", width: 52, height: 42 }}
                />
              </div>
              <div>
                <p className="text-sm font-['Roboto_Regular'] text-white">
                  {getTranslation("Average Salary", language)}
                </p>
                <p className="text-4xl font-bold text-white">
                  {narrowMajorData?.overall.totalMetrics.averageSalary.toLocaleString()}
                  <span className="font-normal text-lg"> {getTranslation("SAR", language)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Time to Employment */}
          <div className="bg-gradient-to-r from-transparent to-[#2CCAD3]/20 rounded-l-2xl p-3 pt-7 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center">
            <div className="flex items-center gap-6">
              <div
                className="bg-[#2CCAD3]/10 p-2"
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
                />
              </div>
              <div>
                <p className="text-sm font-['Roboto_Regular'] text-white">
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
                    className="p-0.5 flex justify-between items-center"
                    style={{
                      background:
                        "linear-gradient(90deg, #176481 0%, #1E1F5E 100%)",
                    }}
                  >
                    <span className="text-sm font-['Roboto_Regular'] text-white/50 ml-1">
                      {getTranslation("Before Graduation", language)}
                    </span>
                    <span className="text-lg font-['Roboto_Regular'] font-bold text-white">
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
                    <span className="text-sm text-white/50 ml-1">
                      {getTranslation("Within First Year", language)}
                    </span>
                    <span className="text-lg font-['Roboto_Regular'] font-bold text-white">
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
                    <span className="text-sm text-white/50 ml-1">
                      {getTranslation("After First Year", language)}
                    </span>
                    <span className="text-lg font-['Roboto_Regular'] font-bold text-white">
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
          className="w-full"
          style={{ padding: "0em 0em 0em 0em", marginTop: "2.5em" }}
        >
          {/* Top Popular Occupations */}
          <Col xs={24} lg={7}>
            <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
              <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
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
                style={{ top: "70px" }}
              >
                <div className="flex justify-between items-end h-[200px] px-1">
                  {narrowMajorData?.overall?.topOccupationsInsights?.mostPopular?.map(
                    (occupation, index) => {
                      // Fixed percentage scale for each bar
                      const percentages = [100, 75, 50, 35, 25];
                      const height = percentages[index] || 12;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center group w-[50px]"
                        >
                          {/* Value on top of bar */}
                          <div
                            className="text-sm font-['Roboto_Regular'] text-white mb-1"
                            style={{ marginBottom: "15px" }}
                          >
                            {occupation.totalGraduates.toLocaleString()}
                          </div>
                          <div
                            className="w-[35px] relative"
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
                            className="absolute left-[10px] h-[2px] w-[96%] bg-gray-100 top-52 transform -translate-y-1/6"
                            style={{ marginTop: "-10px" }}
                          />

                          {/* {text} */}
                          <div className="mt-4 text-center px-1 min-h-[27px] ">
                            <span
                              className="text-[10px] font-['Roboto_Regular'] text-white block break-words capitalize -rotate-45 transform origin-top-left translate-y-20 -translate-x-2 w-24"
                              style={{
                                wordBreak: "break-word",
                                lineHeight: "1.2",
                                marginTop: "-20px",
                              }}
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

          {/* Top 5 Occupation by Salary */}
          <Col xs={24} lg={11}>
            <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
              <h2 className="text-xl font-['Neo_Sans_Bold'] mb-6 flex items-center gap-2">
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
              {/* Container for chart and legends */}
              <div className="flex flex-col items-center gap-4">
                {/* Chart container */}
                <div className="h-[300px] w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="30%"
                      outerRadius="110%"
                      data={topOccupations
                        .slice(0, 5)
                        .sort((a, b) => a.averageSalary - b.averageSalary)
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
              {/* Legends container */}
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
                        {/* Color box */}
                        <div
                          style={{
                            backgroundColor: colors[sortedIndex],
                          }}
                          className="w-4 h-4 rounded-sm"
                        ></div>
                        {/* Legend text */}
                        <span className="text-white text-sm font-['Roboto']">
                          {occupation.occupation}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Col>

          {/* Employment Rate by Narrow Major */}
          <Col xs={24} lg={6}>
            <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
              <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
                <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                  <Image
                    src="/icons/employmentrateicon.svg"
                    alt="Employment Rate"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-white">
                  {getTranslation("Employment Rate by Narrow Major", language)}
                </span>
              </h2>
              <div
                className="space-y-4 relative"
                style={{ top: "40px", left: "20px" }}
              >
                {/* Vertical line */}
                <div className="absolute left-[180px] top-0 bottom-0 w-[1.5px] bg-gray-100" />
                {narrowMajorData?.overall.topMajorsInsights.topByEmploymentRate?.map(
                  (major, index) => {
                    const width = major.employmentRate;
                    return (
                      <div key={index} className="flex items-center group">
                        <div className="w-[180px] relative">
                          <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                          <span className="relative z-10 text-sm font-['Roboto_Regular'] text-white/70 px-3 py-1 block break-words capitalize">
                            {major.name}
                          </span>
                        </div>
                        <div className="relative flex-1 h-8">
                          <div
                            className="absolute border-[1px] border-white left-0 top-1/2 -translate-y-1/2 h-7 rounded-r-full group-hover:opacity-90 transition-opacity"
                            style={{
                              width: `${width + 5}%`,
                              maxWidth: "100%",
                              background:
                                "linear-gradient(to right, #2cd7c4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)",
                            }}
                          >
                            <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <span className="text-base font-['Roboto_Regular'] font-bold text-white">
                                {width}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
                {!narrowMajorData?.overall.topMajorsInsights.topByEmploymentRate
                  ?.length && (
                  <div className="flex items-center justify-center h-[200px] text-white/40">
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
          style={{ padding: "0em 0em 0em 0em", marginTop: "1.5em" }}
        >
          {/* Degrees - Wider column */}
          <Col xs={26} lg={10}>
            <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
              <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
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
              <div className="space-y-4 relative pr-28" style={{ top: "10px" }}>
                {/* Vertical line */}
                <div className="absolute left-[160px] top-0 bottom-0 w-[1.5px] bg-gray-100" />

                {narrowMajorData?.overall.totalMetrics.educationLevelInsights
                  .slice(0, 5)
                  .map((level, index) => {
                    const percentages = [98, 75, 45, 30, 15];
                    const percentage = percentages[index] || 12;
                    const isSmallBar = percentage < 30;

                    return (
                      <div key={index} className="flex items-center group">
                        <div className="w-[160px] relative">
                          <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                          <span className="relative z-10 text-sm font-['Roboto_Regular'] text-white/70 px-3 py-1 block truncate">
                            {level.educationLevel}
                          </span>
                        </div>
                        <div className="relative flex-1 h-8 flex items-center">
                          {/* Bar with total graduates */}
                          <div
                            className="absolute border-[1px] border-white left-0 top-1/2 -translate-y-1/2 h-7 rounded-r-full group-hover:opacity-90 transition-opacity"
                            style={{
                              width: `${percentage}%`,
                              maxWidth: "100%",
                              background:
                                "linear-gradient(to right, #2cd7c4 0%, rgba(44, 215, 196, 0.6) 50%, transparent 100%)",
                            }}
                          >
                            {/* Total Graduates */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <span className="text-sm font-['Roboto_Regular'] font-bold text-white whitespace-nowrap">
                                {level.totalGraduates.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Employment Rate */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{
                              left: `calc(${percentage}% + 16px)`,
                            }}
                          >
                            <div className="bg-[#2CCAD3]/20 rounded-full px-3 py-1">
                              <span className="text-white text-sm font-['Roboto_Regular'] whitespace-nowrap">
                              {level.employmentRate}% {getTranslation("employed", language)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Col>

          {/* Sankey Chart */}
          <Col xs={10} lg={8}>
            <div className="">
              <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
                <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
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
                      "Narrow Majors By Time of Employment",
                      language
                    )}
                  </span>
                </h2>

                <div className="flex justify-center">
                  <div className="h-[400px] w-full max-w-[600px]">
                    {narrowMajorData?.overall.totalMetrics.timeToEmployment && (
                      <ResponsiveSankey
                        data={{
                          nodes: [
                            {
                              id: getMappedNarrowMajorName(selectedNarrowMajor || ""),
                              nodeColor: getNarrowMajorColor(
                                selectedNarrowMajor || "",
                                selectedGeneralMajor
                              ),
                            },
                            {
                              id: getTranslation("Before Graduation", language),
                              nodeColor: colorMapping["Before Graduation"],
                            },
                            {
                              id: getTranslation("Within First Year", language),
                              nodeColor: colorMapping["Within First Year"],
                            },
                            {
                              id: getTranslation("After First Year", language),
                              nodeColor: colorMapping["After First Year"],
                            },
                          ],
                          links: [
                            {
                              source: getMappedNarrowMajorName(selectedNarrowMajor || ""),
                              target: getTranslation("Before Graduation", language),
                              value:
                                narrowMajorData.overall.totalMetrics
                                  .timeToEmployment.beforeGraduation.percentage,
                            },
                            {
                              source: getMappedNarrowMajorName(selectedNarrowMajor || ""),
                              target: getTranslation("Within First Year", language),
                              value:
                                narrowMajorData.overall.totalMetrics
                                  .timeToEmployment.withinFirstYear.percentage,
                            },
                            {
                              source: getMappedNarrowMajorName(selectedNarrowMajor || ""),
                              target: getTranslation("After First Year", language),
                              value:
                                narrowMajorData.overall.totalMetrics
                                  .timeToEmployment.afterFirstYear.percentage,
                            },
                          ],
                        }}
                        margin={{ top: 20, right: 115, bottom: 20, left: 130 }}
                        align="justify"
                        colors={(node) => {
                          const timingNodes = [
                            getTranslation("Before Graduation", language),
                            getTranslation("Within First Year", language),
                            getTranslation("After First Year", language),
                          ];
                          if (timingNodes.includes(node.id)) {
                            // Map back to English key for color mapping
                            const englishKey = Object.keys(colorMapping).find(key => 
                              getTranslation(key, language) === node.id
                            );
                            return colorMapping[englishKey || "Before Graduation"];
                          }
                          return getNarrowMajorColor(
                            selectedNarrowMajor || "",
                            selectedGeneralMajor
                          );
                        }}
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
                        }}
                        theme={{
                          labels: {
                            text: {
                              fontSize: 15,
                              fill: "#fff",
                              fontFamily: "Roboto_Regular",
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
                    {!narrowMajorData?.overall.totalMetrics
                      .timeToEmployment && (
                      <div className="flex items-center justify-center h-[20px] text-white/40">
                        {getTranslation("No data available", language)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Top Majors by Gender */}
          <Col xs={24} lg={6}>
            <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
              <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
                <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                  <div className="flex gap-1">
                    <Image
                      src="/icons/degree.svg"
                      alt="Degree"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
                <span className="text-white">
                  {getTranslation("Top Narrow Majors by Gender", language)}
                </span>
              </h2>
              <div className="space-y-4">
                {narrowMajorData?.overall.topMajorsInsights.topByGender
                  ?.slice(0, 5)
                  .map((major, index) => (
                    <div key={index} className="relative">
                      <div className="mb-1 flex justify-between items-center">
                        <span className="text-sm font-['Roboto_Regular'] text-white/70">
                          {major.name}
                        </span>
                        <span className="text-xs font-['Roboto_Regular'] text-white/50">
                        {major.graduates} {getTranslation("graduates", language)}                        </span>
                      </div>
                      <div className="relative h-8 bg-[#1E1F5E] rounded-full overflow-hidden">
                        {/* Male percentage */}
                        <div
                          className="absolute h-full bg-gradient-to-r from-[#2cd7c4]/30 to-[#2cd7c4]/100 group-hover:opacity-90 transition-opacity"
                          style={{
                            width: `${major.genderDistribution.male.percentage}%`,
                            left: 0,
                          }}
                        >
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <BiMale style={{ color: "#2CCAD3" }} />
                            <span className="text-xs font-['Roboto_Regular'] text-white">
                              {major.genderDistribution.male.percentage}%
                            </span>
                          </div>
                        </div>
                        {/* Female percentage */}
                        <div
                          className="absolute h-full bg-gradient-to-r from-[#fe1684]/30 to-[#fe1684]/100 group-hover:opacity-90 transition-opacity"
                          style={{
                            width: `${major.genderDistribution.female.percentage}%`,
                            right: 0,
                          }}
                        >
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-xs font-['Roboto_Regular'] text-white">
                              {major.genderDistribution.female.percentage}%
                            </span>
                            <BiFemale style={{ color: "#2CCAD3" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {!narrowMajorData?.overall.topMajorsInsights.topByGender
                  ?.length && (
                  <div className="flex items-center justify-center h-[200px] text-white/40">
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
