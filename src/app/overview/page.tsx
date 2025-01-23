"use client";

import Image from "next/image";
import nloSymbol from "../../../public/logo/nlo_logo_symbol.png";
import mockData from "./final_data_version4.json";
import arabicData from './major_insights_arabic.json';
import { useEffect, useState } from "react";
import SmallCircles from "@/app/overview/component/Small";
import { PiMoneyFill } from "react-icons/pi";
import { PiStudentFill } from "react-icons/pi";
import { PiGraduationCapFill } from "react-icons/pi";
import { FaUniversity } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa";
import { BiFemale } from "react-icons/bi";
import { BiMale } from "react-icons/bi";
import { PiCertificate } from "react-icons/pi";

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

import { useLanguage } from '@/app/context/LanguageContext';
import { getTranslation } from '@/app/utils/translations';

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
  const data = language === 'ar' ? arabicData : mockData;
  const { totalMetrics, overall } = data.majorsInsights;
  const [animate, setAnimate] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);

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
      "education": "التعليم",
      "communications and information technology": "تقنية الاتصالات والمعلومات",
      "business, administration and law": "الأعمال والإدارة والقانون",
      "arts and humanities": "الفنون والعلوم الإنسانية",
      "health and welfare": "الصحة والرفاه",
      "natural sciences, mathematics and statistics": "العلوم الطبيعية والرياضيات والإحصاء",
      "engineering, manufacturing and construction": "الهندسة والتصنيع والبناء",
      "agriculture, forestry, fisheries and veterinary": "الزراعة والحراجة ومصائد الأسماك والبيطرة",
      "social sciences, journalism, information": "العلوم الاجتماعية والصحافة والإعلام",
      "generic programs and qualifications": "البرامج العامة والمؤهلات",
      "services": "الخدمات"
    };

    const searchMajor = language === 'ar' 
      ? majorNameMap[selectedMajor.toLowerCase()] || selectedMajor 
      : selectedMajor;

    const majorData = overall.basicMetrics.find(
      (major) => {
        const majorName = language === 'ar' 
          ? major.generalMajor 
          : Object.entries(majorNameMap).find(([eng, ar]) => ar === major.generalMajor)?.[0] || major.generalMajor;
        return majorName.toLowerCase() === searchMajor.toLowerCase();
      }
    );

    const majorIcons = {
      education: FaGraduationCap,
      "communications and information technology": FaLaptopCode,
      "business, administration and law": FaBalanceScale,
      "arts and humanities": FaPaintBrush,
      "health and welfare": FaHeartbeat,
      "natural sciences, mathematics and statistics": FaFlask,
      "engineering, manufacturing and construction": FaCogs,
      "agriculture, forestry, fisheries and veterinary": FaSeedling,
      "social sciences, journalism, information": FaBook,
      "generic programs and qualifications": FaUserGraduate,
      services: FaCog,
    };

    const selectedIcon =
      majorIcons[selectedMajor.toLowerCase()] || FaGraduationCap;

    return majorData
      ? {
          title: language === 'ar' ? majorData.generalMajor : selectedMajor,
          icon: selectedIcon,
          graduates: majorData.graduates,
          employmentRate: majorData.employmentRate,
          averageSalary: majorData.averageSalary,
          timeToEmployment: majorData.timeToEmployment,
        }
      : {
          title: getTranslation("Education", language),
          icon: FaGraduationCap,
          graduates: totalMetrics.graduates,
          employmentRate: totalMetrics.employmentRate,
          averageSalary: totalMetrics.averageSalary,
          timeToEmployment: totalMetrics.timeToEmployment,
        };
  };

  const currentData = getSelectedMajorData();

  const metrics = [
    {
      icon: <PiGraduationCapFill className="text-4xl text-violet-600" />,
      value: data.majorsInsights.totalMetrics.graduates.totalGraduates.toLocaleString(),
      label: getTranslation("Total Graduates", language),
    },
    {
      icon: <PiMoneyFill className="text-4xl text-violet-600" />,
      value: data.majorsInsights.totalMetrics.averageSalary.toLocaleString(),
      label: getTranslation("Average Salary", language),
    },
    {
      icon: <FaBusinessTime className="text-4xl text-violet-600" />,
      value: `${data.majorsInsights.totalMetrics.timeToEmployment.overall.days} ${getTranslation("days", language)}`,
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
   

    <div className="relative flex-1 p-2 sm:p-4 lg:p-6 bg-transparent backdrop-blur-sm flex flex-col lg:flex-row items-start justify-between relative min-h-screen overflow-hidden">
    <p className="absolute -top-1 px-2 text-white text-left mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base  font-['Roboto_regular'] w-[67%] ">
    {getTranslation("The dashboard provides insights from university graduates, helping educational institutes and decision-makers analyze the growth and impact of various majors", language)}
    </p>
      {/* Add a blur overlay at the bottom */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#24285E]/80 to-transparent backdrop-blur-sm"></div> */}

      {/* Left Side Education Stats */}
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[270px] flex flex-col gap-1 p-2 sm:p-4 lg:p-0 mb-4 lg:mb-0 lg:mt-16">
        {/* <p className="text-white text-center mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base  font-['Roboto_regular']">
          {getTranslation("The dashboard provides insights from university graduates, helping educational institutes and decision-makers analyze the growth and impact of various majors", language)}
        </p> */}

        {/* Education Title */}
        <div className="flex flex-col items-start gap-0 w-full sm:w-[300px] h-[45px] sm:h-[50px] justify-start mx-auto mb-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <currentData.icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#2cd7c4] flex-shrink-0 transform transition-transform duration-300 hover:scale-110 " />
                <span className="text-white text-lg sm:text-xl font-['Roboto_regular'] leading-tight tracking-wide text-left flex-1">
                  {currentData.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col gap-2 p-2 sm:p-4 bg-[#1C3862]/50 rounded-[15px]">
          {/* Total Graduates Card */}
          <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
            <div className="flex items-center gap-4 mb-1">
              <div className="w-12">
                <Image
                  src="/icons/graduateicon.svg"
                  alt="Employment"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff] ">
                  {getTranslation("Total Graduates", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] font-bold">
                  {currentData.graduates.totalGraduates.toLocaleString()}
                </div>

                <div className="flex gap-4 mt-0">
                  <div className="bg-[#1d3862]/80 rounded-[7px] flex items-center gap-0 px-1 py-0.5">
                    <span className="flex items-center gap-0 text-[#ffff] text-sm font-['Roboto_regular']">
                      <BiMale style={{ color: "#2CCAD3" }} size={18} />
                      {/* <span className="text-[#ffff] flex items-center gap-1 text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-[#2a6dee]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="7" r="4" strokeWidth="2" />
                      <path strokeWidth="2" d="M15 14h-6l-2 8h10z" />
                      <line x1="12" y1="14" x2="12" y2="22" strokeWidth="2" />
                    </svg> */}
                      <span>{currentData.graduates.male.percentage}%</span>
                    </span>
                  </div>
                  <div className="bg-[#1d3862]/80 rounded-[7px] flex items-center gap-0 px-1 py-0.5">
                    <span className="flex items-center gap-0 text-[#ffff] text-sm font-['Roboto_regular']">
                      <BiFemale style={{ color: "#2CCAD3" }} size={18} />
                      {/* <span className="text-[#ffff] flex items-center gap-1 text-lg">
                    <svg female-pink-#fe1684
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-[#ff69b4]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="7" r="4" strokeWidth="2" />
                      <path strokeWidth="2" d="M8 14h8l2 4h-12z" />
                      <path strokeWidth="2" d="M15 18l-3 4l-3-4" />
                    </svg> */}
                      <span>{currentData.graduates.female.percentage}%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Rate Card */}
          <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12">
                <Image
                  src="/icons/employmentrateicon.svg"
                  alt="Employment"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff] ">
                  {getTranslation("Employment Rate", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] font-bold">
                  {currentData.employmentRate}%
                </div>
              </div>
            </div>
          </div>

          {/* Average Salary Card */}
          <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12">
                <PiMoneyFill
                  style={{ color: "#2CCAD3", width: 32, height: 32 }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff] ">
                  {getTranslation("Average Salary", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] font-bold">
                  {currentData.averageSalary.toLocaleString()}{" "}
                  <span
                    style={{
                      fontFamily: "Roboto regular",
                      fontSize: "1.4rem",
                      fontWeight: 300,
                    }}
                  >
                    {getTranslation("SAR", language)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time to Employment Card */}
          <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12">
                <FaBusinessTime
                  style={{ color: "#2CCAD3", width: 32, height: 32 }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff] ">
                  {getTranslation("Time to Employment", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] font-bold">
                  {currentData.timeToEmployment.overall.days}{" "}
                  <span
                    style={{
                      fontFamily: "Roboto regular",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                    }}
                  >
                    {getTranslation("days", language)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Seekers Card */}
          <div className="bg-[#15234A]/50 p-2 rounded-[15px] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12">
                <PiStudentFill
                  style={{ color: "#2CCAD3", width: 32, height: 32 }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff] ">
                  {getTranslation("Job Seekers", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] font-bold">
                  125,847
                </div>

                <div className="flex gap-2 mt-1">
                  <div className="bg-[#1d3862]/80 rounded-[7px] flex items-center gap-1 px-2 py-0.5">
                    {/* <span className="text-[#2cd7c4] text-sm">Active</span>
                    <span className="text-white/70 text-sm">78%</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main container with transition */}
      <div className="w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[700px] flex items-center justify-center">
        {/* Main circle container */}
        <div className="relative w-[150px] sm:w-[180px] lg:w-[230px] h-[150px] sm:h-[180px] lg:h-[230px] rounded-full shadow-2xl shadow-[#2e6bb2]/500 bg-gradient-to-br from-[#24285E] from-20% via-[#24285E] via-20% to-[#244975]">
          {/* Outer glowing border */}
          <div className="absolute -inset-1 rounded-full border-[3px] border-[#ffff] outer-circle-glow"></div>

          {/* Small Circles */}
          <SmallCircles animate={animate} onSelect={setSelectedMajor} />

          {/* Centered Logo */}
          <div
            className="absolute inset-0 m-auto w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[180px] lg:h-[180px] rounded-full flex flex-col items-center justify-center z-20 logo-container"
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
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[500px] flex flex-col gap-2 p-2 sm:p-4 lg:p-0 lg:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* First row cards */}
          <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#ffff] bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
            <div className="flex items-center gap-8 w-full">
              <div>
                <PiGraduationCapFill
                  style={{ color: "#2CCAD3", width: 38, height: 38 }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff] whitespace-nowrap">
                  {getTranslation("Total Student Enrollment", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] mt-1 font-bold">
                  {totalMetrics.totalStudentsEnrolled.toLocaleString()}{" "}
                  <span
                    style={{
                      fontFamily: "Roboto regular",
                      fontSize: "1.2rem",
                      fontWeight: 200,
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-0 sm:p-0 rounded-[20px] shadow-lg border border-[#ffff] bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px]">
            <div className="grid grid-cols-[auto_1fr] gap-4">
              <div className="mt-6 ml-2">
                <FaUniversity
                  style={{ color: "#2CCAD3", width: 38, height: 38 }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff]">
                  {getTranslation("Number of Universities and Educational Institutions", language)}
                </span>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex h-5 items-center bg-[#15234A]/50 rounded-sm relative w-[175px]">
                    <span className="text-white text-sm pl-2">
                      {getTranslation("Public Universities", language)}
                    </span>
                    <div className="absolute left-0 h-full w-[2px] bg-[#2CCAD3]/100"></div>
                    <span className="text-white text-2xl font-['Roboto_regular'] ml-auto pr-2 font-bold">
                      27
                    </span>
                  </div>
                  <div className="flex h-5 items-center bg-[#15234A]/50 rounded-sm relative w-[175px]">
                    <span className="text-white text-sm pl-2">
                      {getTranslation("Private Universities", language)}
                    </span>
                    <div className="absolute left-0 h-full w-[2px] bg-[#2CCAD3]/100"></div>
                    <span className="text-white text-2xl font-['Roboto_regular'] ml-auto pr-2 font-bold">
                      24
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#ffff] bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
            <div className="flex items-center gap-8 w-full">
              <div>
                <Image
                  src="/icons/employmentrateicon.svg"
                  alt="Employment"
                  width={38}
                  height={38}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff]">
                  {getTranslation("Employment Rate", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] mt-1 font-bold">
                  {totalMetrics.employmentRate}%
                </div>
              </div>
            </div>
          </div>
          <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#ffff] bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
            <div className="flex items-center gap-8 w-full">
              <div>
                <Image
                  src="/icons/graduateicon.svg"
                  alt="Employment"
                  width={38}
                  height={38}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff]">
                  {getTranslation("Total Graduates", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] font-bold mt-1">
                  {totalMetrics.graduates.totalGraduates.toLocaleString()}
                  <div className="flex gap-2 mt-1 text-sm font-['Roboto_Regular']">
                    <div className="bg-[#15234A]/50 rounded-[7px] flex items-center gap-0 px-1 py-0.5">
                      <span className="flex items-center gap-1">
                        <BiMale style={{ color: "#2CCAD3" }} size={20} />
                        {totalMetrics.graduates.male.percentage}%
                      </span>
                    </div>
                    <div className="bg-[#15234A]/50 rounded-[7px] flex items-center gap-0 px-1 py-0.5">
                      <span className="flex items-center gap-1">
                        <BiFemale style={{ color: "#2CCAD3 " }} size={20} />
                        {totalMetrics.graduates.female.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second row - Money and Business Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#ffff] bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
            <div className="flex items-center gap-8 w-full">
              <div>
                <PiMoneyFill
                  style={{ color: "#2CCAD3", width: 38, height: 38 }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff]">
                  {getTranslation("Average Salary", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] mt-1 font-bold">
                  {totalMetrics.averageSalary.toLocaleString()}{" "}
                  <span
                    style={{
                      fontFamily: "Roboto regular",
                      fontSize: "1.4rem",
                      fontWeight: 300,
                    }}
                  >
                    {getTranslation("SAR", language)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#ffff] bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90 w-full h-[100px] sm:w-[245px] flex items-center">
            <div className="flex items-center gap-8 w-full">
              <div>
                <FaBusinessTime
                  style={{ color: "#2CCAD3", width: 38, height: 38 }}
                />
              </div>
              <div className="flex-1">
                <span className="text-xs sm:text-sm font-['Roboto_regular'] text-[#ffff]">
                  {getTranslation("Time to Employment", language)}
                </span>
                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-['Roboto_regular'] mt-1 font-bold">
                  {totalMetrics.timeToEmployment.overall.days}{" "}
                  <span
                    style={{
                      fontFamily: "Roboto regular",
                      fontSize: "1.2rem",
                      fontWeight: 200,
                    }}
                  >
                    {getTranslation("days", language)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Degree Overview Card */}
        <div className="w-full sm:w-[500px] h-[300px] p-2 sm:p-3 rounded-[20px] shadow-lg border border-[#ffff] bg-gradient-to-r from-[#24285E]/20 via-[#24285E]/10 to-[#244975]/90">
          <div className="flex flex-col gap-2">
            {/* Title Section */}
            <div className="flex items-center gap-8">
              <div>
                <PiCertificate
                  style={{ color: "#2CCAD3", width: 38, height: 38 }}
                />
              </div>
              {/* <div className="certificate-icon"></div> */}
              <div className="flex gap-1">
                <span className="text-sm sm:text-base font-['Roboto_regular'] text-[#ffff]">
                  {getTranslation("Education", language)}
                </span>
                <span className="text-sm sm:text-base font-['Roboto_regular'] text-[#ffff]">
                  {getTranslation("Degree", language)}
                </span>
                <span className="text-sm sm:text-base font-['Roboto_regular'] text-[#ffff]">
                  {getTranslation("Overview", language)}
                </span>
              </div>
            </div>

            {/* Bar Chart Section */}
             <div className="flex flex-col px-4 h-60 bg-gradient-to-br from-[#15234A]/50 via-[#15234A]/50 to-[#15234A]/50 border rounded-[20px] border-[#2E3153]/10">
              <div className="flex h-full items-end justify-between px-0 gap-2 sm:gap-8 mb-1">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 sm:w-8 flex items-end relative">
                  <div className="absolute -top-[115%] -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          389835
                        </span>
                      </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60  rounded-t-2xl"
                      style={{
                        height: "195%",
                      }}
                    >
                      {/* <div className="absolute bottom-5 -left-2">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          389835
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 sm:w-8 flex items-end relative">
                  <div className="absolute -top-[45%] -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          25428
                        </span>
                      </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60  rounded-t-2xl"
                      style={{
                        height: "125%",
                      }}
                    >
                      {/* <div className="absolute bottom-5 -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          25428
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 sm:w-8 flex items-end relative">
                  <div className="absolute -top-[80%] -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          39085
                        </span>
                      </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60  rounded-t-2xl"
                      style={{
                        height: "160%",
                      }}
                    >
                      {/* <div className="absolute bottom-5 -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          39085
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 sm:w-8 flex items-end relative">
                  <div className="absolute -top-[10%] -left-1">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          8001
                        </span>
                      </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60  rounded-t-2xl"
                      style={{
                        height: "90%",
                      }}
                    >
                      {/* <div className="absolute bottom-5 -left-1">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          8001
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 sm:w-8 flex items-end relative">
                  <div className="absolute -top-[25%] -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          11043
                        </span>
                      </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60  rounded-t-2xl"
                      style={{
                        height: "105%",
                      }}
                    >
                      {/* <div className="absolute bottom-5 -left-1.5">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          11043
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 sm:w-8 flex items-end relative">
                  <div className="absolute top-[24%] left-0">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          590
                        </span>
                      </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60  rounded-t-2xl"
                      style={{
                        height: "55%",
                      }}
                    >
                      {/* <div className="absolute bottom-5 left-0">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          590
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-24 w-6 sm:w-8 flex items-end relative">
                  <div className="absolute -top-[1%] -left-1">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          2916
                        </span>
                      </div>
                    <div
                      className="w-full bg-gradient-to-t from-[#2CD7C4] via-[#2CD7C4]/60 to-[#2CD7C4]/60  rounded-t-2xl"
                      style={{
                        height: "80%",
                      }}
                    >
                      {/* <div className="absolute bottom-5 -left-1">
                        <span className="text-white text-[12px] sm:text-[14px] font-bold px-0.5 py-0.5 whitespace-nowrap">
                          2916
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-x-6 px-0 text-[9px] sm:text-[11px]">
                <div className="text-white text-center w-6 sm:w-10">
                  {getTranslation("Bachelor's", language)}
                </div>
                <div className="text-white text-center w-6 sm:w-10">
                  {getTranslation("Master's", language)}
                </div>
                <div className="text-white text-center w-6 sm:w-12">
                  {getTranslation("Associate Diploma", language)}
                </div>
                <div className="text-white text-center w-6 sm:w-12">
                  {getTranslation("Intermediate Diploma", language)}
                </div>
                <div className="text-white text-center w-6 sm:w-10">
                  {getTranslation("Higher Diploma", language)}
                </div>
                <div className="text-white text-center w-6 sm:w-12">
                  {getTranslation("Fellowship", language)}
                </div>
                <div className="text-white text-center w-6 sm:w-0">
                  {getTranslation("PhD", language)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Note */}
        <div className="left-0 text-right text-white text-[10px] sm:text-xs md:text-sm font-['Roboto_regular'] mt-2">
          <p className="">{getTranslation("Data Source: National Labor Observatory", language)}</p>
          <p className="">{getTranslation("Last Updated: January 2025", language)}</p>
        </div>
      </div>
    </div>
    </>
  );
}
