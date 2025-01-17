"use client";

import mockDataMajor from "./final_data_15-01 (version2).json";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function SecondPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMajor, setSelectedMajor] = useState(
    "Business, administration and law"
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
    "Telecommunications and information technology": "#FF3366", // Rose
    law: "#FFD700", // Gold
    health: "#4B0082", // Indigo
    "Generic programs and qualifications include health and wellbeing":
      "#9932CC", // Dark orchid

    // Employment timing nodes
    "Before Graduation": "#FFB74D", // Light orange
    "Within First Year": "#64B5F6", // Light blue
    "After First Year": "#81C784", // Light green
  };

  // Helper function to get color for narrow major
  const getNarrowMajorColor = (narrowMajor: string) => {
    // Return the specific color for the narrow major
    return colorMapping[narrowMajor] || "#6366f1"; // Default color if not found
  };

  useEffect(() => {
    const majorParam = searchParams.get("major");
    if (majorParam) {
      setSelectedMajor(decodeURIComponent(majorParam));
    }
  }, [searchParams]);

  // Find the selected major's data
  const majorData =
    mockDataMajor.majorsInsights.byGeneralMajor.generalMajors.find(
      (major) =>
        major.generalMajor.toLowerCase() === selectedMajor.toLowerCase()
    );

  const overviewStats = majorData?.overall.totalMetrics;
  const topOccupations =
    majorData?.overall.topOccupationsInsights.highestPaying || [];
  const narrowMajors =
    majorData?.overall.topNarrowMajorsInsights.topByEmploymentTiming || [];

  return (
    <div className="min-h-screen bg-transparent backdrop-blur-sm py-8 px-2">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 py-8 max-w-full">
        {/* Major Title */}
        <div className="mb-5">
          <h1 className="text-white font-['Roboto_Regular'] text-2xl text-center">
            {selectedMajor}
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
                  alt="Employment"
                  width={52}
                  height={42}
                />
              </div>
              <div>
                <p className="text-sm font-['Roboto_Regular'] text-white">
                  Total Graduates
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
                  style={{ color: "#2CCAD3", width: 42, height: 42 }}
                />
              </div>
              <div>
                <p className="text-sm font-['Roboto_Regular'] text-white">
                  Average Salary
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.averageSalary.toLocaleString()}
                  <span className="font-normal text-lg">SAR</span>
                </p>
              </div>
            </div>
          </div>

          {/* Time to Employment */}
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
                  style={{ color: "#2CCAD3", width: 42, height: 42 }}
                />
              </div>
              <div>
                <p className="text-sm font-['Roboto_Regular'] text-white">
                  Time to Employment
                </p>
                <p className="text-4xl font-bold text-white">
                  {overviewStats?.timeToEmployment.overall.days}
                  <span className="font-normal text-lg">days</span>
                </p>
              </div>
            </div>
          </div>

          {/* Employment Rate */}
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
                  width={42}
                  height={42}
                />
              </div>
              <div>
                <p className="text-sm font-['Roboto_Regular'] text-white">
                  Employment Rate
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
                    <span className="text-sm font-['Roboto_Regular'] text-white ml-1">
                      before gudurate
                    </span>
                    <span className="text-lg font-['Roboto_Regular'] font-bold text-white">
                      {
                        majorData?.overall.totalMetrics.timeToEmployment
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
                    <span className="text-sm font-['Roboto_Regular'] text-white ml-1">
                      within first year
                    </span>
                    <span className="text-lg font-['Roboto_Regular'] font-bold text-white">
                      {
                        majorData?.overall.totalMetrics.timeToEmployment
                          .withinFirstYear.percentage
                      }
                      %
                    </span>
                  </div>

                  {/* After First Year */}
                  <div
                    className=" p-0.5 flex justify-between items-center"
                    style={{
                      background:
                        "linear-gradient(90deg, #176481 0%, #1E1F5E 100%)",
                    }}
                  >
                    <span className="text-sm font-['Roboto_Regular'] text-white ml-1">
                      After first year
                    </span>
                    <span className="text-lg font-['Roboto_Regular'] font-bold text-white">
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
        style={{ padding: "0em 0.2em 0em 1.4em", marginTop: "-0.5em" }}
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
              <span className="text-white">Top Popular Occupations</span>
            </h2>
            <div className="h-[254px] flex flex-col justify-end relative">
              <div className="flex justify-between items-end h-[200px] px-4">
                {majorData?.overall?.topOccupationsInsights?.mostPopular?.map(
                  (occupation, index) => {
                    // Fixed percentage scale for each bar
                    const percentages = [100, 75, 50, 35, 25];
                    const height = percentages[index] || 12;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center group w-[60px]"
                      >
                        {/* Value on top of bar */}
                        <div className="text-sm font-['Roboto_Regular'] text-white mb-1">
                          {occupation.totalGraduates.toLocaleString()}
                        </div>
                        <div
                          className="w-[30px] relative"
                          style={{ height: `${height * 2}px` }}
                        >
                          <div
                            className="w-full absolute bottom-0 border border-white group-hover:opacity-90 transition-opacity rounded-t-full"
                            style={{
                              height: "100%",
                              background:
                                "linear-gradient(180deg, #1A1B4B 0%, #377eab 100%)",
                            }}
                          />
                        </div>
                        {/* horizontal line */}
                        <div className="absolute left-[28px] h-[2px] w-[85%] bg-gray-100 top-52 transform -translate-y-1/6" />

                        {/* {text} */}
                        <div className="mt-4 text-center px-1 min-h-[27px] left-5">
                          <span className="text-[10px] font-['Roboto_Regular'] text-white block break-words capitalize -rotate-45 transform origin-top-left translate-y-10 -translate-x-1 w-20">
                            {occupation.occupation.split(" ").join("\n")}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              {!majorData?.overall?.topOccupationsInsights?.mostPopular
                ?.length && (
                <div className="flex items-center justify-center h-[200px] text-white">
                  No data available
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* Degrees - Wider column */}
        <Col xs={24} lg={11}>
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
              <span className="text-white">Degree</span>
            </h2>
            <div className="space-y-4 relative pr-28">
              {/* Vertical line */}
              <div className="absolute left-[160px] top-0 bottom-0 w-[1.5px] bg-gray-100 " />
              {/* for showing all the data */}
              {/* {majorData?.overall.totalMetrics.educationLevelInsights.map(
                (level, index) => { */}

              {majorData?.overall.totalMetrics.educationLevelInsights
                .slice(0, 5) // Only take the first 5 items
                .map((level, index) => {
                  // Fixed percentage scale for each bar
                  const percentages = [98, 75, 45, 30, 15];
                  const percentage = percentages[index] || 12;
                  const isSmallBar = percentage < 30;

                  return (
                    <div key={index} className="flex items-center group">
                      <div className="w-[160px] relative">
                        <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                        <span className="relative z-10 text-sm font-['Roboto_Regular'] text-white px-3 py-1 block truncate">
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
                              "linear-gradient(90deg, #377eab 0%, #1A1B4B 100%)",
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
                              {level.employmentRate}% employed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {!majorData?.overall.totalMetrics.educationLevelInsights
                ?.length && (
                <div className="flex items-center justify-center h-[200px] text-white">
                  No data available
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* Top Majors by Gender */}
        <Col xs={24} lg={6}>
          <div className="bg-[#1d1f4f]/70 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
            <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
              <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                <div className="flex gap-1">
                  <BiMale style={{ color: "#2CCAD3", width: 12, height: 12 }} />
                  <BiFemale
                    style={{ color: "#2CCAD3", width: 12, height: 12 }}
                  />
                </div>
              </div>
              <span className="text-white">Top Narrow Majors by Gender</span>
            </h2>
            <div className="space-y-4">
              {majorData?.overall?.topNarrowMajorsInsights?.topByGender
                ?.slice(0, 5)
                .map((major, index) => (
                  <div key={index} className="relative">
                    <div className="mb-1 flex justify-between items-center">
                      <span className="text-sm font-['Roboto_Regular'] text-white">
                        {major.narrowMajor}
                      </span>
                      <span className="text-xs font-['Roboto_Regular'] text-white">
                        {major.graduates} graduates
                      </span>
                    </div>
                    <div className="relative h-8 bg-[#1E1F5E] rounded-full overflow-hidden">
                      {/* Male percentage */}
                      <div
                        className="absolute h-full bg-gradient-to-r from-[#2CCAD3]/30 to-[#2CCAD3]/50 group-hover:opacity-90 transition-opacity cursor-pointer"
                        style={{
                          width: `${major.genderDistribution.male.percentage}%`,
                          left: 0,
                        }}
                        onClick={() => {
                          router.push(
                            `/narrow_major?major=${encodeURIComponent(
                              major.narrowMajor
                            )}&generalMajor=${encodeURIComponent(
                              selectedMajor
                            )}`
                          );
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
                        className="absolute h-full bg-gradient-to-r from-[#fe1684]/30 to-[#fe1684]/50 group-hover:opacity-90 transition-opacity cursor-pointer"
                        style={{
                          width: `${major.genderDistribution.female.percentage}%`,
                          right: 0,
                        }}
                        onClick={() => {
                          router.push(
                            `/narrow_major?major=${encodeURIComponent(
                              major.narrowMajor
                            )}&generalMajor=${encodeURIComponent(
                              selectedMajor
                            )}`
                          );
                        }}
                      >
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="text-xs font-['Roboto_Regular'] text-white">
                            {major.genderDistribution.female.percentage}%
                          </span>
                          <BiFemale style={{ color: "#fe1684" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {!majorData?.overall?.topNarrowMajorsInsights?.topByGender
                ?.length && (
                <div className="flex items-center justify-center h-[200px] text-white">
                  No data available
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row
        gutter={[12, 12]}
        className="w-full"
        style={{ padding: "0em 0.2em 0em 1.4em", marginTop: "1em" }}
      >
        {/* Top Occupations by Salary */}
        <Col xs={24} lg={9}>
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
              <span className="text-white">Top 5 occupation by salary</span>
            </h2>
            <div className="h-[280px]">
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
                  cx="35%"
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
                  {/* <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 backdrop-blur-sm p-2 rounded shadow">
                            <p className="text-gray-900">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-gray-600">
                              Average Salary:{" "}
                              {payload[0].value?.toLocaleString()} SAR
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  /> */}
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
                        .findIndex(
                          (o) => o.occupation === occupation.occupation
                        );

                      const words = occupation.occupation.split(" ");
                      const lines = [];
                      let currentLine = "";

                      words.forEach((word, i) => {
                        if (currentLine.length + word.length > 20) {
                          lines.push(currentLine);
                          currentLine = word;
                        } else {
                          currentLine += (currentLine ? " " : "") + word;
                        }
                        if (i === words.length - 1 && currentLine) {
                          lines.push(currentLine);
                        }
                      });

                      return lines.map((line, lineIndex) => (
                        <text
                          key={`${index}-${lineIndex}`}
                          x="70%"
                          y={`${15 + index * 15 + lineIndex * 4}%`}
                          textAnchor="start"
                          fill={colors[sortedIndex]}
                          className="text-xs"
                        >
                          {line}
                        </text>
                      ));
                    })}
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        {/* Sankey Chart Row */}
        <Col xs={10} lg={9}>
          <div className="bg-[#1d1f4f]/60 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors">
            <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
              <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                <Image
                  src="/icons/major.svg"
                  alt="Major"
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-white">
                Narrow Majors By Time of Employment
              </span>
            </h2>

            {/* Chart */}
            <div className="h-[300px] w-[400px]">
              {majorData?.overall.topNarrowMajorsInsights.topByEmploymentTiming
                .length > 0 ? (
                <ResponsiveSankey
                  data={{
                    nodes: [
                      ...majorData.overall.topNarrowMajorsInsights.topByEmploymentTiming.map(
                        (major) => ({
                          id: major.narrowMajor,
                          nodeColor: getNarrowMajorColor(major.narrowMajor),
                        })
                      ),
                      {
                        id: "Before Graduation",
                        nodeColor: colorMapping["Before Graduation"],
                      },
                      {
                        id: "Within First Year",
                        nodeColor: colorMapping["Within First Year"],
                      },
                      {
                        id: "After First Year",
                        nodeColor: colorMapping["After First Year"],
                      },
                    ],
                    links:
                      majorData.overall.topNarrowMajorsInsights.topByEmploymentTiming.flatMap(
                        (major) => [
                          {
                            source: major.narrowMajor,
                            target: "Before Graduation",
                            value:
                              major.employmentTiming.beforeGraduation
                                .percentage,
                          },
                          {
                            source: major.narrowMajor,
                            target: "Within First Year",
                            value:
                              major.employmentTiming.withinFirstYear.percentage,
                          },
                          {
                            source: major.narrowMajor,
                            target: "After First Year",
                            value:
                              major.employmentTiming.afterFirstYear.percentage,
                          },
                        ]
                      ),
                  }}
                  onClick={(
                    node: SankeyNodeDatum<
                      SankeyCustomNodeData,
                      SankeyCustomLinkData
                    >
                  ) => {
                    // Only navigate if clicking on a major node (not timing nodes)
                    console.log(node);
                    if (
                      node.id !== "Before Graduation" &&
                      node.id !== "Within First Year" &&
                      node.id !== "After First Year"
                    ) {
                      router.push(
                        `/narrow_major?major=${encodeURIComponent(
                          node.id || node.source.id
                        )}&generalMajor=${encodeURIComponent(selectedMajor)}`
                      );
                    }
                  }}
                  margin={{ top: 20, right: 80, bottom: 60, left: 200 }}
                  align="justify"
                  colors={(node) => {
                    // For employment timing nodes
                    if (
                      [
                        "Before Graduation",
                        "Within First Year",
                        "After First Year",
                      ].includes(node.id)
                    ) {
                      return colorMapping[node.id];
                    }
                    // For narrow majors, use the specific color
                    return getNarrowMajorColor(node.id);
                  }}
                  nodeOpacity={1}
                  nodeThickness={12}
                  nodeInnerPadding={2}
                  nodeSpacing={16}
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
                  theme={{
                    labels: {
                      text: {
                        fontSize: 10,
                        fill: "#fff",
                        fontFamily: "Roboto",
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
              ) : (
                <div className="flex items-center justify-center h-[200px] text-white">
                  No data available
                </div>
              )}
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
              <span className="text-white">Employment Rate by Major</span>
            </h2>
            <div className="space-y-4 relative">
              {/* Vertical line */}
              <div className="absolute left-[200px] top-0 bottom-0 w-[1.5px] bg-gray-100" />
              {majorData?.overall?.topNarrowMajorsInsights?.topByGender
                ?.slice(0, 5)
                .map((major, index) => {
                  const width = (major.employmentRate / 100) * 100; // Convert to percentage
                  return (
                    <div key={index} className="flex items-center group">
                      <div
                        className="w-[200px] relative cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/narrow_major?major=${encodeURIComponent(
                              major.narrowMajor
                            )}&generalMajor=${encodeURIComponent(
                              selectedMajor
                            )}`
                          );
                        }}
                      >
                        <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                        <span className="relative z-10 text-sm font-['Roboto_Regular'] text-white px-3 py-1 block break-words">
                          {major.narrowMajor}
                        </span>
                      </div>
                      <div className="relative flex-1 h-18">
                        <div
                          className="absolute border-[1px] border-white left-0 top-1/2 -translate-y-1/2 h-7 rounded-r-full group-hover:opacity-90 transition-opacity cursor-pointer"
                          style={{
                            width: `${width}%`,
                            maxWidth: "100%",
                            background:
                              "linear-gradient(90deg, #377eab 0%, #1A1B4B 100%)",
                          }}
                          onClick={() => {
                            router.push(
                              `/third-page?major=${encodeURIComponent(
                                major.narrowMajor
                              )}&generalMajor=${encodeURIComponent(
                                selectedMajor
                              )}`
                            );
                          }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2">
                            <span className="text-base font-['Roboto_Regular'] font-bold text-white">
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
                  No data available
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
