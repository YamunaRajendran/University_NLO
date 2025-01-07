'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FilterOptions,
  ChartDataItem,
  GenderDistributionItem,
  SummaryCards,
  SalaryDistributionItem,
  EmploymentTimelineItem,
  EmploymentTimingItem,
  GenderGapRanking
} from './types';

import {
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import educationData from './education_mock/edu_data.json';

 
import TopNarrowMajorsChart from './components/TopNarrowMajorsChart';
import TopEmployableNarrowMajorsChart from './components/TopEmployableNarrowMajorsChart';
import TopPaidNarrowMajorsChart from './components/TopPaidNarrowMajorsChart';
import GenderDistributionChart from './components/GenderDistributionChart';
import SalaryDistributionChart from './components/SalaryDistributionChart';
import EmploymentTimingChart from './components/EmploymentTimingChart';
import EmploymentTimelineChart from './components/EmploymentTimelineChart';
import GenderGapRankingChart from './components/GenderGapRankingChart';
import TopOccupationsGenderGapChart from './components/TopOccupationsGenderGapChart';

// Get education levels from the data
const educationLevels = educationData.educationInsights.overall.basicMetrics
  .map(item => item.educationLevel)
  .filter(level => level !== 'Unclassified');

// Add this new component for the Education Level buttons
const EducationLevelButtons = ({ 
  educationLevels, 
  selectedLevel, 
  onSelect 
}: { 
  educationLevels: string[], 
  selectedLevel: string | null,
  onSelect: (level: string) => void 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center font-neo-sans-medium">
      {educationLevels.map((level) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
            ${selectedLevel === level
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-2 border-indigo-400' 
              : 'bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 text-white/80 hover:bg-[#151d3b] hover:text-white hover:shadow-md border-2 border-transparent'
            }`}
        >
          {level}
        </button>
      ))}
      {selectedLevel && (
        <button
          onClick={() => onSelect('ALL_LEVELS')}
          className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
            bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-md hover:from-red-700 hover:to-red-800"
        >
          Clear Selection
        </button>
      )}
    </div>
  );
};

export default function EducationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EducationPageContent />
    </Suspense>
  );
}

function EducationPageContent() {
  const [filters, setFilters] = useState<FilterOptions>({
    generalMajor: null,
    narrowMajor: null,
    specificMajor: null
  });

  const searchParams = useSearchParams();

  // Read URL parameters and set initial filter state
  useEffect(() => {
    const level = searchParams.get('level');
    if (level) {
      setFilters(prev => ({
        ...prev,
        generalMajor: decodeURIComponent(level)
      }));
    }
  }, [searchParams]);

  // Handle education level selection
  const handleEducationLevelChange = (value: string) => {
    setFilters({
      generalMajor: value === 'ALL_LEVELS' ? null : value,
      narrowMajor: null,
      specificMajor: null
    });
  };

  // Get data for the most popular education levels
  const getTopNarrowMajorsData = (generalMajor: string | null): ChartDataItem[] => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      return educationData.educationInsights.overall.topInsights.mostPopular
        .filter(item => item.educationLevel !== 'Unclassified')
        .map(item => ({
          narrowMajor: item.educationLevel,
          value: item.graduates,
          percentage: item.percentage
        }));
    }
    
    const educationLevelData = educationData.educationInsights.overall.basicMetrics.find(
      item => item.educationLevel === generalMajor
    );
    
    return educationLevelData && educationLevelData.educationLevel !== 'Unclassified' ? [{
      narrowMajor: educationLevelData.educationLevel,
      value: educationLevelData.graduates,
      percentage: educationLevelData.graduatesPercentage
    }] : [];
  };

  // Get data for most employable education levels
  const getTopEmployableNarrowMajorsData = (generalMajor: string | null): ChartDataItem[] => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      return educationData.educationInsights.overall.topInsights.mostEmployable
        .filter(item => item.educationLevel !== 'Unclassified')
        .map(item => ({
          narrowMajor: item.educationLevel,
          value: item.employmentRate,
          graduates: item.graduates
        }));
    }
    
    const educationLevelData = educationData.educationInsights.overall.basicMetrics.find(
      item => item.educationLevel === generalMajor
    );
    
    return educationLevelData && educationLevelData.educationLevel !== 'Unclassified' ? [{
      narrowMajor: educationLevelData.educationLevel,
      value: educationLevelData.employmentRate,
      graduates: educationLevelData.graduates
    }] : [];
  };

  // Get data for highest paid education levels
  const getTopPaidNarrowMajorsData = (generalMajor: string | null): ChartDataItem[] => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      return educationData.educationInsights.overall.topInsights.highestPaying
        .filter(item => item.educationLevel !== 'Unclassified')
        .map(item => ({
          narrowMajor: item.educationLevel,
          value: item.averageSalary,
          graduates: item.graduates
        }));
    }
    
    const educationLevelData = educationData.educationInsights.overall.basicMetrics.find(
      item => item.educationLevel === generalMajor
    );
    
    return educationLevelData && educationLevelData.educationLevel !== 'Unclassified' ? [{
      narrowMajor: educationLevelData.educationLevel,
      value: educationLevelData.averageSalary,
      graduates: educationLevelData.graduates
    }] : [];
  };

  // Get gender distribution data from genderGap rankings
  const getGenderDistributionData = (generalMajor: string | null): GenderDistributionItem[] => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      const rankings = educationData.educationInsights.overall.genderGap.rankings
        .filter(item => item.educationLevel !== 'Unclassified');
      
      // Calculate totals
      const totalGraduates = rankings.reduce((sum, item) => sum + item.graduates, 0);
      const totalMaleCount = rankings.reduce((sum, item) => sum + (item.malePercentage * item.graduates) / 100, 0);
      const totalFemaleCount = rankings.reduce((sum, item) => sum + (item.femalePercentage * item.graduates) / 100, 0);
      
      const malePercentage = (totalMaleCount / totalGraduates) * 100;
      const femalePercentage = (totalFemaleCount / totalGraduates) * 100;
      
      return [{
        generalMajor: 'All Levels',
        male: {
          count: totalMaleCount,
          percentage: malePercentage
        },
        female: {
          count: totalFemaleCount,
          percentage: femalePercentage
        },
        genderGap: femalePercentage - malePercentage
      }];
    }
    
    const educationLevelData = educationData.educationInsights.overall.genderGap.rankings.find(
      item => item.educationLevel === generalMajor
    );
    
    if (!educationLevelData || educationLevelData.educationLevel === 'Unclassified') return [];

    return [{
      generalMajor: educationLevelData.educationLevel,
      male: {
        count: (educationLevelData.malePercentage * educationLevelData.graduates) / 100,
        percentage: educationLevelData.malePercentage
      },
      female: {
        count: (educationLevelData.femalePercentage * educationLevelData.graduates) / 100,
        percentage: educationLevelData.femalePercentage
      },
      genderGap: educationLevelData.genderGap
    }];
  };

  // Get gender gap ranking data
  const getGenderGapRankingData = (generalMajor: string | null): GenderGapRanking[] => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      return educationData.educationInsights.overall.genderGap.rankings
        .filter(item => item.educationLevel !== 'Unclassified')
        .sort((a, b) => Math.abs(b.genderGap) - Math.abs(a.genderGap));
    }
    
    const educationLevelData = educationData.educationInsights.overall.genderGap.rankings.find(
      item => item.educationLevel === generalMajor
    );
    
    return educationLevelData && educationLevelData.educationLevel !== 'Unclassified' ? [educationLevelData] : [];
  };

  // Get salary distribution data
  const getSalaryDistributionData = (generalMajor: string | null): SalaryDistributionItem[] => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      return educationData.educationInsights.overall.salaryDistribution
        .filter(item => item.educationLevel !== 'Unclassified');
    }
    
    const educationLevelData = educationData.educationInsights.overall.salaryDistribution.find(
      item => item.educationLevel === generalMajor
    );
    
    return educationLevelData && educationLevelData.educationLevel !== 'Unclassified' ? [educationLevelData] : [];
  };

  // Get employment timing data
  const getEmploymentTimingData = (generalMajor: string | null): EmploymentTimingItem[] => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      // Calculate overall totals
      const allData = educationData.educationInsights.overall.employmentTiming
        .filter(item => item.educationLevel !== 'Unclassified');
      
      const totalBeforeGrad = allData.reduce((sum, item) => sum + item.beforeGraduation.count, 0);
      const totalWithinYear = allData.reduce((sum, item) => sum + item.withinYear.count, 0);
      const totalAfterYear = allData.reduce((sum, item) => sum + item.afterYear.count, 0);
      const totalCount = totalBeforeGrad + totalWithinYear + totalAfterYear;

      const overallData = {
        educationLevel: 'Overall',
        beforeGraduation: {
          count: totalBeforeGrad,
          percentage: Math.round((totalBeforeGrad / totalCount) * 100)
        },
        withinYear: {
          count: totalWithinYear,
          percentage: Math.round((totalWithinYear / totalCount) * 100)
        },
        afterYear: {
          count: totalAfterYear,
          percentage: Math.round((totalAfterYear / totalCount) * 100)
        }
      };

      return [overallData, ...allData];
    }
    
    const educationLevelData = educationData.educationInsights.overall.employmentTiming.find(
      item => item.educationLevel === generalMajor
    );
    
    return educationLevelData && educationLevelData.educationLevel !== 'Unclassified' ? [educationLevelData] : [];
  };

  // Get employment timeline data
  const getEmploymentTimelineData = (generalMajor: string | null): EmploymentTimelineItem[] => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      return educationData.educationInsights.overall.employmentTimeline
        .filter(item => item.educationLevel !== 'Unclassified');
    }
    
    const educationLevelData = educationData.educationInsights.overall.employmentTimeline.find(
      item => item.educationLevel === generalMajor
    );
    
    return educationLevelData && educationLevelData.educationLevel !== 'Unclassified' ? [educationLevelData] : [];
  };

  // Get summary metrics based on selected education level
  const getSummaryCards = (generalMajor: string | null): SummaryCards => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      return {
        totalGraduates: educationData.educationInsights.totalMetrics.graduates || 0,
        employmentRate: educationData.educationInsights.totalMetrics.employmentRate || 0,
        averageSalary: educationData.educationInsights.totalMetrics.averageSalary || 0,
        timeToEmployment: educationData.educationInsights.totalMetrics.timeToEmployment || 0,
        graduatesPercentage: educationData.educationInsights.totalMetrics.graduatesPercentage || 0,
      };
    }

    const educationLevelData = educationData.educationInsights.overall.basicMetrics.find(
      item => item.educationLevel === generalMajor
    );

    return {
      totalGraduates: educationLevelData?.graduates || 0,
      employmentRate: educationLevelData?.employmentRate || 0,
      averageSalary: educationLevelData?.averageSalary || 0,
      timeToEmployment: educationLevelData?.timeToEmployment || 0,
      graduatesPercentage: educationLevelData?.graduatesPercentage || 0,
    };
  };

  // Get current summary cards based on filters
  const summaryCards = getSummaryCards(filters.generalMajor);

  // Get top occupations by gender data
  const getTopOccupationsByGenderData = (generalMajor: string | null) => {
    if (!generalMajor || generalMajor === 'ALL_LEVELS') {
      return educationData.educationInsights.overall.topInsights.topOccupationsByGender;
    }

    // For specific education level, filter the data
    const maleOccupations = educationData.educationInsights.overall.topInsights.topOccupationsByGender.male
      .map(occ => ({
        ...occ,
        count: Math.round(occ.count * 0.7), // Simulating filtered data
        averageSalary: Math.round(occ.averageSalary * 0.9) // Simulating filtered data
      }));

    const femaleOccupations = educationData.educationInsights.overall.topInsights.topOccupationsByGender.female
      .map(occ => ({
        ...occ,
        count: Math.round(occ.count * 0.7), // Simulating filtered data
        averageSalary: Math.round(occ.averageSalary * 0.9) // Simulating filtered data
      }));

    return {
      male: maleOccupations,
      female: femaleOccupations
    };
  };


  return (
    <div className="space-y-6 p-4">
      <EducationLevelButtons
        educationLevels={educationLevels}
        selectedLevel={filters.generalMajor}
        onSelect={handleEducationLevelChange}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Graduates Card */}
        <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm font-['Roboto_Regular']">Total Graduates</div>
            <AcademicCapIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-white text-xl font-semibold">
            {summaryCards.totalGraduates.toLocaleString()}
          </div>
          <div className="text-gray-400 text-xs mt-1 font-['Roboto_Regular']">
            {summaryCards.graduatesPercentage}% of total
          </div>
        </div>

        {/* Employment Rate Card */}
        <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm font-['Roboto_Regular']">Employment Rate</div>
            <BriefcaseIcon className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-white text-xl font-['Neo_Sans_Bold']">
            {summaryCards.employmentRate}%
          </div>
        </div>

        {/* Average Salary Card */}
        <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm font-['Roboto_Regular']">Average Salary</div>
            <CurrencyDollarIcon className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-white text-xl font-['Neo_Sans_Bold']">
            {`${summaryCards.averageSalary.toLocaleString()} SAR`}
          </div>
        </div>

        {/* Time to Employment Card */}
        <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm font-['Roboto_Regular']">Average Time to Employment</div>
            <ClockIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-white text-xl font-['Neo_Sans_Bold']">
            {summaryCards.timeToEmployment} days
          </div>
        </div>
      </div>

      {/* Gender Distribution Section */}
      <h2 className="text-white text-xl font-['Neo_Sans_Bold'] mb-4">Gender Distribution</h2>
      <div className="grid grid-cols-3 gap-4 w-full mb-8">
        <div>
          <GenderDistributionChart
            generalMajor={filters.generalMajor}
            data={getGenderDistributionData(filters.generalMajor)}
          />
        </div>
        <div>
          <GenderGapRankingChart
            generalMajor={filters.generalMajor}
            data={getGenderGapRankingData(filters.generalMajor)}
          />
        </div>
        <div>
          <TopOccupationsGenderGapChart 
            data={getTopOccupationsByGenderData(filters.generalMajor)}
            generalMajor={filters.generalMajor}
          />
        </div>

        {/* <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
          <SalaryDistributionChart
            generalMajor={filters.generalMajor}
            data={getSalaryDistributionData(filters.generalMajor)}
          />
        </div> */}
      </div>

      {/* Education Level Insights */}
      <h2 className="text-white text-xl font-['Neo_Sans_Bold'] mb-4">
        {filters.generalMajor ? 'Education Level Insights' : 'General Education Level Insights'}
      </h2>
      <div className="grid grid-cols-3 gap-4 w-full mb-8">
        <div>
          <TopNarrowMajorsChart
            generalMajor={filters.generalMajor}
            data={getTopNarrowMajorsData(filters.generalMajor)}
          />
        </div>
        <div>
          <TopEmployableNarrowMajorsChart
            generalMajor={filters.generalMajor}
            data={getTopEmployableNarrowMajorsData(filters.generalMajor)}
          />
        </div>
        <div>
          <TopPaidNarrowMajorsChart
            generalMajor={filters.generalMajor}
            data={getTopPaidNarrowMajorsData(filters.generalMajor)}
          />
        </div>
      </div>

      {/* Employment Insights */}
      <h2 className="text-white text-xl font-['Neo_Sans_Bold'] mb-4">Employment Insights</h2>
      <div className="grid grid-cols-2 gap-4 w-full">
        <div>
          <EmploymentTimelineChart
            generalMajor={filters.generalMajor}
            data={getEmploymentTimelineData(filters.generalMajor)}
          />
        </div>
        <div>
          <EmploymentTimingChart
            generalMajor={filters.generalMajor}
            data={getEmploymentTimingData(filters.generalMajor)}
          />
        </div>

        <div>
          <SalaryDistributionChart
            title="Salary Distribution by Education Level"
            data={getSalaryDistributionData(filters.generalMajor)}
          />
        </div>

      </div>
    </div>
  );
}