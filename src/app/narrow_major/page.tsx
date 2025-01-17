"use client";

import mockDataMajor from "@/app/majors/final_data_15-01 (version2).json";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BiFemale } from "react-icons/bi";
import { BiMale } from "react-icons/bi";
import { PiMoneyFill } from "react-icons/pi";
import { FaBusinessTime } from "react-icons/fa6";
// import { GiGraduateCap } from "react-icons/gi";
import { Row, Col } from "antd";
import { ResponsiveSankey } from "@nivo/sankey";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
};

const getNarrowMajorColor = (
  narrowMajor: string,
  selectedMajor: string | null
) => {
  return "#2CCAD3";
};

export default function ThirdPage() {
  const searchParams = useSearchParams();
  const selectedNarrowMajor = searchParams.get("major");
  const selectedGeneralMajor = searchParams.get("generalMajor");

  // Find the general major data
  const generalMajorData =
    mockDataMajor.majorsInsights.byGeneralMajor.generalMajors.find(
      (major) =>
        major.generalMajor.toLowerCase() === selectedGeneralMajor?.toLowerCase()
    );

  // Find the narrow major data
  const narrowMajorData = generalMajorData?.byNarrowMajor.narrowMajors.find(
    (major) =>
      major.narrowMajor.toLowerCase() === selectedNarrowMajor?.toLowerCase()
  );

  const overviewStats = narrowMajorData?.overall.totalMetrics;
  const topOccupations =
    narrowMajorData?.overall.topOccupationsInsights.highestPaying || [];
  const educationLevels = overviewStats?.educationLevelInsights || [];
  // const topMajors = narrowMajorData?.overall.topMajorsInsights || [];

  return (
    <div className="min-h-screen bg-transparent backdrop-blur-sm py-8 px-2">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 py-8 max-w-full">
        {/* Major Title */}
        <div className="mb-5">
          <h1 className="text-white font-['Roboto_Regular'] text-2xl text-center">
            {selectedNarrowMajor}
          </h1>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 w-full px-1">
          {/* Graduates */}
          <div className="bg-gradient-to-r from-transparent to-[#2CCAD3]/20 rounded-2xl p-3 pt-4 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors justify-center items-center">
            <div className="flex items-center gap-6">
              <div
                className="bg-[#2CCAD3]/10 p-2 rounded-xl"
                style={{ backgroundColor: "transparent", borderRadius: 0 }}
              >
                <Image
                  src="/icons/graduateicon.svg"
                  alt="Employment"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-['Roboto_Regular'] text-white/80">
                  Total Graduates
                </p>
                <p className="text-4xl font-bold text-white text-left">
                  {overviewStats?.graduates.totalGraduates.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-1 justify-start">
                  <div className="bg-[#2CCAD3]/20 rounded-full flex items-center gap-1 px-2 py-0.5">
                    <BiMale style={{ color: "#2CCAD3" }} />
                    <span className="text-xs text-white">
                      {overviewStats?.graduates.male.percentage}%
                    </span>
                  </div>
                  <div className="bg-[#2CCAD3]/20 rounded-full flex items-center gap-1 px-2 py-0.5">
                    <BiFemale style={{ color: "#fe1684" }} />
                    <span className="text-xs text-white">
                      {overviewStats?.graduates.female.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Rate */}
          <div className="bg-gradient-to-r from-transparent to-[#2CCAD3]/20 rounded-2xl p-3 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors flex flex-col justify-center items-center">
            <div className="flex items-center gap-3">
              <div
                className="bg-[#2CCAD3]/10 p-2 rounded-xl"
                style={{ backgroundColor: "transparent", borderRadius: 0 }}
              >
                <Image
                  src="/icons/employmentrateicon.svg"
                  alt="Employment"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-['Roboto_Regular'] text-white/80">
                  Employment Rate
                </p>
                <p className="text-4xl font-bold text-white text-left">
                  {overviewStats?.employmentRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Average Salary */}
          <div className="bg-gradient-to-r from-transparent to-[#2CCAD3]/20 rounded-2xl p-3 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors flex flex-col justify-center items-center">
            <div className="flex items-center gap-3">
              <div
                className="bg-[#2CCAD3]/10 p-2 rounded-xl"
                style={{ backgroundColor: "transparent", borderRadius: 0 }}
              >
                <PiMoneyFill
                  style={{ color: "#2CCAD3", width: 32, height: 32 }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-['Roboto_Regular'] text-white/80">
                  Average Salary
                </p>
                <p className="text-4xl font-bold text-white text-left">
                  {overviewStats?.averageSalary.toLocaleString()}
                  <span className="font-normal text-lg">SAR</span>
                </p>
              </div>
            </div>
          </div>

          {/* Time to Employment */}
          <div className="bg-gradient-to-r from-transparent to-[#2CCAD3]/20 rounded-l-2xl p-3 backdrop-blur-sm border border-white hover:border-[#2CCAD3]/30 transition-colors flex flex-col justify-center items-center">
            <div className="flex items-center gap-3">
              <div
                className="bg-[#2CCAD3]/10 p-2 rounded-xl"
                style={{ backgroundColor: "transparent", borderRadius: 0 }}
              >
                <FaBusinessTime
                  style={{ color: "#2CCAD3", width: 32, height: 32 }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-['Roboto_Regular'] text-white/80">
                  Time to Employment
                </p>
                <p className="text-4xl font-bold text-white text-left">
                  {overviewStats?.timeToEmployment.overall.days}
                  <span className="font-normal text-lg">days</span>
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
                    <span className="text-sm text-white/50 ml-1">
                      before graduate
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
                      within first year
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
                      After first year
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
                  {narrowMajorData?.overall?.topOccupationsInsights?.mostPopular?.map(
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
              </div>
            </div>
          </Col>

          {/* Top Majors by Gender */}
          <Col xs={24} lg={6}>
            <div className="bg-[#1E1F5E]/50 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
              <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
                <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                  <div className="flex gap-1">
                    <BiMale
                      style={{ color: "#2CCAD3", width: 12, height: 12 }}
                    />
                    <BiFemale
                      style={{ color: "#2CCAD3", width: 12, height: 12 }}
                    />
                  </div>
                </div>
                <span className="text-white">Top Majors by Gender</span>
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
                          {major.graduates} graduates
                        </span>
                      </div>
                      <div className="relative h-8 bg-[#1E1F5E] rounded-full overflow-hidden">
                        {/* Male percentage */}
                        <div
                          className="absolute h-full bg-gradient-to-r from-[#2CCAD3]/30 to-[#2CCAD3]/50 group-hover:opacity-90 transition-opacity"
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
                          className="absolute h-full bg-gradient-to-r from-[#fe1684]/30 to-[#fe1684]/50 group-hover:opacity-90 transition-opacity"
                          style={{
                            width: `${major.genderDistribution.female.percentage}%`,
                            right: 0,
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
                {!narrowMajorData?.overall.topMajorsInsights.topByGender
                  ?.length && (
                  <div className="flex items-center justify-center h-[200px] text-white/40">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Employment Rate by Majors Row */}
        <Row
          gutter={[12, 12]}
          className="w-full"
          style={{ padding: "0em 0.2em 0em 1.4em", marginTop: "1em" }}
        >
          {/* Employment Rate by Narrow Major */}
          <Col xs={24} lg={10}>
            <div className="bg-[#1E1F5E]/50 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
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
                  Employment Rate by Narrow Major
                </span>
              </h2>
              <div className="space-y-4 relative">
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
                              width: `${width}%`,
                              maxWidth: "100%",
                              background:
                                "linear-gradient(90deg, #377eab 0%, #1A1B4B 100%)",
                            }}
                          >
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
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
                    No data available
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Sankey Chart */}
          <Col xs={24} lg={14}>
            <div className="">
              <div className="bg-[#1E1F5E]/50 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors">
                <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
                  <div className="bg-[#2CCAD3]/10 p-1.5 rounded-lg">
                    <Image
                      src="/icons/employment.svg"
                      alt="Employment Flow"
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="text-white">
                    Narrow Majors By Time of Employment
                  </span>
                </h2>

                <div className="h-[300px] w-[680px]">
                  {narrowMajorData?.overall.totalMetrics.timeToEmployment && (
                    <ResponsiveSankey
                      data={{
                        nodes: [
                          {
                            id: selectedNarrowMajor || "",
                            nodeColor: getNarrowMajorColor(
                              selectedNarrowMajor || "",
                              selectedGeneralMajor
                            ),
                          },
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
                        links: [
                          {
                            source: selectedNarrowMajor || "",
                            target: "Before Graduation",
                            value:
                              narrowMajorData.overall.totalMetrics
                                .timeToEmployment.beforeGraduation.percentage,
                          },
                          {
                            source: selectedNarrowMajor || "",
                            target: "Within First Year",
                            value:
                              narrowMajorData.overall.totalMetrics
                                .timeToEmployment.withinFirstYear.percentage,
                          },
                          {
                            source: selectedNarrowMajor || "",
                            target: "After First Year",
                            value:
                              narrowMajorData.overall.totalMetrics
                                .timeToEmployment.afterFirstYear.percentage,
                          },
                        ],
                      }}
                      margin={{ top: 20, right: 120, bottom: 20, left: 240 }}
                      align="justify"
                      colors={(node) => {
                        if (
                          [
                            "Before Graduation",
                            "Within First Year",
                            "After First Year",
                          ].includes(node.id)
                        ) {
                          return colorMapping[node.id];
                        }
                        return getNarrowMajorColor(
                          node.id,
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
                      theme={{
                        labels: {
                          text: {
                            fontSize: 12,
                            fill: "#fff",
                            fontFamily: "Roboto_Regular",
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
                  {!narrowMajorData?.overall.totalMetrics.timeToEmployment && (
                    <div className="flex items-center justify-center h-[20px] text-white/40">
                      No data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="bg-[#1E1F5E]/50 rounded-2xl p-6 backdrop-blur-sm border hover:border-white transition-colors h-full">
              <h2 className="text-xl font-['Roboto_Regular'] mb-6 flex items-center gap-2">
                <div className="flex gap-1">
                  <BiMale
                    style={{ color: "#2CCAD3", width: 12, height: 12 }}
                  />
                  <BiFemale
                    style={{ color: "#2CCAD3", width: 12, height: 12 }}
                  />
                </div>
                <span className="text-white">Top Majors by Gender</span>
              </h2>
              <div className="space-y-4">
                {narrowMajorData?.overall.topMajorsInsights.topByGender?.map(
                  (major, index) => (
                    <div key={index} className="flex items-center group">
                      <div className="w-[180px] relative">
                        <div className="absolute inset-0 bg-[#1E1F5E]/90 rounded-full group-hover:bg-[#2CCAD3]/20 transition-colors" />
                        <span className="relative z-10 text-sm font-['Roboto_Regular'] text-white/70 px-3 py-1 block truncate">
                          {major.name}
                        </span>
                      </div>
                      <div className="relative flex-1 h-8 rounded-full overflow-hidden">
                        {/* Male percentage */}
                        <div
                          className="absolute h-full bg-gradient-to-r from-[#2CCAD3]/30 to-[#2CCAD3]/50 group-hover:opacity-90 transition-opacity"
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
                          className="absolute h-full bg-gradient-to-r from-[#fe1684]/30 to-[#fe1684]/50 group-hover:opacity-90 transition-opacity"
                          style={{
                            width: `${major.genderDistribution.female.percentage}%`,
                            right: 0,
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
                  )
                )}
                {!narrowMajorData?.overall.topMajorsInsights.topByGender
                  ?.length && (
                  <div className="flex items-center justify-center h-[200px] text-white/40">
                    No data available
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
