"use client";

import Image from "next/image";
import nloSymbol from "../../../public/logo/nlo_logo_symbol.png";
import mockData from "./major_insights_english.json";
import arabicData from "./major_insights_arabic 3.json";
import { useEffect, useState } from "react";
import SmallCircles from "@/app/overview/component/Small";
import {
  PiMoneyFill,
  PiTrophy,
  PiChartBar,
  PiStudentFill,
} from "react-icons/pi";
import { PiGraduationCapFill } from "react-icons/pi";
import { PiCertificate } from "react-icons/pi";
import { FaUniversity } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa";
import { BiFemale } from "react-icons/bi";
import { BiMale } from "react-icons/bi";

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
  FaNewspaper,
} from "react-icons/fa";

import { useLanguage } from "@/app/context/LanguageContext";
import { getTranslation } from "@/app/utils/translations";
import { cn } from "../utils/cn";

const CircularText = ({
  text,
  angle,
  radius,
  startAngle = 0,
  fontSize = "17px",
  letterSpacing = "normal",
  flip = false,
}) => {
  const characters = text.split("");
  const deltaAngle = angle / (characters.length - 1);

  return (
    <>
      {characters.map((char, i) => {
        const charAngle = (startAngle + i * deltaAngle) * (Math.PI / 180);
        const x = radius * Math.cos(charAngle);
        const y = radius * Math.sin(charAngle);
        const rotation = flip
          ? startAngle + i * deltaAngle - 90
          : startAngle + i * deltaAngle + 90;

        return (
          <div
            key={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-[#21265E] font-bold"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              fontSize,
              letterSpacing,
            }}
          >
            {char}
          </div>
        );
      })}
    </>
  );
};

export default function HomePage() {
  const { language } = useLanguage();
  const data = language === "ar" ? arabicData : mockData;
  const { totalMetrics, overall } = data.majorsInsights;
  const [animate, setAnimate] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);

  const formatNumber = (number: number | undefined | null) => {
    if (number === undefined || number === null) return "0";
    // Always use en-US locale to keep numbers in Western digits
    return Number(number).toLocaleString("en-US");
  };

  useEffect(() => {
    setAnimate(true);
  }, []);

  const getSelectedMajorData = () => {
    if (!selectedMajor) {
      return {
        title: getTranslation("Education", language),
        icon: FaGraduationCap,
        graduates: totalMetrics.graduates,
        employmentRate: totalMetrics.employmentRate,
        averageSalary: totalMetrics.averageSalary,
        timeToEmployment: totalMetrics.timeToEmployment,
      };
    }

    // Map English major names to Arabic major names
    const majorNameMap = {
      education: "التعليم",
      "communications and information technology": "تقنية الاتصالات والمعلومات",
      "business, administration and law": "الأعمال والإدارة والقانون",
      "arts and humanities": "الفنون والعلوم الإنسانية",
      "health and welfare": "الصحة والرفاه",
      "natural sciences, mathematics and statistics":
        "العلوم الطبيعية والرياضيات والإحصاء",
      "engineering, manufacturing and construction": "الهندسة والتصنيع والبناء",
      "agriculture, forestry, fisheries and veterinary":
        "الزراعة والحراجة ومصائد الأسماك والبيطرة",
      "social sciences, journalism, information":
        "العلوم الاجتماعية والصحافة والإعلام",
      "generic programs and qualifications": "البرامج العامة والمؤهلات",
      services: "الخدمات",
    };

    const searchMajor =
      language === "ar"
        ? majorNameMap[selectedMajor.toLowerCase()] || selectedMajor
        : selectedMajor;

    const majorData = overall.basicMetrics.find((major) => {
      const majorName =
        language === "ar"
          ? major.generalMajor
          : Object.entries(majorNameMap).find(
              ([eng, ar]) => ar === major.generalMajor
            )?.[0] || major.generalMajor;
      return majorName.toLowerCase().includes(searchMajor.toLowerCase());
    });

    const majorIcons = {
      education: FaGraduationCap,
      "communications and information technology": FaLaptopCode,
      "business, administration and law": FaBalanceScale,
      "arts and humanities": FaPaintBrush,
      "health and welfare": FaHeartbeat,
      "natural sciences, mathematics and statistics": FaFlask,
      "engineering, manufacturing and construction": FaCogs,
      "agriculture, forestry, fisheries and veterinary": FaSeedling,
      "social sciences, journalism, information": FaNewspaper,
      "generic programs and qualifications": FaUserGraduate,
      services: FaCog,
    };

    const selectedIcon =
      majorIcons[selectedMajor.toLowerCase()] || FaGraduationCap;

    return majorData
      ? {
          title: language === "ar" ? majorData.generalMajor : selectedMajor,
          icon: selectedIcon,
          graduates: majorData.graduates,
          employmentRate: majorData.employmentRate,
          averageSalary: majorData.averageSalary,
          timeToEmployment: majorData.timeToEmployment,
          totalJobSeekers: majorData.totalJobSeekers,
        }
      : {
          title: selectedMajor || getTranslation("Education", language),
          icon: selectedIcon || FaGraduationCap,
          graduates: totalMetrics.graduates,
          employmentRate: totalMetrics.employmentRate,
          averageSalary: totalMetrics.averageSalary,
          timeToEmployment: totalMetrics.timeToEmployment,
          totalJobSeekers: totalMetrics.totalJobSeekers,
        };
  };

  const currentData = getSelectedMajorData();

  const metrics = [
    {
      icon: <PiGraduationCapFill className="text-4xl text-violet-600" />,
      value:
        data.majorsInsights.totalMetrics.graduates.totalGraduates.toLocaleString(),
      label: getTranslation("Total Graduates", language),
    },
    {
      icon: <PiMoneyFill className="text-4xl text-violet-600" />,
      value: data.majorsInsights.totalMetrics.averageSalary.toLocaleString(),
      label: getTranslation("Average Salary", language),
    },
    {
      icon: <FaBusinessTime className="text-4xl text-violet-600" />,
      value: `${
        data.majorsInsights.totalMetrics.timeToEmployment.overall.days
      } ${getTranslation("days", language)}`,
      label: getTranslation("Time to Employment", language),
    },
    {
      icon: <FaUniversity className="text-4xl text-violet-600" />,
      value: `${data.majorsInsights.totalMetrics.employmentRate}%`,
      label: getTranslation("Employment Rate", language),
    },
  ];

  return (
    <>
      <div
        className={`relative flex-1 p-2 sm:p-4 lg:p-6 bg-transparent backdrop-blur-sm flex flex-col lg:flex-row items-start justify-between relative min-h-screen overflow-hidden ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        <h1
          className={`absolute -top-1.5 px-[520px] 2xl:px-0 2xl:text-center text-[#2ab1bb] mb-2 sm:mb-3 text-xs sm:text-sm lg:text-2xl w-full ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {language === "ar"
            ? // For Arabic, split by words to maintain letter connections
              getTranslation("Saudi Arabia Graduates Observation", language)
                .split(" ")
                .reverse()
                .map((word, index, array) => (
                  <span
                    key={index}
                    className="animate-glow-letter"
                    style={{
                      animationDelay:
                        language === "ar"
                          ? `${(array.length - 1 - index) * 0.05}s`
                          : `${index * 0.05}s`,
                      marginLeft: "4px",
                    }}
                  >
                    {word}
                  </span>
                ))
            : // For English, keep the original letter-by-letter animation
              getTranslation("Saudi Arabia Graduates Observation", language)
                .split("")
                .map((char, index, array) => (
                  <span
                    key={index}
                    className="animate-glow-letter"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
        </h1>
        <p
          className={cn(
            "absolute top-6 text-white px-[430px] 2xl:px-0 2xl:text-center mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base  w-full",
            language === "ar" && "px-[550px]"
          )}
        >
          {getTranslation(
            "Data for 2022 Graduates and their Employment through December 2023",
            language
          )}
        </p>
        {/* Add a blur overlay at the bottom */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#24285E]/80 to-transparent backdrop-blur-sm"></div> */}

        {/* Left Side Education Stats */}
        <div className="w-full h-[600px] sm:w-[90%] md:w-[80%] lg:w-[270px] flex flex-col gap-1 p-2 sm:p-4 lg:p-0 mb-4 lg:mb-0 lg:mt-24">
          {/* <p className="text-white text-center mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base  ">
          {getTranslation("The dashboard provides insights from university graduates, helping educational institutes and decision-makers analyze the growth and impact of various majors", language)}
        </p> */}

          {/* Education Title */}
          <div
            className={cn(
              "relative w-full sm:w-[280px] h-[100px] sm:h-[50px] justify-start mx-auto mb-8"
            )}
          >
            <div
              className={`absolute inset-0 flex items-center gap-2 ${
                language === "ar" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <currentData.icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#2cd7c4] flex-shrink-0" />
              <span
                className={`text-white text-lg sm:text-xl leading-tight tracking-wide flex-1 ${
                  language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {currentData.title}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-col gap-2 p-2 sm:p-4 bg-[#1C3862]/50 rounded-[15px] ">
            {/* Total Graduates Card */}
            <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
              <div
                className={`flex items-center gap-4 mb-1 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="w-12">
                  <Image
                    src="/icons/graduateicon.svg"
                    alt="Employment"
                    width={32}
                    height={32}
                  />
                </div>
                <div
                  className={cn(
                    "flex-1 ",
                    language === "ar" && "text-right pr-6"
                  )}
                  style={{ marginRight: -20 }}
                >
                  <span className="text-xs sm:text-sm  text-[#ffff] ">
                    {getTranslation("Total Graduates", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {formatNumber(currentData.graduates.totalGraduates)}
                  </div>

                  <div
                    className={`flex gap-4 mt-0 ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="bg-[#1d3862]/80 rounded-[7px] flex items-center gap-0 px-1 py-0.5 ">
                      <span
                        className={`flex items-center gap-0 text-[#ffff] text-sm ${
                          language === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <BiMale style={{ color: "#2CCAD3" }} size={18} />
                        <span>{currentData.graduates.male.percentage}%</span>
                      </span>
                    </div>
                    <div className="bg-[#1d3862]/80 rounded-[7px] flex items-center gap-0 px-1 py-0.5 ">
                      <span
                        className={`flex items-center gap-0 text-[#ffff] text-sm ${
                          language === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <BiFemale style={{ color: "#fe1684" }} size={18} />
                        <span>{currentData.graduates.female.percentage}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Rate Card */}
            <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
              <div
                className={`flex items-center gap-4 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="w-12">
                  <Image
                    src="/icons/employmentrateicon.svg"
                    alt="Employment"
                    width={32}
                    height={32}
                    // marginLeft={-5}
                  />
                </div>
                <div
                  className={cn(
                    "flex-1",
                    language === "ar" && "text-right pr-1"
                  )}
                >
                  <span className="text-xs sm:text-sm  text-[#ffff] ">
                    {getTranslation("Employment Rate", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl  font-bold">
                    {currentData.employmentRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Average Salary Card */}
            <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
              <div
                className={`flex items-center gap-4 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="w-12">
                  <PiMoneyFill
                    style={{ color: "#2CCAD3", width: 32, height: 32 }}
                  />
                </div>
                <div
                  className={cn(
                    "flex-1",
                    language === "ar" && "text-right pr-1"
                  )}
                >
                  {/* <div className="flex-1"> */}
                  <span className="text-xs sm:text-sm  text-[#ffff] ">
                    {getTranslation("Average Salary", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl  font-bold">
                    <div
                      className={`flex  ${
                        language === "ar" ? "flex-row-reverse " : "flex-row"
                      }`}
                    >
                      <span> {formatNumber(currentData.averageSalary)}</span>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 400,
                          marginRight: language === "ar" ? "0.5rem" : "0",
                          marginLeft: language === "ar" ? "0" : "0.5rem",
                        }}
                      >
                        {getTranslation("SAR", language)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time to Employment Card */}
            <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
              <div
                className={`flex items-center gap-4 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="w-12">
                  <FaBusinessTime
                    style={{ color: "#2CCAD3", width: 32, height: 32 }}
                  />
                </div>
                <div
                  className={cn(
                    "flex-1",
                    language === "ar" && "text-right pr-1"
                  )}
                >
                  <span className="text-xs sm:text-sm  text-[#ffff] ">
                    {getTranslation("Time to Employment", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl  font-bold">
                    <div
                      className={`flex  ${
                        language === "ar" ? "flex-row-reverse " : "flex-row"
                      }`}
                    >
                      <span>{currentData.timeToEmployment.overall.days}</span>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 400,
                          marginRight: language === "ar" ? "0.5rem" : "0",
                          marginLeft: language === "ar" ? "0" : "0.5rem",
                        }}
                      >
                        {getTranslation("months", language)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Seekers Card */}
            <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
              <div
                className={`flex items-center gap-4 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="w-12">
                  <PiStudentFill
                    style={{ color: "#2CCAD3", width: 32, height: 32 }}
                  />
                </div>
                <div
                  className={cn(
                    "flex-1",
                    language === "ar" && "text-right pr-1"
                  )}
                >
                  {/* <div className="flex-1"> */}
                  <span className="text-xs sm:text-sm  text-[#ffff] ">
                    {getTranslation("Job Seekers", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {formatNumber(currentData.totalJobSeekers)}
                  </div>

                  {/* <div className={`flex gap-2 mt-1 text-xs ${language === "ar" ? "flex-row-reverse" : ""}`}>
                    <div className="bg-[#15234A]/50 rounded-[7px] flex items-center gap-0 px-1 py-0.5">
                      <span className={`flex items-center gap-0 text-[#ffff] text-sm ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}>
                        <BiMale style={{ color: "#2CCAD3" }} size={20} />
                        {totalMetrics.graduates.male.percentage}%
                      </span>
                    </div>
                    <div className="bg-[#15234A]/50 rounded-[7px] flex items-center gap-0 px-1 py-0.5">
                      <span className={`flex items-center gap-0 text-[#ffff] text-sm ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}>
                        <BiFemale style={{ color: "#fe1672" }} size={20} />
                        {totalMetrics.graduates.female.percentage}%
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main container with transition */}
        <div className="w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[700px] flex items-center justify-center mt-20">
          {/* Main circle container */}
          <div className="relative w-[150px] sm:w-[180px] lg:w-[290px] h-[150px] sm:h-[180px] lg:h-[290px] rounded-full shadow-2xl shadow-[#2e6bb2]/500 bg-gradient-to-br from-[#24285E] from-20% via-[#24285E] via-20% to-[#244975]">
            {/* Outer glowing border */}
            <div className="absolute -inset-1 rounded-full border-[3px] border-[#ffff] outer-circle-glow"></div>

            {/* Small Circles */}
            <SmallCircles animate={animate} onSelect={setSelectedMajor} />

            {/* Centered Logo */}
            <div
              className="absolute inset-0 m-auto w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[235px] lg:h-[235px] rounded-full flex flex-col items-center justify-center z-20 logo-container"
              style={{ marginTop: "29px" }}
            >
              <Image
                src={nloSymbol}
                alt="NLO Logo"
                fill
                className="object-contain brightness-0 invert logo-glow p-2"
                priority
              />
              {/* <p
              className="text-white text-center text-xs mt-[180px] max-w-[120px] leading-tight" */}
              {/* // style={{ marginTop: "150px" }} */}
              {/* >
              A statistical study of university and institute graduates in one
              year
            </p> */}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[500px] flex flex-col gap-2 p-2 sm:p-4 lg:p-0 lg:mt-10">
          <div
            className={`flex items-center justify-center gap-2 mb-4 ${
              language === "ar"
                ? "flex-row-reverse justify-end"
                : "flex-row justify-start"
            }`}
          >
            <PiChartBar style={{ color: "#2CCAD3", width: 38, height: 38 }} />
            <span className="text-[#ffff] text-lg">
              {getTranslation("Total Metrics", language)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* First row cards */}
            {/* <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#2ab1bb]/30 bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
              <div className={`flex items-center gap-8 w-full ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div>
                  <FaUniversity
                    style={{ color: "#2CCAD3", width: 38, height: 38 }}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm text-[#ffff]">
                    {getTranslation(
                      "Number of Universities and Educational Institutions",
                      language
                    )}
                  </span>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className={`flex h-5 items-center bg-[#15234A]/50 rounded-sm relative w-[175px] ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className={`text-white text-sm ${language === 'ar' ? 'pr-2' : 'pl-2'}`}>
                        {getTranslation("Public Universities", language)}
                      </span>
                      <div className={`absolute h-full w-[2px] bg-[#2CCAD3]/100 ${language === 'ar' ? 'right-0' : 'left-0'}`}></div>
                      <span className={`text-white text-2xl font-bold ${
                        language === "ar" ? "mr-auto pl-2" : "ml-auto pr-2"
                      }`}>
                        {formatNumber(29)}
                      </span>
                    </div>
                    <div className={`flex h-5 items-center bg-[#15234A]/50 rounded-sm relative w-[175px] ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className={`text-white text-sm ${language === 'ar' ? 'pr-2' : 'pl-2'}`}>
                        {getTranslation("Private Universities", language)}
                      </span>
                      <div className={`absolute h-full w-[2px] bg-[#2CCAD3]/100 ${language === 'ar' ? 'right-0' : 'left-0'}`}></div>
                      <span className={`text-white text-2xl font-bold ${
                        language === "ar" ? "mr-auto pl-2" : "ml-auto pr-2"
                      }`}>
                        {formatNumber(26)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#2ab1bb]/30 bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
              <div
                className={`flex items-center gap-8 w-full ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div>
                  <Image
                    src="/icons/graduateicon.svg"
                    alt="Employment"
                    width={38}
                    height={38}
                  />
                </div>
                <div
                  className={cn("flex-1 ", language === "ar" && "text-right")}
                >
                  <span className="text-xs sm:text-sm  text-[#ffff]">
                    {getTranslation("Total Graduates", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl ">
                    <span className="font-bold">
                      {formatNumber(totalMetrics.graduates.totalGraduates)}
                    </span>
                    <div
                      className={`flex gap-2 mt-1 text-xs ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="bg-[#15234A]/50 rounded-[7px] flex items-center gap-0 px-1 py-0.5">
                        <span
                          className={`flex items-center gap-0 text-[#ffff] text-sm ${
                            language === "ar" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <BiMale style={{ color: "#2CCAD3" }} size={20} />
                          {totalMetrics.graduates.male.percentage}%
                        </span>
                      </div>
                      <div className="bg-[#15234A]/50 rounded-[7px] flex items-center gap-0 px-1 py-0.5">
                        <span
                          className={`flex items-center gap-0 text-[#ffff] text-sm ${
                            language === "ar" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <BiFemale style={{ color: "#fe1672" }} size={20} />
                          {totalMetrics.graduates.female.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#2ab1bb]/30 bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
              <div
                className={`flex items-center gap-5 w-full ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div>
                  <FaUniversity
                    style={{ color: "#2CCAD3", width: 38, height: 38 }}
                  />
                </div>
                <div
                  className={cn("flex-1", language === "ar" && "text-right")}
                >
                  <span className="text-xs sm:text-sm text-[#ffff]">
                    {getTranslation(
                      "Number of Universities and Educational Institutions",
                      language
                    )}
                  </span>
                  <div className="flex flex-col gap-1 mt-1">
                    <div
                      className={`flex h-5 items-center bg-[#15234A]/50 rounded-sm relative w-[175px] ${
                        language === "ar" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <span
                        className={`text-white text-sm ${
                          language === "ar" ? "pr-2" : "pl-2"
                        }`}
                      >
                        {getTranslation("Public Universities", language)}
                      </span>
                      <div
                        className={`absolute h-full w-[2px] bg-[#2CCAD3]/100 ${
                          language === "ar" ? "right-0" : "left-0"
                        }`}
                      ></div>
                      <span
                        className={`text-white text-2xl font-bold ${
                          language === "ar" ? "ml-4 pr-2" : "ml-auto pr-2"
                        }`}
                      >
                        {formatNumber(29)}
                      </span>
                    </div>
                    <div
                      className={`flex h-5 items-center bg-[#15234A]/50 rounded-sm relative w-[175px] ${
                        language === "ar" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <span
                        className={`text-white text-sm ${
                          language === "ar" ? "pr-2" : "pl-2"
                        }`}
                      >
                        {getTranslation("Private Universities", language)}
                      </span>
                      <div
                        className={`absolute h-full w-[2px] bg-[#2CCAD3]/100 ${
                          language === "ar" ? "right-0" : "left-0"
                        }`}
                      ></div>
                      <span
                        className={`text-white text-2xl font-bold ${
                          language === "ar" ? "ml-6 pr-6" : "ml-auto pr-2"
                        }`}
                      >
                        {formatNumber(26)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#2ab1bb]/30 bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center",
                language === "ar" && "text-right"
              )}
            >
              <div
                className={`flex items-center gap-8 w-full ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div>
                  <Image
                    src="/icons/employmentrateicon.svg"
                    alt="Employment"
                    width={38}
                    height={38}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm  text-[#ffff]">
                    {getTranslation("Employment Rate", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl  font-bold">
                    {totalMetrics.employmentRate}%
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#2ab1bb]/30 bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center",
                language === "ar" && "text-right"
              )}
            >
              <div
                className={`flex items-center gap-8 w-full ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div>
                  <PiMoneyFill
                    style={{ color: "#2CCAD3", width: 38, height: 38 }}
                  />
                </div>
                <div className=" flex-1">
                  <span className="text-xs sm:text-sm  text-[#ffff]">
                    {getTranslation("Average Salary", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl  font-bold">
                    <div
                      className={`flex  ${
                        language === "ar" ? "flex-row-reverse " : "flex-row"
                      }`}
                    >
                      <span>{formatNumber(totalMetrics.averageSalary)}</span>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 400,
                          marginRight: language === "ar" ? "0.5rem" : "0",
                          marginLeft: language === "ar" ? "0" : "0.5rem",
                        }}
                      >
                        {getTranslation("SAR", language)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second row - Money and Business Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#2ab1bb]/30 bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
              <div
                className={`flex items-center gap-8 w-full ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div>
                  <FaBusinessTime
                    style={{ color: "#2CCAD3", width: 38, height: 38 }}
                  />
                </div>
                <div
                  className={cn("flex-1", language === "ar" && "text-right")}
                >
                  <span className="text-xs sm:text-sm  text-[#ffff]">
                    {getTranslation("Time to Employment", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl  mt-1 font-bold">
                    <div
                      className={`flex  ${
                        language === "ar" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <span>{totalMetrics.timeToEmployment.overall.days}</span>
                      <span
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 200,
                          marginRight: language === "ar" ? "0.5rem" : "0",
                          marginLeft: language === "ar" ? "0" : "0.5rem",
                        }}
                      >
                        {getTranslation("months", language)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#2ab1bb]/30 bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
              <div
                className={`flex items-center gap-8 w-full ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div>
                  <PiStudentFill
                    style={{ color: "#2CCAD3", width: 38, height: 38 }}
                  />
                </div>
                <div
                  className={cn("flex-1", language === "ar" && "text-right")}
                >
                  <span className="text-xs sm:text-sm  text-[#ffff]">
                    {getTranslation("Total Job Seekers", language)}
                  </span>
                  <div className="text-white text-2xl sm:text-3xl lg:text-4xl  mt-1 font-bold">
                    {formatNumber(totalMetrics.totalJobSeekers)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Education Degree Overview Card */}
          <div className="w-full sm:w-[500px] h-[300px] p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#2ab1bb]/30 bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90">
            <div className="flex flex-col gap-2">
              {/* Title Section */}
              <div
                className={`flex items-center gap-8 ${
                  language === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div>
                  <PiCertificate
                    style={{ color: "#2CCAD3", width: 38, height: 38 }}
                  />
                </div>
                {/* <div className="certificate-icon"></div> */}
                <div className="flex gap-1">
                  <span className="text-sm sm:text-base  text-[#ffff]">
                    {getTranslation("Education Degree Overview", language)}
                  </span>
                  {/* <span className="text-sm sm:text-base  text-[#ffff]">
                    {getTranslation("Degree", language)}
                  </span>
                  <span className="text-sm sm:text-base  text-[#ffff]">
                    {getTranslation("Overview", language)}
                  </span> */}
                </div>
              </div>

              {/* Bar Chart Section */}
              <div className="flex flex-col px-4 h-60 bg-gradient-to-br from-[#15234A]/50 via-[#15234A]/50 to-[#15234A]/50 border rounded-[20px] border-[#2E3153]/10">
                <div
                  className={`flex h-full items-end justify-between px-0 gap-2 sm:gap-8 mb-1 ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Bachelor's - 195571 */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-6 sm:w-8 flex items-end relative">
                      <div className="absolute -top-[115%] -left-1">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          {formatNumber(195571)}
                        </span>
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60 rounded-t-2xl"
                        style={{
                          height: "190%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Associate Diploma - 20026 */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-6 sm:w-8 flex items-end relative">
                      <div className="absolute -top-[80%] -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          {formatNumber(20026)}
                        </span>
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60 rounded-t-2xl"
                        style={{
                          height: "155%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Master's - 12164 */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-6 sm:w-8 flex items-end relative">
                      <div className="absolute -top-[45%] -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          {formatNumber(12164)}
                        </span>
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60 rounded-t-2xl"
                        style={{
                          height: "120%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Higher Diploma - 6563 */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-6 sm:w-8 flex items-end relative">
                      <div className="absolute -top-[25%] -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          {formatNumber(6563)}
                        </span>
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60 rounded-t-2xl"
                        style={{
                          height: "100%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Intermediate Diploma - 4292 */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-6 sm:w-8 flex items-end relative">
                      <div className="absolute -top-[10%] -left-1">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          {formatNumber(4292)}
                        </span>
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60 rounded-t-2xl"
                        style={{
                          height: "85%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* PhD - 1277 */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-6 sm:w-8 flex items-end relative">
                      <div className="absolute -top-[1%] -left-1">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          {formatNumber(1277)}
                        </span>
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60 rounded-t-2xl"
                        style={{
                          height: "75%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Fellowship - 267 */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-6 sm:w-8 flex items-end relative">
                      <div className="absolute top-[24%] left-0">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          {formatNumber(267)}
                        </span>
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60 rounded-t-2xl"
                        style={{
                          height: "50%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex gap-x-6 px-0 text-[9px] sm:text-[11px] ${
                    language === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="text-white text-center w-6 sm:w-10">
                    {getTranslation("Bachelor's", language)}
                  </div>
                  <div className="text-white text-center w-6 sm:w-12">
                    {getTranslation("Intermediate Diploma", language)}
                  </div>
                  <div className="text-white text-center w-6 sm:w-10">
                    {getTranslation("Master's", language)}
                  </div>
                  <div className="text-white text-center w-6 sm:w-10">
                    {getTranslation("Higher Diploma", language)}
                  </div>
                  <div className="text-white text-center w-6 sm:w-12">
                    {getTranslation("Associate Diploma", language)}
                  </div>
                  <div className="text-white text-center w-6 sm:w-10">
                    {getTranslation("PhD", language)}
                  </div>
                  <div className="text-white text-center w-6 sm:w-10">
                    {getTranslation("Fellowship", language)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Source Note */}
          <div
            className={`text-white text-[10px] sm:text-xs md:text-sm mt-2 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {/* <p className="mb-1">
              {getTranslation(
                "Data for 2022 Graduates and their Employment through December 2023",
                language
              )}
            </p> */}
            <p className="mb-1">
              <b>{getTranslation("Graduate data sources", language)}</b>
              <span className="text-[8px] sm:text-[10px] md:text-[12px]">
                {": "}
                {getTranslation(
                  "Universities and educational institutions",
                  language
                )}
              </span>
            </p>
            <p className="mb-1">
              <b>{getTranslation("Employment data sources", language)}</b>
              <span className="text-[8px] sm:text-[10px] md:text-[12px]">
                {": "}
                {getTranslation(
                  "Ministry of Human Resources and Social Development, General Organization for Social Insurance",
                  language
                )}
              </span>
            </p>
            <p className="mb-1">
              <b>{getTranslation("Data sources for job seekers", language)}</b>
              <span className="text-[8px] sm:text-[10px] md:text-[12px]">
                {": "}
                {getTranslation(
                  "Jadarat Platform - Human Resources Development Fund (HRDF)",
                  language
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
