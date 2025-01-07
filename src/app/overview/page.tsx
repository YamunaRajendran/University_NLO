'use client';

import { Card } from "@/components/ui/card";
import mockData from "@/app/overview/data/generated_overview_insights 1.json";
import branding from "@/app/overview/data/branding.json";
import { useRouter } from "next/navigation";
// import MajorsEducationChord from "@/components/ui/MajorsEducationChord";
// import ChordDiagram from "@/components/ui/ChordDiagram";
// import { educationData } from "@/components/data/educationData";
// import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  Legend as RechartsLegend,
  LabelList,
  CartesianGrid,
  BarProps
} from 'recharts';
import {
  FaGraduationCap,
  FaBriefcase,
  FaMoneyBillAlt,
  FaClock,
  FaChartBar,
  FaMale,
  FaFemale,
  FaUserAlt,
  FaUserGraduate,
  FaDollarSign,
  FaMoneyBillWave,
  // FaLightbulb,
  FaChartLine,
  // FaBolt,
  // FaArrowUp,
  FaStar,
  FaBuilding,
  FaUniversity,
  // FaArrowCircleUp,
  FaRegLightbulb,
  FaTrophy,
  FaUsers,
  FaVenusMars,
  // FaCog,
  FaBook,
  FaIndustry,
  // BookOpen, LineChart,
} from 'react-icons/fa';
import { Grid } from '@mui/material';
// import { motion } from 'framer-motion';

import {TrendingUp, Users, GraduationCap, Briefcase,  ArrowUpCircle, DollarSign, ArrowUpIcon } from 'lucide-react';
// import { react } from "plotly.js";

// Brand Colors from branding.json
const brandColors = {
  primary: {
    teal: 'rgb(42, 177, 187)',    // Primary 1
    blue: 'rgb(46, 107, 178)',    // Primary 2
    navy: 'rgb(33, 38, 94)'       // Primary 3
  },
  secondary: {
    darkTeal: 'rgb(31, 91, 88)',  // Secondary 1
    rose: 'rgb(172, 72, 99)',     // Secondary 2
    gray: 'rgb(119, 117, 134)'    // Secondary 3
  }
};
// salaryRange(salaryRange: any): unknown;
//   timing: any;
//   gender: any;
//   occupation: any;
interface ChartData {
  salaryRange(salaryRange: ChartData[]): unknown;
  timing: ChartData[];
  gender: ChartData[];
  occupation: ChartData[];
  generalMajor?: string;
  major?: string;
  value?: number;
  name?: string;
  payload?: {
    range?: string;
    percentage?: number;
    occupation?: string;
  };
  activePayload?: Array<{
    payload: {
      occupation: string;
    };
  }>;
}


interface FormatterValue {
  value: number;
  name?: string;
  toLocaleString?: () => string;
}

export default function OverviewPage() {
  // const [selectedMajor, setSelectedMajor] = useState<string | null>(null);


  const router = useRouter();
  const { totalGraduates, overallEmploymentRate, averageSalary, averageTimeToEmployment } = mockData.OverViewInsights.summaryCards;
  const { byGraduates, byEmploymentRate, byAverageSalary, byGenderGap } = mockData.OverViewInsights.topGeneralMajors;
  const {
    byGraduates: iscoByGraduates,
    byAverageSalary: iscoByAverageSalary,
    byGenderGap: iscoByGenderGap,
  } = mockData.OverViewInsights.topISCOOccupations;
  const { male, female } = mockData.OverViewInsights.genderDistribution;
  const { ranges: salaryRanges } = mockData.OverViewInsights.salaryDistribution;
  
  const employmentTiming = mockData.OverViewInsights.employmentTiming;

  const genderData = [
    { name: 'Male', value: male.count, percentage: male.percentage },
    { name: 'Female', value: female.count, percentage: female.percentage }
  ];

  const salaryData = Object.entries(salaryRanges).map(([range, data]) => ({
    range,
    count: data.count,
    percentage: data.percentage
  }));

  const timingData = [
    {
      name: 'Pre-Graduation',
      value: employmentTiming.preGraduation.count,
      percentage: employmentTiming.preGraduation.percentage,
      color: '#0F75BC'
    },
    {
      name: 'Within First Year',
      value: employmentTiming.withinYear.count,
      percentage: employmentTiming.withinYear.percentage,
      color: '#45B7A9'
    },
    {
      name: 'After First Year',
      value: employmentTiming.afterYear.count,
      percentage: employmentTiming.afterYear.percentage,
      color: '#ac4863'
    }
  ];

  const GENDER_COLORS = ['#0F75BC', '#45B7A9', '#FFE5A3'];
  // const SALARY_COLORS = ['#0F75BC', '#45B7A9', '#FFE5A3']

  // const summaryCards = [
  //   {
  //     title: "Total Graduates",
  //     value: totalGraduates.toLocaleString(),
  //     link: "/majors?metric=graduates",
  //     icon: <FaGraduationCap className="h-6 w-6 text-[#0F75BC]" />
  //   },
  //   {
  //     title: "Average Employment Rate",
  //     value: `${overallEmploymentRate}%`,
  //     link: "/majors?metric=employment",
  //     icon: <FaBriefcase className="h-6 w-6 text-[#45B7A9]" />
  //   },
  //   {
  //     title: "Average Salary",
  //     value: `${averageSalary.toLocaleString()}`,
  //     link: "/majors?metric=salary",
  //     icon: <FaMoneyBillAlt className="h-6 w-6 text-[#FFE5A3]" />
  //   },
  //   {
  //     title: "Average Time to Employment",
  //     value: `${averageTimeToEmployment} days`,
  //     link: "/majors?metric=time-to-employment",
  //     icon: <FaClock className="h-6 w-6 text-[#0F75BC]" />
  //   }
  // ];



  const handleMajorClick = (generalMajor: string) => {
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    // console.log('General Major clicked:', generalMajor);
    router.push(`/majors?generalMajor=${encodeURIComponent(generalMajor)}#general-majors-insights`);
  };
  
  // const handleMajorClick = (major: string) => {
  //   router.push(`/majors?generalMajor=${encodeURIComponent(major)}`)
  // };

  const handleOccupationClick = (occupation: string) => {
    router.push(`/majors?occupation=${encodeURIComponent(occupation)}#occupations-insights`);
  };

  const handleGenderClick = (gender: string) => {
    router.push(`/majors?gender=${encodeURIComponent(gender)}#gender-insights`);
  };


  const handleSalaryClick = (range: string) => {
    router.push(`/majors?salary=${encodeURIComponent(range)}#salary-insights`);
  };

  const handleTimingClick = (timing: string) => {
    router.push(`/majors?timing=${encodeURIComponent(timing)}#timing-insights`);
  };
  
  // const handleChartClick = (data: ChartData, chartType: string) => {
  //   let generalMajor = '';

  //   switch (chartType) {
  //     case 'general_major':
  //       generalMajor = data.generalMajor || '';
  //       break;
  //     case 'employment':
  //       generalMajor = data.major || '';
  //       break;
  //     case 'salary':
  //       generalMajor = data.generalMajor || '';
  //       break
  //   }

  //   if (generalMajor) {
  //     router.push(`/majors?generalMajor=${encodeURIComponent(generalMajor)}`);
  //   }
  // };

  const handleChartClick = (data: ChartData, chartType: string) => {
    let url = '';
  
    switch (chartType) {
      case 'general_major': // Navigate to Majors
        if (data.generalMajor) {
          url = `/majors?generalMajor=${encodeURIComponent(data.generalMajor)}#general-majors-insights`;
        }
        break;
  
      case 'employment': // Navigate to Majors (Employment Section)
        if (data.major) {
          url = `/majors?generalMajor=${encodeURIComponent(data.major)}#general-majors-insights`;
        }
        break;
  
      // case 'salary': // Navigate to Metrics (Salary Section)
      //   if (data.salaryRange) {
      //     url = `/metrics/salary/${encodeURIComponent(data.salaryRange)}`;
      //   }
      //   break;
  
      case 'occupation': // Navigate to Occupations
        if (data.name) {
          url = `/occupations?occupation=${encodeURIComponent(data.name)}#occupations-insights`;
        }
        break;
  
      case 'gender': // Navigate to Metrics (Gender Section)
      // if (data.gender) {
      //   // url = `/metrics/${encodeURIComponent(data.gender.toLowerCase())}`;
      //   url = `/metrics/${encodeURIComponent(data.name.toLowerCase())}`;
        if (data.name) {
          url = `/metrics/gender/${encodeURIComponent(data.name.toLowerCase())}`;
        }
        break;
  
      case 'timing': // Navigate to Metrics (Timing Section)
        if (data.name) {
          url = `/metrics/timing/${encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, '-'))}`;
        }
        break;
  
      default:
        console.error('Unknown chart type:', chartType);
        return; // Exit if no valid chartType is provided
    }
  
    if (url) {
      router.push(url);
    }
  };
  

  const employabilityData = byEmploymentRate.rankings.slice(0, 5).map(item => ({
    major: item.generalMajor,
    employmentRate: item.value,
    weightedContribution: item.employedStudents,
    totalStudents: item.totalStudents
  }));

  // Calculate median salary for top paying majors
  // const medianSalaryValue = (() => {
  //   const salaries = byAverageSalary.rankings.map(item => item.value);
  //   const sortedSalaries = [...salaries].sort((a, b) => a - b);
  //   const mid = Math.floor(sortedSalaries.length / 2);
  //   return sortedSalaries.length % 2 === 0
  //     ? (sortedSalaries[mid - 1] + sortedSalaries[mid]) / 2
  //     : sortedSalaries[mid];
  // })();

  // Add median salary to each data point for the chart
  // const topPayingMajorsData = byAverageSalary.rankings.slice(0, 5).map(item => ({
  //   ...item,
  //   medianSalary: medianSalaryValue
  // }));

  // Transform data for gender distribution chart
  const genderDistributionData = byGraduates.rankings.map(item => ({
    generalMajor: item.generalMajor,
    male: item.male.count,
    female: item.female.count,
    malePercentage: item.male.percentage,
    femalePercentage: item.female.percentage,
    total: item.value
  }));

  return (
    <div className="p-2 md:p-4 lg:p-4 max-w-[1920px] mx-auto space-y-4">
      {/* Header Section with Brand Description */}
      <div className="space-y-0">
        <h1 className="text-3xl font-neo-sans-bold text-[#2AB1BB] flex gap-3 items-center">
          <FaChartBar className="text-[#2AB1BB]" />
          Overview
        </h1>
        <div className="max-w-3xl space-y-2">
          <p className="text-white text-lg font-neo-sans-medium">
            {branding.brandOverview.description}
          </p>
          <p className="text-gray-300 text-sm font-neo-sans">
            {branding.brandOverview.purpose}
          </p>
        </div>
      </div>

      {/* Highlights Ribbon */}
      <div className="flex justify-center">
        <div className="relative max-w-[1200px] py-2 overflow-hidden bg-gradient-to-r from-[#212E5E]/90 to-[#2E6BB2]/90 backdrop-blur-sm border-y border-[#2AB1BB]/20 rounded-lg">
          {/* Glow Effect */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2AB1BB]/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2AB1BB]/30 to-transparent"></div>
          </div>

          <div className="flex items-center gap-2">
            {/* Title */}
            <div className="flex-shrink-0 pl-2 flex items-center gap-1">
              <FaRegLightbulb className="text-yellow-400 animate-pulse" />
              <span className="text-sm font-neo-sans-medium text-white">KEY INSIGHTS</span>
            </div>

            {/* Marquee Content */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap flex items-center gap-4">
                {/* Top Major */}
                <div className="flex items-center gap-2 bg-[#1a2234]/50 px-2 py-1 rounded-full">
                  <FaTrophy className="text-yellow-400" />
                  <span className="text-sm font-roboto text-gray-300">Top Major:</span>
                  <span className="text-sm font-neo-sans-bold text-white">Business & Law</span>
                </div>

                {/* Employment Success */}
                <div className="flex items-center gap-2 bg-[#1a2234]/50 px-2 py-1 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm font-roboto text-gray-300">Employment Rate:</span>
                  <span className="text-sm font-neo-sans-bold text-white">{mockData.OverViewInsights.summaryCards.overallEmploymentRate}%</span>
                </div>

                {/* Best Employment Rate */}
                <div className="flex items-center gap-2 bg-[#1a2234]/50 px-2 py-1 rounded-full">
                  <FaChartLine className="text-blue-400" />
                  <span className="text-sm font-roboto text-gray-300">Best Rate:</span>
                  <span className="text-sm font-neo-sans-bold text-white">{mockData.OverViewInsights.topGeneralMajors.byEmploymentRate.rankings[0].value}%</span>
                  <span className="text-xs font-roboto text-gray-400">(Engineering)</span>
                </div>

                {/* Average Salary */}
                <div className="flex items-center gap-2 bg-[#1a2234]/50 px-2 py-1 rounded-full">
                  <FaMoneyBillWave className="text-emerald-400" />
                  <span className="text-sm font-roboto text-gray-300">Avg Salary:</span>
                  <span className="text-sm font-neo-sans-bold text-white">{mockData.OverViewInsights.summaryCards.averageSalary.toLocaleString()} SAR</span>
                </div>

                {/* Pre-Graduation Employment */}
                <div className="flex items-center gap-2 bg-[#1a2234]/50 px-2 py-1 rounded-full">
                  <FaGraduationCap className="text-purple-400" />
                  <span className="text-sm font-roboto text-gray-300">Pre-Grad Jobs:</span>
                  <span className="text-sm font-neo-sans-bold text-white">{mockData.OverViewInsights.employmentTiming.preGraduation.percentage}%</span>
                </div>

                {/* Total Graduates */}
                <div className="flex items-center gap-2 bg-[#1a2234]/50 px-2 py-1 rounded-full">
                  <FaUsers className="text-blue-400" />
                  <span className="text-sm font-roboto text-gray-300">Graduates:</span>
                  <span className="text-sm font-neo-sans-bold text-white">{mockData.OverViewInsights.summaryCards.totalGraduates.toLocaleString()}</span>
                </div>

                {/* Duplicate for seamless loop */}
                <div className="flex items-center gap-2 bg-[#1a2234]/50 px-2 py-1 rounded-full">
                  <FaTrophy className="text-yellow-400" />
                  <span className="text-sm font-roboto text-gray-300">Top Major:</span>
                  <span className="text-sm font-neo-sans-bold text-white">Business & Law</span>
                </div>

                <div className="flex items-center gap-2 bg-[#1a2234]/50 px-2 py-1 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm font-roboto text-gray-300">Employment Rate:</span>
                  <span className="text-sm font-neo-sans-bold text-white">{mockData.OverViewInsights.summaryCards.overallEmploymentRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={2} style={{ marginTop: '0' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-opacity-20" style={{ backgroundColor: `${brandColors.primary.teal}20` }}>
                <FaGraduationCap className="text-2xl" style={{ color: brandColors.primary.teal }} />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-roboto">Total Graduates</p>
                <p className="text-2xl font-roboto text-white">{totalGraduates.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-opacity-20" style={{ backgroundColor: `${brandColors.primary.teal}20` }}>
                <FaBriefcase className="text-2xl" style={{ color: brandColors.primary.teal }} />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-roboto">Employment Rate</p>
                <p className="text-2xl font-roboto text-white">{overallEmploymentRate}%</p>
              </div>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-opacity-20" style={{ backgroundColor: `${brandColors.primary.teal}20` }}>
                <FaMoneyBillAlt className="text-2xl" style={{ color: brandColors.primary.teal }} />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-roboto">Average Salary</p>
                <p className="text-2xl font-roboto text-white">{averageSalary.toLocaleString()} SAR</p>
              </div>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-opacity-20" style={{ backgroundColor: `${brandColors.primary.teal}20` }}>
                <FaClock className="text-2xl" style={{ color: brandColors.primary.teal }} />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-roboto">Time to Employment</p>
                <p className="text-2xl font-roboto text-white">{averageTimeToEmployment} days</p>
              </div>
            </div>
          </Card>
        </Grid>
      </Grid>

      {/* Gender Distribution */}
      <h2 className="text-xl md:text-2xl font-neo-sans-bold mb-2 flex items-center gap-2" style={{ color: brandColors.primary.teal }}>
        <FaUserAlt style={{ color: brandColors.primary.teal }} />
        Gender Distribution
      </h2>

      {/* Key Insights - Gender Distribution */}
      <div className="bg-gradient-to-r from-[#212E5E] to-[#2E6BB2] p-0 rounded-lg mb-4 border-l-4" style={{ borderColor: brandColors.primary.teal }}>
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-3"> */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-opacity-20" style={{ backgroundColor: `${brandColors.primary.teal}20` }}>
            <FaVenusMars className="text-xl" style={{ color: brandColors.primary.teal }} />
          </div>
          <div>
            <h3 className="text-base font-neo-sans-bold text-white">Gender Distribution Insights</h3>
            {/* <p className="text-xs text-gray-400">Analysis across major fields</p> */}
          </div>
        </div>


        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 md:gap-3">
          {/* Left Column */}
          <div>
            {/* Notable Trends */}
            {/* <div className="bg-white/5 rounded p-3 border border-white/10 hover:border-[#2AB1BB]/30 transition-colors"> */}
            {/* <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-neo-sans-medium text-[#2CD9FF]">Notable Trends</h4>
              <FaChartLine className="text-[#2CD9FF] text-sm" />
            </div> */}
            <div className="grid grid-cols-3 gap-2">
              {/* Technical Fields Trend */}
              <div className="bg-black/20 rounded p-2 " >
              <div className="flex flex-row justify-center gap-8">
              <FaIndustry className="text-[#4A90E2] text-lg" />
                <div className="flex flex-col items-center text-center gap-2">
                
                  
                  <p className="text-sm font-roboto text-white">Technical fields are male-dominated</p>
                  <div className="flex flex-row items-center gap-4">
                    <span className="text-[14px] px-1.5 py-0.5 rounded-full bg-[#4A90E2]/20 text-[#4A90E2]">
                      Engineering  {87}% male
                      {/* Engineering {mockData.OverViewInsights.overall.genderDistribution.find(m => m.generalMajor === "Engineering, manufacturing and construction")?.male.percentage}% male */}
                    </span>
                    <span className="text-[14px] px-1.5 py-0.5 rounded-full bg-[#4A90E2]/20 text-[#4A90E2]">
                      Agriculture{97}% male{/* Agriculture {mockData.OverViewInsights.overall.genderDistribution.find(m => m.generalMajor === "Agriculture, forestry, fisheries and veterinary")?.male.percentage}% male */}
                    </span>
    
                  </div>
                </div>
              </div>
              </div>

              {/* Education Fields Trend */}
              <div className="bg-black/20 rounded p-2">
              <div className="flex flex-row justify-center gap-8">
               
                
                  <FaBook className="text-[#ac4863] text-lg" />
                  <div className="flex flex-col items-center text-center gap-2">
                  <p className="text-sm font-roboto text-white">Education & care fields are female-dominated</p>
                  <div className="flex flex-row items-center gap-4">
                    <span className="text-[14px] px-1.5 py-0.5 rounded-full bg-[#ac4863]/20 text-[#ac4863]">
                      Education {97}% female
                      {/* Education {mockData.OverViewInsights.overall.genderDistribution.find(m => m.generalMajor === "education")?.female.percentage}% female */}
                    </span>
                    <span className="text-[14px] px-1.5 py-0.5 rounded-full bg-[#ac4863]/20 text-[#ac4863]">
                      Health  {87}% female {/* Health {mockData.OverViewInsights.overall.genderDistribution.find(m => m.generalMajor === "Health and Welfare")?.female.percentage}% female */}
                    </span>
                  </div>
                </div>
                </div>
              </div>

              {/* Surprising Trends */}
              <div className="bg-black/20 rounded p-2">
              <div className="flex flex-row justify-center gap-8">
              <FaUniversity className="text-[#FFD700] text-lg" />
                <div className="flex flex-col items-center text-center gap-2">
                  
                  <p className="text-sm font-roboto text-white">Rising female presence in key fields</p>
                  <div className="flex flex-row items-center gap-4">
                    <span className="text-[14px] px-1.5 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700]">
                      Sciences {97}% female
                      {/* Sciences {mockData.OverViewInsights.overall.genderDistribution.find(m => m.generalMajor === "Natural Sciences, Mathematics and Statistics")?.female.percentage}% female */}
                    </span>
                    <span className="text-[14px] px-1.5 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700]">
                      Business {87}% female {/* Business {mockData.OverViewInsights.overall.genderDistribution.find(m => m.generalMajor === "Business, administration and law")?.female.percentage}% female */}
                    </span>
                  </div>
                </div>
              </div>
              </div>
            </div>


            {/* Right Column */}
            <div className="space-y-3">
            </div>
          </div>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaMale className="text-[#4A90E2]" />
              <FaFemale className="text-[#FF69B4]" />
              GENDER DISTRIBUTION BY PERCENTAGE
            </h3>
            <div className="h-[250px] md:h-[329px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    onClick={(data) => handleGenderClick(data.name)}
                    cursor="pointer"
                    label={({ name, value, percentage }) => `${name}: ${value.toLocaleString()} (${percentage}%)`}
                    labelLine={{ strokeWidth: 0 }}
                    fontFamily="Roboto"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                    ))}
                  </Pie>
                  {/* <Tooltip content={<GenderTooltip />} /> */}
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-white text-lg font-medium">Total</p>
                <p className="text-[#0F75BC] text-2xl font-bold">{totalGraduates.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaChartBar className="text-[#2AB1BB]" />
              TOP GENERAL MAJORS BY GENDER DISTRIBUTION
            </h3>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byGenderGap.rankings.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                  barGap={-2}
                  onClick={(data) => {
                    if (data && data.activePayload?.[0]?.payload) {
                      handleGenderClick(data.activePayload[0].payload.gender);
                    }
                  }}
                  // onClick={(data) => handleGenderClick(data.name)}
                  // cursor="pointer"
                  // onClick={(data) => {
                  //   if (data && data.activePayload && data.activePayload[0]) {
                  //     const generalMajor = data.activePayload[0].payload.generalMajor;
                  //     router.push(`/majors?generalMajor=${generalMajor}`);
                  //   }
                  // }}
                  // cursor="pointer"
                >
                  <defs>
                    <linearGradient id="maleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A90E2" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4A90E2" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="femaleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2abbb1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2abbb1" stopOpacity={0.8} />
                    </linearGradient>
                    {/* <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity={1}/>
              <stop offset="100%" stopColor="#FFD700" stopOpacity={0.8}/>
            </linearGradient> */}
                  </defs>
                  <XAxis
                    type="number"
                    label={{ value: 'PERCENTAGE (%)', position: 'bottom', fill: '#fff', offset: 0 }}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                    domain={[0, 100]}
                  />
                  <YAxis
                    dataKey="generalMajor"
                    type="category"
                    width={150}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                    label={{ value: 'GENERAL MAJOR', angle: -90, position: 'left', fill: '#fff', offset: -10 }}
                  />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                          <p className="text-white font-medium">{data.generalMajor}</p>
                          <p className="text-[#4A90E2]">Male: {data.malePercentage}%</p>
                          <p className="text-[#2abbb1]">Female: {data.femalePercentage}%</p>
                          {/* <p className="text-[#FFD700]">Gap: {data.genderGap}%</p> */}
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <RechartsLegend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{
                      position: 'absolute',
                      top: '10px',
                      right: '0px',
                      paddingBottom: '12px',
                    }}
                    content={() => (
                      <div style={{ display: 'flex', gap: '8px', paddingLeft: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '16px', height: '16px', backgroundColor: '#4A90E2', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'Roboto' }}>Male</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '16px', height: '16px', backgroundColor: '#2abbb1', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'Roboto' }}>Female</span>
                        </div>
                        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#FFD700', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px' }}>Gap</span>
                        </div> */}
                      </div>
                    )}
                  />
                  <Bar
                    dataKey="malePercentage"
                    fill="url(#maleGradient)"
                    name="Male"
                    stackId="a"
                    label={{
                      position: 'inside',
                      fill: '#fff',
                      fontSize: 10,
                      fontFamily: 'Roboto',
                      formatter: (value: FormatterValue) => {
                        if (typeof value?.toLocaleString === 'function') {
                          return value.toLocaleString() + '%';
                        }
                        return value?.value?.toString() || '';
                      },
                    }}
                  />
                  <Bar
                    dataKey="femalePercentage"
                    fill="url(#femaleGradient)"
                    name="Female"
                    stackId="b"
                    label={{
                      position: 'right',
                      fill: '#fff',
                      fontSize: 10,
                      fontFamily: 'Roboto',
                      formatter: (value: FormatterValue) => {
                        if (typeof value?.toLocaleString === 'function') {
                          return value.toLocaleString() + '%';
                        }
                        return value?.value?.toString() || '';
                      },
                    }}
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaUserAlt className="text-[#2AB1BB]" />
              TOP OCCUPATIONS BY GENDER DISTRIBUTION
            </h3>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={iscoByGenderGap.rankings.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 10, right: 0, left: 20, bottom: 20 }}
                  barGap={-2}
                  // onClick={(data) => handleGenderClick(data.name)}
                  //   cursor="pointer"
                  onClick={(data) => {
                    if (data && data.activePayload?.[0]?.payload) {
                      handleGenderClick(data.activePayload[0].payload.gender);
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="maleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A90E2" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4A90E2" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="femaleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2abbb1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2abbb1" stopOpacity={0.8} />
                    </linearGradient>
                    {/* <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#FFD700" stopOpacity={0.8}/>
                    </linearGradient> */}
                  </defs>
                  <XAxis
                    type="number"
                    label={{ value: 'PERCENTAGE (%)', position: 'bottom', fill: '#fff', offset: 0 }}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                    domain={[0, 100]}
                  />
                  <YAxis
                    dataKey="occupation"
                    type="category"
                    width={120}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                  />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                          <p className="text-white font-medium">{data.occupation}</p>
                          <p className="text-[#4A90E2]">Male: {data.malePercentage}%</p>
                          <p className="text-[#2abbb1]">Female: {data.femalePercentage}%</p>
                          {/* <p className="text-[#FFD700]">Gap: {data.genderGap}%</p> */}
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <RechartsLegend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{
                      position: 'absolute',
                      top: '0px',
                      right: '0px',
                      paddingBottom: '12px',
                    }}
                    content={() => (
                      <div style={{ display: 'flex', gap: '8px', paddingLeft: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '16px', height: '16px', backgroundColor: '#4A90E2', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'Roboto' }}>Male</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '16px', height: '16px', backgroundColor: '#2abbb1', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'Roboto' }}>Female</span>
                        </div>
                        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#FFD700', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px' }}>Gap</span>
                        </div> */}
                      </div>
                    )}
                  />
                  <Bar
                    dataKey="malePercentage"
                    fill="url(#maleGradient)"
                    name="Male"
                    stackId="a"
                    label={{
                      position: 'inside',
                      fill: '#fff',
                      fontSize: 10,
                      fontFamily: 'Roboto',
                      formatter: (value: FormatterValue) => {
                        if (typeof value?.toLocaleString === 'function') {
                          return value.toLocaleString() + '%';
                        }
                        return value?.value?.toString() || '';
                      },
                    }}
                  />
                  <Bar
                    dataKey="femalePercentage"
                    fill="url(#femaleGradient)"
                    name="Female"
                    stackId="b"
                    label={{
                      position: 'inside',
                      fill: '#fff',
                      fontSize: 10,
                      fontFamily: 'Roboto',
                      formatter: (value: FormatterValue) => {
                        if (typeof value?.toLocaleString === 'function') {
                          return value.toLocaleString() + '%';
                        }
                        return value?.value?.toString() || '';
                      },
                    }}
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>
      </Grid>

      {/* Top General Major Insights */}
      <h2 className="text-xl md:text-2xl font-neo-sans-bold mb-4 flex items-center gap-3 mt-8" style={{ color: brandColors.primary.teal }}>
        <FaUniversity style={{ color: brandColors.primary.teal }} />
        Top General Major Insights
      </h2>


      {/* Key Insights - General Majors */}
      <div className="bg-gradient-to-r from-[#212E5E] to-[#2E6BB2] p-0 rounded-lg mb-4 border-l-4" style={{ borderColor: brandColors.primary.teal }} >
        <div className="flex items-start gap-2">
          <div className="p-2 rounded-full bg-opacity-20" style={{ backgroundColor: `${brandColors.primary.teal}20` }}>
            <FaChartLine className="text-xl" style={{ color: brandColors.primary.teal }} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-neo-sans-bold text-white">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="bg-black/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <GraduationCap className="h-5 w-5 text-[#00A9B5]" />
                  <span className="text-xs text-[#00A9B5] bg-[#00A9B5]/20 rounded-full px-2 py-0.5">Enrollment</span>
                </div>
                <h4 className="text-lg font-bold text-white">179,447</h4>
                <p className="text-xs text-gray-300">Business & Law</p>
                <div className="mt-1 flex items-center text-green-400">
                  <ArrowUpCircle className="h-3 w-3 mr-1" />
                  <span className="text-xs">51.4% Female</span>
                </div>

              </div>
              <div className="bg-black/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-[#00A9B5]" />
                  <span className="text-xs text-[#00A9B5] bg-[#00A9B5]/20 rounded-full px-2 py-0.5">Salary</span>
                </div>
                <h4 className="text-lg font-bold text-white">3,818</h4>
                <p className="text-xs text-gray-300">Health & Welfare</p>
                <div className="mt-1 flex items-center text-green-400">
                  <ArrowUpCircle className="h-3 w-3 mr-1" />
                  <span className="text-xs">Top Sector</span>
                </div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-[#00A9B5]" />
                  <span className="text-xs text-[#00A9B5] bg-[#00A9B5]/20 rounded-full px-2 py-0.5">Employment</span>
                </div>
                <h4 className="text-lg font-bold text-white">61.1%</h4>
                <p className="text-xs text-gray-300">Engineering</p>
                <div className="mt-1 flex items-center text-green-400">
                  <ArrowUpCircle className="h-3 w-3 mr-1" />
                  <span className="text-xs">Highest Rate</span>
                </div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-[#00A9B5]" />
                  <span className="text-xs text-[#00A9B5] bg-[#00A9B5]/20 rounded-full px-2 py-0.5">Trends</span>
                </div>
                <ul className="space-y-1">
                  <li className="text-xs text-gray-300">• Business leads (179k)</li>
                  <li className="text-xs text-gray-300">• Agriculture: 95.6% male</li>
                  <li className="text-xs text-gray-300">• Education: 73.8% female</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Briefcase className="h-5 w-5 text-[#00A9B5]" />
                  <span className="text-xs text-[#00A9B5] bg-[#00A9B5]/20 rounded-full px-2 py-0.5">Outcomes</span>
                </div>
                <ul className="space-y-1">
                  <li className="text-xs text-gray-300">• Health leads (3,818)</li>
                  <li className="text-xs text-gray-300">• Engineering (3,707)</li>
                  <li className="text-xs text-gray-300">• STEM highest employed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaMale className="text-[#4A90E2]" />
              <FaFemale className="text-[#FF69B4]" />
              TOP GENERAL MAJORS BY GRADUATES
            </h3>
            <div className="h-[300px] ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={genderDistributionData}
                  layout="vertical"
                  margin={{ top: 10, right: 40, left: 20, bottom: 20 }}
                  onClick={(data) => {
                    if (data && data.activePayload?.[0]) {
                      handleMajorClick(data.activePayload[0].payload.generalMajor);
                    }
                  }}
                >
                  <XAxis
                    type="number"
                    label={{ value: 'NUMBER OF GRADUATES', position: 'bottom', fill: '#ffff', offset: 0 }}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                  />
                  <YAxis
                    dataKey="generalMajor"
                    type="category"
                    width={150}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                    label={{ value: 'GENERAL MAJORS', angle: -90, position: 'left', fill: '#fff', offset: -20 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                            <p className="text-white font-medium">{data.generalMajor}</p>
                            <p className="text-[#2abbb1]">Female: {data.female.toLocaleString()} ({data.femalePercentage}%)</p>
                            <p className="text-[#4A90E2]">Male: {data.male.toLocaleString()} ({data.malePercentage}%)</p>
                            <p className="text-white">Total: {data.total.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <RechartsLegend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{
                      position: 'absolute',
                      top: '10px',
                      right: '0px',
                      paddingBottom: '12px',
                    }}
                    content={() => (
                      <div style={{ display: 'flex', gap: '16px', paddingLeft: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#2abbb1', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>Female</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#4A90E2', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>Male</span>
                        </div>

                      </div>
                    )}
                  />
                  <Bar dataKey="female" fill="#2abbb1" name="Female" stackId="gender">
                    <LabelList dataKey="female" position="inside" fill="#fff" fontSize={11} fontFamily='Roboto' formatter={(value: number) => value?.toLocaleString()} />
                  </Bar>
                  <Bar dataKey="male" fill="#4A90E2" name="Male" stackId="gender">
                    <LabelList dataKey="male" position="inside" fill="#fff" fontSize={11} fontFamily='Roboto' formatter={(value: number) => value?.toLocaleString()} />
                    <LabelList dataKey="total" position="right" fill="#fff" fontSize={10} fontFamily='Roboto' formatter={(value: number) => value?.toLocaleString()} />
                  </Bar>
                  {/* <Bar dataKey="total" fill="#fff" name="Total" stackId="gender">
                    <LabelList dataKey="total" position="insideEnd" fill="#fff" formatter={(value) => `${value.toLocaleString()}`} />
                  </Bar> */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaDollarSign className="text-[#2AB1BB]" />
              TOP PAYING GENERAL MAJORS BY AVERAGE SALARY
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="30%"
                  outerRadius="100%"
                  data={byAverageSalary.rankings.slice(0, 5).reverse().map((item, index) => ({
                    name: item.generalMajor,
                    value: item.value,
                    fill: ['#996515', '#778899 ', '#2c828c', '#ac4863', '#2ab1bb'][index],
                  }))}
                  onClick={(data) => {
                    console.log(data);
                    if (data && data.activePayload?.[0]?.payload) {
                      handleMajorClick(data.activePayload[0].payload.name);
                    }
                  }}
                  // onClick={(data) => {
                  //    if (data && data.activePayload?.[0]) {
                  //     handleMajorClick(data?.activePayload?.[0]?.payload?.generalMajor);

                      
                  //   }
                  // }}
                  startAngle={90}
                  endAngle={-270}
                  cx="25%"
                  cy="50%"
                >
                  <RadialBar
                    // minAngle={15}
              
                    // clockwise={true}
                    background={{ fill: '#ffffff10' }}
                    label={{
                      position: 'insideStart',
                      fill: '#fff',
                      formatter: (value: number) => `${value.toLocaleString()} SAR`,
                      fontSize: 12,
                      fontFamily: 'Roboto'
                    }}
                    dataKey="value"
                    cornerRadius={30}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 backdrop-blur-sm p-2 rounded shadow">
                            <p className="text-gray-900">{payload[0].payload.name}</p>
                            <p className="text-gray-600">Average Salary: {payload[0].value?.toLocaleString()} SAR</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Legend on the right side */}
                  {byAverageSalary.rankings.slice(0, 5).map((item, index) => (
                    <text
                      key={index}
                      x="100%"
                      y={`${30 + index * 10}%`}
                      textAnchor="end"
                      fill={['#2ab1bb', '#ac4863', '#2c828c', '#778899', '#996515'][index]}
                      className="text-xs"
                    >
                      {item.generalMajor}: {item.value.toLocaleString()} SAR
                    </text>
                  ))}
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12} lg={12}>
        <div className="relative">
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
            style={{
              background: brandColors.primary.navy,
              borderColor: brandColors.primary.teal
            }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaBriefcase className="text-[#2AB1BB]" />MOST EMPLOYABLE GENERAL MAJORS BY EMPLOYMENT RATE</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="75%" height="100%">
                <ComposedChart
                  data={employabilityData.sort((a, b) => b.employmentRate - a.employmentRate)}
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                  onClick={(data) => {
                    if (data && data.activePayload?.[0]) {
                      handleMajorClick(data.activePayload[0].payload.major);
                    }
                  }}>
                  <XAxis
                    dataKey="major"
                    type="category"
                    label={{ value: "GENERAL MAJORS", position: "bottom", fill: "#fff", offset: -20 }}
                    height={100}
                    tick={{ fill: '#fff', width: 100, fontSize: 13, fontFamily: 'Roboto' }}
                    tickFormatter={(value) => {
                    const words = value.split(' ');
                    return words.join('\n');

                    }}/>
                  <YAxis
                    yAxisId="left"
                    label={{ value: "NUMBER OF STUDENTS", angle: -90, position: "left", fill: "#fff", offset: 10, textAnchor: 'middle' }}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "EMPLOYMENTRATE(%)", angle: -90, position: "inside-right", fill: "#fff", offset: 10, textAnchor: 'middle' }}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                            <p className="text-white font-medium">{payload[0].payload.major}</p>
                            <p className="text-[#cf8b8d]">Total Students: {payload[0].value}</p>
                            <p className="text-[#2CD9FF]">Employed Students: {payload[1].value}</p>
                            <p className="text-[#FF6D6D]">Employment Rate: {payload[2].value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <RechartsLegend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{
                      paddingBottom: '16px',
                    }}
                    formatter={(value) => (
                      <span style={{ color: '#fff', fontSize: '16px', fontFamily: 'Roboto' }}>{value}</span>
                    )}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="totalStudents"
                    fill="#cf8b8d"
                    name="Total Students"
                    label={{ position: 'inside', fill: '#fff', fontSize: 11, fontFamily: 'Roboto' }}
                    cursor="pointer"
                    onClick={(data) => handleChartClick(data, 'employment')}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="weightedContribution"
                    fill="#2CD9FF"
                    name="Employed Students"
                    label={{ position: 'inside', fill: '#fff', fontSize: 11, fontFamily: 'Roboto' }}
                    cursor="pointer"
                    onClick={(data) => handleChartClick(data, 'employment')}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="employmentRate"
                    stroke="#f4c430"
                    name="Employment Rate (%)"
                    dot={{ fill: "#f4c430", r: 6 }}
                    label={{ position: 'top', fill: '#fff', fontSize: 11, fontFamily: 'Roboto' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="absolute right-6 top-16 w-[22%] bg-black/30 p-4 rounded-lg border-l-2 border-[#2AB1BB] pointer-events-none">
            <h4 className="text-white font-neo-sans-medium text-sm mb-3">Key Insights</h4>
            <div className="space-y-2">
              <div>
                <p className="text-[#2CD9FF] text-xs font-roboto">Highest Employment Rate</p>
                <p className="text-white text-sm font-roboto">{employabilityData[0]?.major}</p>
                <p className="text-[#FF6D6D] text-xs font-roboto">{employabilityData[0]?.employmentRate}% employed</p>
              </div>
              <div className="h-px bg-gray-700 my-2"></div>
              <div>
                <p className="text-[#2CD9FF] text-xs font-roboto">Average Employment Rate</p>
                <p className="text-white text-sm font-roboto">Across All Majors</p>
                <p className="text-[#FF6D6D] text-xs font-roboto">
                  {(employabilityData.reduce((acc, curr) => acc + curr.employmentRate, 0) / employabilityData.length).toFixed(1)}%
                </p>
              </div>
              <div className="h-px bg-gray-700 my-2"></div>
              <div>
                <p className="text-[#2CD9FF] text-xs font-roboto">Total Employed Students</p>
                <p className="text-white text-sm font-roboto">Across All Majors</p>
                <p className="text-[#FF6D6D] text-xs font-roboto">
                  78,022
                  {/* {employabilityData.reduce((acc, curr) => acc + curr.employedStudents, 0).toLocaleString()} */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    {/* </Grid> */}


              

      {/* Top ISCO Occupation Insights */ }
  <h2 className="text-xl md:text-2xl font-neo-sans-bold mb-4 flex items-center gap-3 mt-8" style={{ color: brandColors.primary.teal }}>
    <FaBuilding className="text-[#2AB1BB]" />
    Top Occupation Insights
  </h2>

  {/* Key Insights - ISCO Occupations */ }
      <div className="bg-gradient-to-r from-[#212E5E] to-[#2E6BB2] p-0 rounded-lg mb-4 border-l-4" style={{ borderColor: brandColors.primary.teal, height: 'fit-content' }}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-opacity-20" style={{ backgroundColor: `${brandColors.primary.teal}20` }}>
              <FaBriefcase className="text-xl" style={{ color: brandColors.primary.teal }} />
            </div>
            <h3 className="text-lg font-neo-sans-bold text-white">Key Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {/* <div className="bg-black/30 p-3 rounded-lg"> */}
            <div className="bg-black/30 p-0 rounded-lg flex flex-col gap-1 items-center">
            <DollarSign className="h-4 w-4 text-pink-600" />
              <p className="text-xs text-blue-600">Highest ROI Major</p>
              <h3 className="text-lg text-white font-bold">Health and Welfare</h3>
              {/* <ArrowUpIcon className="h-4 w-4 text-red-500" /> */}
              <span className="text-xs text-green-600 ">  54% Employment Rate</span>
              <span className="text-xs text-green-600 ">  Highest avg. salary ($3,818)</span>
            </div>
            <div className="bg-black/30 p-0 rounded-lg flex flex-col gap-1 items-center">
              <Users className="h-4 w-4 text-pink-600" />
              <p className="text-xs text-purple-600">Most Gender-Skewed Field</p>
              <h3 className="text-lg text-white font-bold">Agriculture & Forestry</h3>
              <div className="flex items-center pt-1">
            {/* <ArrowUpIcon className="h-4 w-4 text-red-500" /> */}
            <span className="text-xs text-green-600 ">
              95.6% gender gap (97.8% male)
            </span>
          </div>

            </div>
            <div className="bg-black/30 p-0 rounded-lg flex flex-col gap-1 items-center">
              <GraduationCap className="h-6 w-6 text-pink-600" />
              <p className="text-xs text-pink-600">Versatile Degree</p>
              <h3 className="text-lg text-white font-bold">Business Admin</h3>
              <p className="text-xs text-green-600">Appears in most roles</p>
            </div>
            <div className="bg-black/30 p-0 rounded-lg flex flex-col gap-1 items-center">
              <ArrowUpIcon className="h-6 w-6 text-pink-600" />
              <p className="text-xs text-yellow-600">Highest Employability</p>
              <h3 className="text-lg text-white font-bold">Engineering</h3>
              <p className="text-xs text-green-600"> 61.1% employment rate</p>
            </div>
            <div className="bg-black/30 p-0 rounded-lg flex flex-col gap-1 items-center">
              <GraduationCap className="h-6 w-6 text-pink-600" />
              <p className="text-xs text-blue-600">Market Leader</p>
              <h3 className="text-lg text-white font-bold">Business & Law</h3>
              <p className="text-xs text-green-600">  179,447 graduates (51.4% female)</p>
            </div>
          </div>
          
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Occupations by Graduates */}
        <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>
          <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
            <FaUserGraduate className="text-[#2AB1BB]" />
            TOP 5 OCCUPATIONS BY GRADUATES
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={iscoByGraduates.rankings.slice(0, 5)}
                layout="vertical"
                margin={{ top: 10, right: 60, left: 0, bottom: 20 }}
                barGap={-2}
                onClick={(data) => {
                  if (data && data.activePayload?.[0]) {
                    handleOccupationClick(data.activePayload[0].payload.occupation);
                  }
                }}
                >
              
                <defs>
                  <linearGradient id="occupationGradient" x1="0" y1="0" x2="1" y2="0">
                    {/* <stop offset="0%" stopColor={brandColors.primary.navy} stopOpacity={0.8}/> */}
                    <stop offset="100%" stopColor="#4adad3" stopOpacity={0.8}/>
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <XAxis 
                  type="number" 
                  label={{ value: 'NUMBER OF GRADUATES', position: 'bottom', fill: '#fff', offset: 5 }}
                  tick={{ fill: '#fff' ,fontSize: 12, fontFamily: 'Roboto'}}
                />
                <YAxis 
                  dataKey="occupation" 
                  type="category"
                  width={180}
                  tick={{ fill: '#fff' ,fontSize: 12, fontFamily: 'Roboto'}}
                />
                {/* <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload &&
                    payload && payload.length) {
                      return (
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded shadow">
                        <p className="text-gray-900">{payload[0].payload.name}</p>
                        <p className="text-gray-600">Average Salary: {payload[0].value?.toLocaleString() ?? 0} SAR</p>
                      </div>
                      );
                    }
                    return null;
                  }}
                /> */}
                <Bar 
                  dataKey="value" 
                //   fill="url(#occupationGradient)"
                //   onClick={(data) => {
                //   if (data && data.activePayload?.[0]) {
                //     handleOccupationClick(data.activePayload[0].payload.occupation);
                //   }
                 
                // }}
                onClick={(data) => {
                  if (data && data.activePayload?.[0]) {
                    handleOccupationClick(data.activePayload[0].payload.occupation);
                  }
                }}
                  cursor="pointer"
                  label={{ 
                    position: 'right', 
                    fill: '#fff',
                    fontSize: 11,
                    fontFamily: 'Roboto',
                    formatter: (value: FormatterValue) => {
                      if (typeof value?.toLocaleString === 'function') {
                        return value.toLocaleString();
                      }
                      return value?.value?.toString() || '';
                    },
                    style: { filter: 'url(#shadow)' }
                  }}
                  shape={(props: BarProps) => {
                    const { x, y, width, height = 0 } = props;
                      return (
                      <g>
                        {/* Background with rounded corners */}
                        <rect
                          x={x}
                          y={Number(y) + height * 0.1}
                          width={width}
                          height={height * 0.8}
                          rx={height * 0.4}
                          ry={height * 0.4}
                          fill="url(#occupationGradient)"
                          filter="url(#shadow)"
                        />
                        {/* Shine effect */}
                        <rect
                          x={x}
                          y={Number(y) + height * 0.1}
                          width={width}
                          height={height * 0.2}
                          rx={height * 0.1}
                          ry={height * 0.1}
                          fill="#ffffff20"
                        />
                      </g>
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Paying Occupations */}
        <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>
          <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
            <FaMoneyBillAlt className="text-[#2AB1BB]" />
            TOP PAYING OCCUPATIONS BY AVERAGE SALARY
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="90%" height="100%">
              <RadialBarChart
                innerRadius="100%"
                outerRadius="30%"
                data={iscoByAverageSalary.rankings.slice(0, 5).map((item, index) => ({
                  name: item.occupation,
                  value: item.value,
                  fill: ['#0F75BC', '#45B7A9', '#bb772a','#cf8b97','#acabb6'][4 - index],
                  occupation: item.occupation,
                }))}
                onClick={(data) => {
                  
                    handleOccupationClick(data?.activePayload?.[0]?.payload?.occupation);
                  
                }}
                startAngle={-90}
                endAngle={270}
                cx="30%"
                cy="50%"
              >
                <RadialBar
                  // minAngle={15}
                  background={{ fill: '#ffffff10' }}
                  label={{
                    position: 'insideStart',
                    fill: '#fff',
                    formatter: (value: FormatterValue) => {
                      if (typeof value?.toLocaleString === 'function') {
                        return value.toLocaleString();
                      }
                      return value?.value?.toString() || '';
                    },
                    fontFamily: 'Roboto'
                  }}
                  dataKey="value"
                  cornerRadius={30}
                  // onClick={(data) => {

                  //   if (data && data.activePayload?.[0]) {

                  //     handleOccupationClick(data.activePayload[0].payload.occupation);

                  //   }

                  // }}

                  // // onClick={(data: { name: string }) => handleOccupationClick(data.name)}

                  // cursor="pointer"

                />
                {/* <text x="50%" y="50%" textAnchor="middle" dominantBaseline="inner" className="text-sm font-bold" fill="#fff">
                  Salary Range
                </text> */}
                {iscoByAverageSalary.rankings.slice(0, 5).map((item, index) => (
                  <text
                    key={index}
                    x="100%"
                    y={`${30 + index * 10}%`}
                    textAnchor="end"
                    fill={['#0F75BC', '#45B7A9', '#bb772a','#cf8b97','#acabb6'][4 - index]}
                    className="text-xs"
                  >
                    {item.occupation}: {item.value.toLocaleString()} SAR
                  </text>
                ))}
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0]) {
                      return (
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded shadow">
                        <p className="text-gray-900">{payload[0].payload.name}</p>
                        {/* <p className="text-gray-600">Average Salary: {payload[0].value.toLocaleString()} SAR</p> */}
                      </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
      </div>

  {/* Employment and Salary Distribution */ }
  {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> */ }
  {/* Employment Timing Distribution */ }
  {/* <div> */ }
        <h2 className="text-xl md:text-2xl font-neo-sans-bold mb-4 flex items-center gap-3 mt-8" style={{ color: brandColors.primary.teal }}>
        <FaClock className="text-[#2AB1BB]" />
        Employment Timing Distribution
        {/* <span className="text-lg font-normal text-gray-400">(رؤى المهن الرئيسية)</span> */}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaClock className="text-[#2AB1BB]" />
              TIME TO EMPLOYMENT
            </h3>
            <div className="flex flex-col h-[calc(100%-2rem)] justify-between">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-[95%]">
                {/* Chart */}
                <div className="lg:col-span-2 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={10}
                        dataKey="value"
                        onClick={(data) => handleTimingClick(data.name)}
                        cursor="pointer"
                        label={({ percentage }) => `${percentage}%`}
                        labelLine={false}
                        animationBegin={0}
                        animationDuration={1500}
                        animationEasing="ease-out"
                        fontFamily="Roboto"
                        // labelStyle={{ fontFamily: 'Roboto' }}
                      >
                        {timingData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            className="transition-all duration-300 hover:opacity-80 hover:scale-105"
                          />
                        ))}
                      </Pie>
                      
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-white text-lg font-medium">Average</p>
                    <p className="text-[#0F75BC] text-2xl font-bold animate-pulse">{averageTimeToEmployment} days</p>
                  </div>
                </div>
                {/* Legends */}
                <div className="lg:col-span-10 flex items-center justify-center mr-15">
                  <div className="flex flex-row gap-0 space-x-1 space-y-1 w-[100%] h-[100%]">
                    {timingData.map((item) => (
                      <div 
                        key={item.name} 
                        className="flex flex-col items-center gap-1 cursor-pointer bg-black/30 p-2 rounded-lg border border-white/10 transition-all duration-300 hover:bg-black/50 hover:border-white/30"
                        onClick={() => handleTimingClick(item.name)}
                      >
                        <div className="w-3 h-3 rounded-full transition-transform duration-300 hover:scale-125" style={{ backgroundColor: item.color }} />
                        <span className="text-white text-sm font-roboto">{item.name}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[#0F75BC] font-medium">{item.value.toLocaleString()}</span>
                          <span className="text-[#45B7A9]">({item.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </Card>
          

          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>
          <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
            <FaClock className="text-[#2AB1BB]" />
            TOP GENERAL MAJORS BY EMPLOYMENT TIMING
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.OverViewInsights.employmentTiming.byGeneralMajor}
                onClick={(data) => {
                  if (data && data.activePayload?.[0]?.payload) {
                    handleTimingClick(data.activePayload[0].payload.timing);
                  }
                }}
                // onClick={(data) => handleTimingClick(data.name)}
                // cursor="pointer"
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2e365f" horizontal={false} />
                <XAxis 
                  type="number" 
                  label={{ value: 'PERCENTAGE (%)', position: 'bottom', fill: '#fff', offset: 0 }}
                  tick={{ fill: '#fff' ,fontSize: 12, fontFamily: 'Roboto'}}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  width={150}
                  tick={{ fill: '#fff' ,fontSize: 12, fontFamily: 'Roboto'}}
                />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                        <p className="text-white font-medium">{label}</p>
                        {payload.map((entry) => (
                          <p key={entry.name} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}%
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }} />
                <RechartsLegend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ 
                    position: 'absolute',
                    top: '-10px',
                    right: '0px',
                    paddingBottom: '12px',
                  }}
                  content={() => (
                    <div style={{ display: 'flex', gap: '16px', paddingLeft: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#0F75BC', borderRadius: '4px' }}></div>
                        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>Pre-Graduation</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#45B7A9', borderRadius: '4px' }}></div>
                        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>Within First Year</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#FFE5A3', borderRadius: '4px' }}></div>
                        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>After First Year</span>
                      </div>
                    </div>
                  )}
                />
                <Bar 
                  dataKey="preGraduation.percentage" 
                  name="Pre-Graduation"
                  fill="#0F75BC"
                  barSize={10}
                >
                  <LabelList dataKey="preGraduation.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={10} fontFamily="Roboto" />
                </Bar>
                <Bar 
                  dataKey="withinYear.percentage" 
                  name="Within First Year"
                  fill="#45B7A9"
                  barSize={10}
                >
                  <LabelList dataKey="withinYear.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={10} fontFamily="Roboto" />
                </Bar>
                <Bar 
                  dataKey="afterYear.percentage" 
                  name="After First Year"
                  fill="#FFE5A3"
                  barSize={10}
                >
                  <LabelList dataKey="afterYear.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={10} fontFamily="Roboto" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

          {/* Top Education Level by Employment Timing */}
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>
          <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
            <FaClock className="text-[#2AB1BB]" />
            TOP EDUCATION LEVEL BY EMPLOYMENT TIMING
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.OverViewInsights.employmentTiming.byEducationLevel}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                barGap={0}
                onClick={(data) => {
                  if (data && data.activePayload?.[0]?.payload) {
                    handleTimingClick(data.activePayload[0].payload.timing);
                  }
                }}
                // onClick={(data) => handleTimingClick(data.name)}
                // cursor="pointer"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2e365f" horizontal={false} />
                <XAxis 
                  type="number" 
                  label={{ value: 'PERCENTAGE (%)', position: 'bottom', fill: '#fff', offset: 0 }}
                  tick={{ fill: '#fff' ,fontSize: 12, fontFamily: 'Roboto'}}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  dataKey="level" 
                  type="category"
                  width={150}
                  tick={{ fill: '#fff' ,fontSize: 12, fontFamily: 'Roboto'}}
                />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                        <p className="text-white font-medium">{label}</p>
                        {payload.map((entry) => (
                          <p key={entry.name} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}%
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }} />
                <RechartsLegend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ 
                    position: 'absolute',
                    top: '-10px',
                    right: '0px',
                    paddingBottom: '12px',
                  }}
                  content={() => (
                    <div style={{ display: 'flex', gap: '16px', paddingLeft: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#0F75BC', borderRadius: '4px' }}></div>
                        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>Pre-Graduation</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#45B7A9', borderRadius: '4px' }}></div>
                        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>Within First Year</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#ac4863', borderRadius: '4px' }}></div>
                        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>After First Year</span>
                      </div>
                    </div>
                  )}
                />
                <Bar 
                  dataKey="preGraduation.percentage" 
                  name="Pre-Graduation"
                  fill="#0F75BC"
                  barSize={10}
                >
                  <LabelList dataKey="preGraduation.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={10} fontFamily="Roboto" />
                </Bar>
                <Bar 
                  dataKey="withinYear.percentage" 
                  name="Within First Year"
                  fill="#45B7A9"
                  barSize={10}
                >
                  <LabelList dataKey="withinYear.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={10} fontFamily="Roboto" />
                </Bar>
                <Bar 
                  dataKey="afterYear.percentage" 
                  name="After First Year"
                  fill="#ac4863"
                  barSize={10}
                >
                  <LabelList dataKey="afterYear.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={10} fontFamily="Roboto" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        </div>
  {/* </div> */ }

  {/* Salary Distribution */ }
  {/* <div> */ }
        <h2 className="text-xl md:text-2xl font-neo-sans-bold mb-4 flex items-center gap-3 mt-8" style={{ color: brandColors.primary.teal }}>
        <FaDollarSign className="text-[#2AB1BB]" />
        Salary Distribution
        {/* <span className="text-lg font-normal text-gray-400">(رؤى المهن الرئيسية)</span> */}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaMoneyBillAlt className="text-[#2AB1BB]" />
              SALARY RANGES
            </h3>
            <div className="flex flex-col h-[calc(100%-2rem)] justify-between">
              <div className="h-[75%] relative">
                {/* Chart */}
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={salaryData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                    >
                      <defs>
                        {salaryData.map((entry, index) => (
                          <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3cb0aa" stopOpacity={0.8}/>
                            {/* <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.8}/> */}
                          </linearGradient>
                        ))}
                      </defs>
                      <XAxis
                        dataKey="range"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: '#fff' ,fontSize: 12, fontFamily: 'Roboto'}}
                        interval={0}
                      />
                      <YAxis 
                        yAxisId="left"
                        orientation="left"
                        stroke="#fff"
                        tick={{ fill: '#fff' , fontSize: 12, fontFamily: 'Roboto'}}
                        label={{ value: 'NO. OF GRADUATES', angle: -90, position: 'left', fill: '#fff',Offset: -30 }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="#fff"
                        tick={{ fill: '#fff' }}
                        label={{ value: 'PERCENTAGE', angle: 90, position: 'right', fill: '#fff',Offset: 10 }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length && payload[0]) {
                            return (
                              <div className="bg-white/90 backdrop-blur-sm p-2 rounded shadow">
                                <p className="text-gray-900">{payload[0].payload.range}</p>
                                <p className="text-gray-600">Graduates: {payload[0].payload.count}</p>
                                <p className="text-gray-600">Percentage: {payload[0].payload.percentage}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="count"
                        yAxisId="left"
                        radius={[20, 20, 0, 0]}
                        onClick={(data) => handleSalaryClick(data.range)}
                        cursor="pointer"
                        label={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                      >
                        {salaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                        ))}
                      </Bar>
                      <Line
                        dataKey="percentage"
                        yAxisId="right"
                        stroke="#FFD700"
                        strokeWidth={3}
                        dot={{ fill: "#FFD700", r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="h-[25%] mt-2">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                  {/* <div className="bg-black/30 p-2 rounded-lg border border-white/10 transition-all duration-300 hover:bg-black/50 hover:border-white/30 cursor-pointer">
                    <p className="text-gray-400 text-sm font-roboto">Median Salary</p>
                    <div className="flex items-center justify-between"> */}
                      {/* <p className="text-lg font-bold text-[#0F75BC]">SAR {medianSalary.toLocaleString()}</p> */}
                      {/* <div className="flex-1 ml-4">
                        <div className="w-full bg-gray-700 rounded-full h-2"> */}
                          {/* <div 
                            className="bg-[#0F75BC] h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${(medianSalary / Math.max(...salaryData.map(d => {
                                const rangeEnd = d.range.split('-')[1];
                                return rangeEnd ? parseInt(rangeEnd.replace(/[^\d]/g, '')) : 0;
                              }))) * 100}%` 
                            }}
                          /> */}
                        {/* </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="bg-black/30 p-2 rounded-lg border border-white/10 transition-all duration-300 hover:bg-black/50 hover:border-white/30 cursor-pointer">
                    <p className="text-gray-400 text-sm font-roboto">Most Common Range</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-[#FFE5A3]">
                        SAR {salaryData.reduce((prev, current) => 
                          prev.percentage > current.percentage ? prev : current
                        ).range}
                      </p>
                      <div className="flex-1 ml-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-[#FFE5A3] h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.max(...salaryData.map(d => d.percentage))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
  

          {/* Top General Major by Salary Distribution */}
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-[#2AB1BB]" />
              TOP GENERAL MAJOR BY SALARY DISTRIBUTION
            </h3>
            <div className="h-[300px]" style={{marginTop: '50px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockData.OverViewInsights.salaryDistribution.byGeneralMajor}
                  layout="vertical"
                  margin={{ top:10, right: 20, left: 20, bottom: 20 }}
                  barGap={0}
                  // barsize={12}
                  onClick={(data) => {
                    if (data && data.activePayload?.[0]?.payload) {
                      handleSalaryClick(data.activePayload[0].payload.salary);
                    }
                  }}
                  // onClick={(data) => handleSalaryClick(data.range)}
                  // cursor="pointer"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e365f" horizontal={false} />
                  <XAxis 
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    width={180}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                            <p className="text-white font-medium">{payload[0].payload.name}</p>
                            <div className="mt-1">
                              {payload.map((entry) => (
                                <p key={entry.name} style={{ color: entry.color }}>
                                  {entry.name}: {entry.value}%
                                </p>
                              ))}
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-700">
                              {/* <p className="text-[#45B7A9]">
                                Average: {payload[0].payload.averageSalary.toLocaleString()} SAR
                              </p> */}
                              {/* <p className="text-[#FFE5A3]">
                                Median: {payload[0].payload.medianSalary.toLocaleString()} SAR
                              </p> */}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <RechartsLegend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ 
                      position: 'absolute',
                      top: '-10px',
                      right: '0px',
                      paddingBottom: '12px',
                    }}
                    content={() => (
                      <div style={{ display: 'flex', gap: '5px', paddingLeft: '0px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#1F5B62', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>0-2000</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#777586', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>2001-2500</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#0F75BC', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>2501-3000</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#ab4e52', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>3001+</span>
                        </div>
                      </div>
                    )}
                  />
                  <Bar 
                    dataKey="ranges.0-2000.percentage" 
                    name="0-2000"
                    // stackId="salary"
                    fill="#1F5B62"
                    barSize={10}
                  >
                    <LabelList dataKey="ranges.0-2000.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={8} fontFamily="Roboto" />
                  </Bar>
                  <Bar 
                    dataKey="ranges.2001-2500.percentage" 
                    name="2001-2500"
                    // stackId="salary"
                    fill="#777586"
                    barSize={10}
                  >
                    <LabelList dataKey="ranges.2001-2500.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={8} fontFamily="Roboto" />
                  </Bar>
                  <Bar 
                    dataKey="ranges.2501-3000.percentage" 
                    name="2501-3000"
                    // stackId="salary"
                    fill="#0F75BC"
                    barSize={10}
                  >
                    <LabelList dataKey="ranges.2501-3000.percentage" position="right" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={8} fontFamily="Roboto" />
                  </Bar>
                  <Bar 
                    dataKey="ranges.3001+.percentage" 
                    name="3001+"
                    // stackId="salary"
                    fill="#ab4e52"
                    barSize={10}
                  >
                     <LabelList dataKey="ranges.3001+.percentage" position="inside" fill="#fff" formatter={(value: number) => `${value}%`} fontSize={8} fontFamily="Roboto" />
                    {/* <LabelList dataKey="ranges.15001+.percentage" position="center" fill="#fff" formatter={(value: LabelListProps) => value.value > 5 ? `${value.value}%` : ''} fontSize={12} /> */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>
            <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-[#2AB1BB]" />
              TOP EDUCATION LEVEL BY SALARY DISTRIBUTION
            </h3>
            <div className="h-[300px]" style={{marginTop: '40px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockData.OverViewInsights.salaryDistribution.byEducationLevel}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                  barGap={4}
                  barSize={12}
                  onClick={(data) => {
                    if (data && data.activePayload?.[0]?.payload) {
                      handleSalaryClick(data.activePayload[0].payload.salary);
                    }
                  }}
                  // onClick={(data) => handleSalaryClick(data.range)}
                  // cursor="pointer"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e365f" horizontal={false} />
                  <XAxis 
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    dataKey="level" 
                    type="category"
                    width={150}
                    tick={{ fill: '#fff', fontSize: 12, fontFamily: 'Roboto' }}
                  />
                  <Tooltip content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                          <p className="text-white font-medium">{label}</p>
                          <div className="mt-1">
                            {payload.map((entry) => (
                              <p key={entry.name} style={{ color: entry.color }}>
                                {entry.name}: {entry.value}%
                              </p>
                            ))}
                          </div>
 <div className="mt-2 pt-2 border-t border-gray-700">
                            {/* <p className="text-[#45B7A9]">
                              Average: {payload[0].payload.averageSalary.toLocaleString()} SAR
                            </p> */}
                            {/* <p className="text-[#FFE5A3]">
                              Median: {payload[0].payload.medianSalary.toLocaleString()} SAR
                            </p> */}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <RechartsLegend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ 
                      position: 'absolute',
                      top: '-10px',
                      right: '0px',
                      paddingBottom: '12px',
                    }}

                    content={() => (
                      <div style={{ display: 'flex', gap: '5px', paddingLeft: '0px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#0F75BC', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>0-2000</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#45B7A9', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>2001-2500</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#777586', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>2501-3000</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '20px', height: '20px', backgroundColor: '#FF9F9F', borderRadius: '4px' }}></div>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'Roboto' }}>3001+</span>
                        </div>
                      </div>
                    )}
                  />
                  <Bar 
                    dataKey="ranges.0-2000.percentage" 
                    name="0-2000"
                    stackId="salary"
                    fill="#0F75BC"
                    barSize={10}
                  >
                    <LabelList dataKey="ranges.0-2000.percentage" position="center" fill="#fff" formatter={(value: number) => value > 5 ? `${value}%` : ''} fontSize={10} fontFamily="Roboto" />
                  </Bar>
                  <Bar 
                    dataKey="ranges.2001-2500.percentage" 
                    name="2001-2500"
                    stackId="salary"
                    fill="#45B7A9"
                    barSize={10}
                  >
                    <LabelList dataKey="ranges.2001-2500.percentage" position="center" fill="#fff" formatter={(value: number) => value > 5 ? `${value}%` : ''} fontSize={10} fontFamily="Roboto" />
                  </Bar>
                  <Bar 
                    dataKey="ranges.2501-3000.percentage" 
                    name="2501-3000"
                    stackId="salary"
                    fill="#777586"
                    barSize={10}
                  >
                    <LabelList dataKey="ranges.2501-3000.percentage" position="center" fill="#fff" formatter={(value: number) => value > 5 ? `${value}%` : ''} fontSize={10} fontFamily="Roboto" />
                  </Bar>
                  <Bar 
                    dataKey="ranges.3001+.percentage" 
                    name="3001+"
                    stackId="salary"
                    fill="#FF9F9F"
                    barSize={10}
                  >
                    <LabelList dataKey="ranges.3001+.percentage" position="center" fill="#fff" formatter={(value: number) => value > 5 ? `${value}%` : ''} fontSize={10} fontFamily="Roboto" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0000] rounded-xl shadow-lg p-4"
        >
          <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
            Chord Diagram 1
          </h3>
          <div className="aspect-square">
            <ChordDiagram 
              data={educationData} 
              selectedMajor={selectedMajor}
              onMajorSelect={setSelectedMajor}
            />
          </div>
        </motion.div>

            </Card>

            <Card className="p-4 rounded-lg shadow-lg border-t-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(42,177,187,0.8)] hover:border-[#2AB1BB] hover:-translate-y-1 cursor-pointer active:translate-y-0 group"
          style={{
            background: brandColors.primary.navy,
            borderColor: brandColors.primary.teal
          }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0000] rounded-xl shadow-lg p-4"
        >
          <h3 className="text-base md:text-lg font-neo-sans-medium text-gray-200 mb-2 md:mb-4 flex items-center gap-2">
            Chord Diagram 2
          </h3>          
          <div className="aspect-square">
            <MajorsEducationChord 
              data={educationData} 
              selectedMajor={selectedMajor}
              onMajorSelect={setSelectedMajor}
            />
          </div>
        </motion.div>

            </Card>
        </div > */}


    </div>
  );
};

<style jsx>{`
  .recharts-text {
    font-family: 'Roboto', sans-serif !important;
  }
  .recharts-legend-item-text {
    font-family: 'Roboto', sans-serif !important;
  }
  .recharts-cartesian-axis-tick-value {
    font-family: 'Roboto', sans-serif !important;
  }
  .recharts-label {
    font-family: 'Roboto', sans-serif !important;
  }
`}</style>
