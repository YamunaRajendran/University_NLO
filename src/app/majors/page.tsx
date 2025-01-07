'use client';

import React, { useState, useEffect, Suspense } from 'react';

import { useSearchParams } from 'next/navigation';
import { X, Users, Briefcase, DollarSign, Clock } from 'lucide-react'; // For close icon

import mockData from './major_mock/mock_data_major.json';
import TopNarrowMajorsChart from './components/TopNarrowMajorsChart';
import TopEmployableNarrowMajorsChart from './components/TopEmployableNarrowMajorsChart';
import TopPaidNarrowMajorsChart from './components/TopPaidNarrowMajorsChart';
import TopMajorsByPopularOccupationsChart from './components/TopMajorsByPopularOccupationsChart';
import TopMajorsByMostEmployedOccupationChart from './components/TopMajorsByMostEmployedOccupationChart';
import TopMajorsByHighestPaidOccupationChart from './components/TopMajorsByHighestPaidOccupationChart';
import AllMajorsGenderDistributionChart from './components/AllMajorsGenderDistributionChart';
import SalaryDistributionChart from './components/SalaryDistributionChart';
import EmploymentTimingChart from './components/EmploymentTimingChart';
import EmploymentTimelineChart from './components/EmploymentTimelineChart';
// import GraduateDistributionTreeMap from './components/GraduateDistributionTreeMap';
import TopMajorsGenderGapChart from './components/TopMajorsGenderGapChart';
import TopOccupationsGenderGapChart from './components/TopOccupationsGenderGapChart';
import GenderDistributionChart from './components/GenderDistributionChart';

interface MajorFilterOptions {
  generalMajor: string | null;
  narrowMajor: string | null;
  specificMajor: string | null;
}

interface OverallBasicMetric {
  generalMajor: string;
  graduates: number;
  graduatesPercentage: number;
  employmentRate: number;
  averageSalary: number;
  timeToEmployment: number;
}

interface NarrowBasicMetric {
  narrowMajor: string;
  graduates: number;
  graduatesPercentage: number;
  employmentRate: number;
  averageSalary: number;
  timeToEmployment: number;
}

type BasicMetric = OverallBasicMetric | NarrowBasicMetric;

interface SalaryDistribution {
  generalMajor?: string;
  narrowMajor?: string;
  occupation?: string;
  salary: number;
  percentage: number;
  median?: number;
}


interface GeneralMajor {
  name: string;
  overall: {
    basicMetrics: BasicMetric[];
    topOccupationsByIndustry: TopOccupationsByIndustry;
    topOccupationsInsights: TopOccupationsInsights;
    topMajorsByOccupation?: TopMajorsByOccupation;
    genderDistribution: GenderDistribution;
    employmentTiming: EmploymentTiming;
    employmentTimeline: EmploymentTimeline;
  };
  byNarrowMajor?: {
    narrowMajors: Array<{
      name: string;
      overall: {
        basicMetrics: BasicMetric[];
        topOccupationsByIndustry: TopOccupationsByIndustry;
        topOccupationsInsights: TopOccupationsInsights;
        topMajorsByOccupation?: TopMajorsByOccupation;
        genderDistribution: GenderDistribution;
        employmentTiming: EmploymentTiming;
        employmentTimeline: EmploymentTimeline;
      };
    }>;
  };
}

interface OccupationMetrics {
  graduates: number;
  employmentRate: number;
  averageSalary: number;
}

interface MajorDistribution {
  name: string;
  metrics: OccupationMetrics;
}

interface Occupation {
  name: string;
  metrics: OccupationMetrics;
  majorDistribution: MajorDistribution[];
}

interface TopMajorsByOccupation {
  occupations: Occupation[];
}

interface TopOccupationsByIndustry {
  industries: Array<{
    name: string;
    occupations: Array<{
      name: string;
      metrics: OccupationMetrics;
    }>;
  }>;
}

interface TopOccupationsInsights {
  mostPopular: Array<{
    occupation: string;
    graduates: number;
    percentage: number;
  }>;
  mostEmployable: Array<{
    occupation: string;
    employmentRate: number;
    graduates: number;
  }>;
  highestPaying: Array<{
    occupation: string;
    averageSalary: number;
    graduates: number;
  }>;
}


interface MajorsInsights {
  overall: {
    basicMetrics: BasicMetric[];
    topOccupationsByIndustry: TopOccupationsByIndustry;
    topOccupationsInsights: TopOccupationsInsights;
    topMajorsByOccupation?: TopMajorsByOccupation;
    genderDistribution: GenderDistribution;
    employmentTiming: EmploymentTiming;
    employmentTimeline: EmploymentTimeline;
  };
  byGeneralMajor: {
    generalMajors: GeneralMajor[];
  };
}

interface MockData {
  majorsInsights: MajorsInsights;
}

interface GenderDistribution {
  generalMajor?: string;
  narrowMajor?: string;
  specificMajor?: string;
  male: { count: number; percentage: number };
  female: { count: number; percentage: number };
}

interface SalaryDistribution {
  generalMajor?: string;
  narrowMajor?: string;
  occupation?: string;
  salary: number;
  percentage: number;
  median?: number;
}

interface EmploymentTiming {
  generalMajor: string;
  beforeGraduation: {
    count: number;
    percentage: number;
  };
  withinYear: {
    count: number;
    percentage: number;
  };
  afterYear: {
    count: number;
    percentage: number;
  };
}

interface EmploymentTimeline {
  generalMajor: string;
  averageTime: number;
  quickEmploymentRate: number;
  waitingPeriods: Array<{
    period: string;
    percentage: number;
  }>;
}


const mockDataTyped = mockData as unknown as MockData;

// Add this new component for the General Major buttons
// const GeneralMajorButtons = ({ 
//   generalMajors, 
//   selectedMajor, 
//   onSelect 
// }: { 
//   generalMajors: string[], 
//   selectedMajor: string | null,
//   onSelect: (major: string) => void 
// }) => {
//   return (
//     <div className="flex flex-wrap gap-3 mb-6">
//       {generalMajors.map((major) => (
//         <button
//           key={major}
//           onClick={() => onSelect(major)}
//           className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
//             ${selectedMajor === major 
//               ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-2 border-indigo-400' 
//               : 'bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 text-white/80 hover:bg-[#151d3b] hover:text-white hover:shadow-md border-2 border-transparent'
//             }`}
//         >
//           {major}
//         </button>
//       ))}
//       {selectedMajor && (
//         <button
//           onClick={() => onSelect('ALL_GENERAL_MAJORS')}
//           className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
//             bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-md hover:from-red-700 hover:to-red-800"
//         >
//           Clear Selection
//         </button>
//       )}
//     </div>
//   );
// };

// First, add a function to get top 3 gender distributions
// const getTopThreeGenderDistributions = (data: GenderDistribution[]) => {
//   // Calculate gender gap for each major
//   const withGenderGap = data.map(item => ({
//     ...item,
//     genderGap: Math.abs(item.male.percentage - item.female.percentage)
//   }));

//   // Sort by gender gap and take top 3
//   return withGenderGap
//     .sort((a, b) => b.genderGap - a.genderGap)
//     .slice(0, 3);
// };

// Function to get top 3 majors by total graduates
const getTopThreeByGraduates = (data: GenderDistribution[]) => {
  return data
    .sort((a, b) => b.male.count + b.female.count - (a.male.count + a.female.count))
    .slice(0, 3);
};

// Add this interface for button position
interface Position {
  x: number;
  y: number;
}

// Update the modal component to adjust position based on scroll
const GenderDistributionModal = ({ 
  isOpen, 
  onClose, 
  data, 
  onSelectMajor,
  buttonPosition 
}: { 
  isOpen: boolean;
  onClose: () => void;
  data: GenderDistribution[];
  onSelectMajor: (major: string) => void;
  buttonPosition: Position | null;
}) => {
  const [modalStyle, setModalStyle] = useState({ top: '0px' });

  useEffect(() => {
    if (isOpen && buttonPosition) {
      const updateModalPosition = () => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const modalHeight = viewportHeight * 0.85; // 85vh
        
        // Position the modal higher up from the button
        let topPosition = buttonPosition.y + scrollY - 500;
        
        // Ensure the modal doesn't go off screen
        const maxTop = scrollY + (viewportHeight - modalHeight);
        // Ensure it doesn't go above the viewport
        topPosition = Math.max(scrollY + 20, Math.min(topPosition, maxTop));
        
        setModalStyle({ top: `${topPosition}px` });
      };

      updateModalPosition();
      window.addEventListener('scroll', updateModalPosition);

      return () => {
        window.removeEventListener('scroll', updateModalPosition);
      };
    }
  }, [isOpen, buttonPosition]);

  if (!isOpen || !buttonPosition) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center" onClick={onClose}>
      <div 
        style={modalStyle}
        className="absolute bg-gradient-to-br from-[#1f2e6a] to-[#162052] rounded-xl p-8 w-[90%] max-w-[1200px] h-[85vh] overflow-y-auto shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="sticky top-0 right-4 float-right p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 z-10"
        >
          <X size={24} />
        </button>

        {/* Grid of gender distribution cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data
            .filter(item => 
              item.generalMajor && 
              (item.male.count > 0 || item.female.count > 0) &&
              item.male.count + item.female.count > 0
            )
            .map((item, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  onSelectMajor(item.generalMajor || '');
                  onClose();
                }}
              >
                <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
                  <h3 className="text-white/80 text-sm mb-3 truncate">{item.generalMajor}</h3>
                  <AllMajorsGenderDistributionChart
                    generalMajor={item.generalMajor ?? null}
                    data={[item]}
                  />
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Function to order all charts by total graduates
// const orderChartsByGraduates = (data: GenderDistribution[]) => {
//   return data.sort((a, b) => b.male.count + b.female.count - (a.male.count + a.female.count));
// };

// Add font classes at the top of the file
const fontClasses = {
  heading: 'font-neosans-bold',
  subheading: 'font-neosans-medium',
  body: 'font-roboto'
};

// Create a custom SAR icon component
// const SARIcon = () => (
//   <svg 
//     width="24" 
//     height="24" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <path d="M2 8h20M2 16h20M12 2v20M6 12h4a2 2 0 1 0 0-4H6v8h4a2 2 0 1 0 0-4" />
//   </svg>
// );

export default function MajorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MajorsPageContent />
    </Suspense>
  );
}

function MajorsPageContent() {
  const [filters, setFilters] = useState<MajorFilterOptions>({
    generalMajor: null,
    narrowMajor: null,
    specificMajor: null
  });

  // Add state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<Position | null>(null);

  // Move handleExpandClick inside the component
  const handleExpandClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({ x: rect.left, y: rect.top });
    setIsModalOpen(true);
  };

  const searchParams = useSearchParams();

   // Read URL parameters and set initial filter state
   useEffect(() => {
    const generalMajor = searchParams.get('generalMajor');
    if (generalMajor) {
      setFilters(prev => ({
        ...prev,
        generalMajor: decodeURIComponent(generalMajor)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const occupation = searchParams.get('occupation');
    if (occupation) {
      setFilters(prev => ({
        ...prev,
        occupation: decodeURIComponent(occupation)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const gender = searchParams.get('gender');
    if (gender) {
      setFilters(prev => ({
        ...prev,
        gender: decodeURIComponent(gender)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const timing = searchParams.get('timing');
    if (timing) {
      setFilters(prev => ({
        ...prev,
        timing: decodeURIComponent(timing)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const salary = searchParams.get('salary');
    if (salary) {
      setFilters(prev => ({
        ...prev,
        salary: decodeURIComponent(salary)
      }));
    }
  }, [searchParams]);

   // Read URL parameters and set initial filter state
   useEffect(() => {
    const generalMajor = searchParams.get('generalMajor');
    if (generalMajor) {
      setFilters(prev => ({
        ...prev,
        generalMajor: decodeURIComponent(generalMajor)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const occupation = searchParams.get('occupation');
    if (occupation) {
      setFilters(prev => ({
        ...prev,
        occupation: decodeURIComponent(occupation)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const gender = searchParams.get('gender');
    if (gender) {
      setFilters(prev => ({
        ...prev,
        gender: decodeURIComponent(gender)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const timing = searchParams.get('timing');
    if (timing) {
      setFilters(prev => ({
        ...prev,
        timing: decodeURIComponent(timing)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const salary = searchParams.get('salary');
    if (salary) {
      setFilters(prev => ({
        ...prev,
        salary: decodeURIComponent(salary)
      }));
    }
  }, [searchParams]);

  // Read URL parameters and set initial filter state
  useEffect(() => {
    const generalMajor = searchParams.get('generalMajor');
    console.log(generalMajor)
  // const generalMajor = "Health and Welfare";
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    // console.log('General Major:', generalMajor);
    if (generalMajor) {
      setFilters(prev => ({
        ...prev,
        generalMajor: decodeURIComponent(generalMajor)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const occupation = searchParams.get('occupation');
    console.log('Occupation:', occupation);
    if (occupation) {
      setFilters(prev => ({
        ...prev,
        occupation: decodeURIComponent(occupation)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const gender = searchParams.get('gender');
    // console.log('Gender:', gender);
    if (gender) {
      setFilters(prev => ({
        ...prev,
        gender: decodeURIComponent(gender)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const timing = searchParams.get('timing');
    if (timing) {
      setFilters(prev => ({
        ...prev,
        timing: decodeURIComponent(timing)
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const salary = searchParams.get('salary');
    if (salary) {
      setFilters(prev => ({
        ...prev,
        salary: decodeURIComponent(salary)
      }));
    }
  }, [searchParams]);

  // Get general majors from the mock data
  const generalMajors = mockData.majorsInsights.overall.basicMetrics.map(
    item => item.generalMajor
  );

  // Get narrow majors based on selected general major
  // const getNarrowMajors = (generalMajor: string | null) => {
  //   if (!generalMajor) return [];
  //   const majorData = mockData.majorsInsights.byGeneralMajor.generalMajors.find(
  //     item => item.name === generalMajor
  //   );
  //   return majorData?.byNarrowMajor?.narrowMajors?.map(item => item.name) || [];
  // };

  // Get specific majors based on selected narrow major
  // const getSpecificMajors = (generalMajor: string | null, narrowMajor: string | null) => {
  //   if (!generalMajor || !narrowMajor) return [];
  //   const majorData = mockData.majorsInsights.byGeneralMajor.generalMajors.find(
  //     item => item.name === generalMajor
  //   );
  //   const narrowMajorData = majorData?.byNarrowMajor.narrowMajors.find(
  //     item => item.name === narrowMajor
  //   );
  //   return narrowMajorData?.overall.basicMetrics.map(item => item.occupation) || [];
  // };

  // Filter change handlers
  const handleGeneralMajorChange = (value: string) => {
    setFilters(({
      generalMajor: value === 'ALL_GENERAL_MAJORS' ? null : value,
      narrowMajor: null,  // Reset narrow major when general major changes
      specificMajor: null
    }));
  };

  // const handleNarrowMajorChange = (value: string) => {
  //   setFilters(prev => ({
  //     ...prev,
  //     narrowMajor: value === 'ALL_NARROW_MAJORS' ? null : value,
  //     specificMajor: null  // Reset specific major when narrow major changes
  //   }));
  // };

  // const handleSpecificMajorChange = (value: string) => {
  //   setFilters(prev => ({
  //     ...prev,
  //     specificMajor: value === 'ALL_SPECIFIC_MAJORS' ? null : value
  //   }));
  // };

  // Force a re-render when filters change
  useEffect(() => {
    // This will trigger a re-render of all components that depend on filters
  }, [filters.generalMajor, filters.narrowMajor]);

  // const narrowMajors = getNarrowMajors(filters.generalMajor);
  // const specificMajors = getSpecificMajors(filters.generalMajor, filters.narrowMajor);

  // Add this function to get narrow majors data for the chart
  const getTopNarrowMajorsData = (generalMajor: string | null, narrowMajor: string | null) => {
    if (!generalMajor) {
      // Case 1: All General Majors - use majorsInsights/overall/basicMetrics
      return mockDataTyped.majorsInsights.overall.basicMetrics
        .sort((a, b) => b.graduates - a.graduates)
        .slice(0, 5)
        .map(item => ({
          narrowMajor: 'generalMajor' in item ? item.generalMajor : item.narrowMajor || '',
          value: item.graduates
      }));
    }
    
    const generalMajorData = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
      item => item.name === generalMajor
    );
    if (!generalMajorData) return [];

    if (!narrowMajor) {
      // Case 2: Specific General Major - use majorsInsights/byGeneralMajor/generalMajors/overall/basicMetrics
      return generalMajorData.overall.basicMetrics
        .sort((a, b) => b.graduates - a.graduates)
        .slice(0, 5)
        .map(item => ({
          narrowMajor: 'narrowMajor' in item ? item.narrowMajor : '',
          value: item.graduates
        }));
    }

    // Case 3: Narrow Major - use majorsInsights/byGeneralMajor/generalMajors/byNarrowMajor/narrowMajors/overall/basicMetrics
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors.find(
      item => item.name === narrowMajor
    );
    if (!narrowMajorData?.overall?.basicMetrics) return [];

    return narrowMajorData.overall.basicMetrics
      .sort((a, b) => b.graduates - a.graduates)
      .slice(0, 5)
      .map(item => ({
        narrowMajor: item.name || '',
        value: item.graduates
    }));
  };

  // Add this function next to your other data fetching functions
  const getTopEmployableNarrowMajorsData = (generalMajor: string | null, narrowMajor: string | null) => {
    if (!generalMajor) {
      // Case 1: All General Majors - use majorsInsights/overall/basicMetrics
      return mockDataTyped.majorsInsights.overall.basicMetrics
        .sort((a, b) => b.employmentRate - a.employmentRate)
        .slice(0, 5)
        .map(item => ({
          narrowMajor: 'generalMajor' in item ? item.generalMajor : item.narrowMajor || '',
          value: item.employmentRate
      }));
    }
    
    const generalMajorData = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
      item => item.name === generalMajor
    );
    if (!generalMajorData) return [];

    if (!narrowMajor) {
      // Case 2: Specific General Major - use majorsInsights/byGeneralMajor/generalMajors/overall/basicMetrics
      return generalMajorData.overall.basicMetrics
        .sort((a, b) => b.employmentRate - a.employmentRate)
        .slice(0, 5)
        .map(item => ({
          narrowMajor: 'narrowMajor' in item ? item.narrowMajor : '',
          value: item.employmentRate
        }));
    }

    // Case 3: Narrow Major - use majorsInsights/byGeneralMajor/generalMajors/byNarrowMajor/narrowMajors/overall/basicMetrics
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors.find(
      item => item.name === narrowMajor
    );
    if (!narrowMajorData?.overall?.basicMetrics) return [];

    return narrowMajorData.overall.basicMetrics
      .sort((a, b) => b.employmentRate - a.employmentRate)
      .slice(0, 5)
      .map(item => ({
        narrowMajor: item.name || '',
        value: item.employmentRate
    }));
  };

  // Add this function with your other data fetching functions
  const getTopPaidNarrowMajorsData = (generalMajor: string | null, narrowMajor: string | null) => {
    if (!generalMajor) {
      // Case 1: All General Majors - use majorsInsights/overall/basicMetrics
      return mockDataTyped.majorsInsights.overall.basicMetrics
        .sort((a, b) => b.averageSalary - a.averageSalary)
        .slice(0, 5)
        .map(item => ({
          narrowMajor: 'generalMajor' in item ? item.generalMajor : item.narrowMajor || '',
          value: item.averageSalary
      }));
    }
    
    const generalMajorData = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
      item => item.name === generalMajor
    );
    if (!generalMajorData) return [];

    if (!narrowMajor) {
      // Case 2: Specific General Major - use majorsInsights/byGeneralMajor/generalMajors/overall/basicMetrics
      return generalMajorData.overall.basicMetrics
        .sort((a, b) => b.averageSalary - a.averageSalary)
        .slice(0, 5)
        .map(item => ({
          narrowMajor: 'narrowMajor' in item ? item.narrowMajor : '',
          value: item.averageSalary
        }));
    }

    // Case 3: Narrow Major - use majorsInsights/byGeneralMajor/generalMajors/byNarrowMajor/narrowMajors/overall/basicMetrics
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors.find(
      item => item.name === narrowMajor
    );
    if (!narrowMajorData?.overall?.basicMetrics) return [];

    return narrowMajorData.overall.basicMetrics
      .sort((a, b) => b.averageSalary - a.averageSalary)
      .slice(0, 5)
      .map(item => ({
        narrowMajor: item.name || '',
        value: item.averageSalary
    }));
  };

  // Update the getTopMajorsByPopularOccupationsData function with correct data mapping
  const getTopMajorsByPopularOccupationsData = (generalMajor: string | null, narrowMajor: string | null) => {
    if (!generalMajor) {
      // Case 1: All General Majors - use majorsInsights/overall/topMajorsByOccupation
      const occupations = mockDataTyped.majorsInsights.overall.topMajorsByOccupation?.occupations || [];
      const totalGraduates = occupations.reduce((sum: number, curr: Occupation) => sum + curr.metrics.graduates, 0);
      
      return occupations.map((occupation: Occupation) => ({
        occupation: occupation.name,
        graduates: occupation.metrics.graduates,
        averageSalary: occupation.metrics.averageSalary,
        employmentRate: occupation.metrics.employmentRate,
        percentage: (occupation.metrics.graduates / totalGraduates) * 100
      }));
    }

    const generalMajorData = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
      item => item.name === generalMajor
    );
    if (!generalMajorData) return [];

    if (!narrowMajor) {
      // Case 2: Specific General Major - use majorsInsights/byGeneralMajor/generalMajors/overall/topMajorsByOccupation
      const occupations = generalMajorData.overall.topMajorsByOccupation?.occupations || [];
      const totalGraduates = occupations.reduce((sum: number, curr: Occupation) => sum + curr.metrics.graduates, 0);
      
      return occupations.map((occupation: Occupation) => ({
        occupation: occupation.name,
        graduates: occupation.metrics.graduates,
        averageSalary: occupation.metrics.averageSalary,
        employmentRate: occupation.metrics.employmentRate,
        percentage: (occupation.metrics.graduates / totalGraduates) * 100
      }));
    }

    // Case 3: Narrow Major - use majorsInsights/byGeneralMajor/generalMajors/byNarrowMajor/narrowMajors/overall/topMajorsByOccupation
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors.find(
      item => item.name === narrowMajor
    );
    if (!narrowMajorData?.overall?.topMajorsByOccupation?.occupations) return [];

    const occupations = narrowMajorData.overall.topMajorsByOccupation.occupations;
    const totalGraduates = occupations.reduce((sum: number, curr: Occupation) => sum + curr.metrics.graduates, 0);

    return occupations.map((occupation: Occupation) => ({
      occupation: occupation.name,
      graduates: occupation.metrics.graduates,
      averageSalary: occupation.metrics.averageSalary,
      employmentRate: occupation.metrics.employmentRate,
      percentage: (occupation.metrics.graduates / totalGraduates) * 100
    }));
  };

  // Update the getTopMajorsByMostEmployedOccupation function with correct data mapping
  const getTopMajorsByMostEmployedOccupation = (generalMajor: string | null, narrowMajor: string | null) => {
    if (!generalMajor) {
      // Case 1: All General Majors - use majorsInsights/overall/topMajorsByOccupation
      const occupations = mockDataTyped.majorsInsights.overall.topMajorsByOccupation?.occupations || [];
      if (occupations.length === 0) return [];

      return occupations
        .sort((a, b) => b.metrics.employmentRate - a.metrics.employmentRate)
        .slice(0, 5)
        .map(occupation => ({
          major: occupation.name,
          employmentRate: occupation.metrics.employmentRate,
          occupation: occupation.name
        }));
    }

    const generalMajorData = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
      item => item.name === generalMajor
    );
    if (!generalMajorData) return [];

    if (!narrowMajor) {
      // Case 2: Specific General Major - use majorsInsights/byGeneralMajor/generalMajors/overall/topMajorsByOccupation
      const occupations = generalMajorData.overall.topMajorsByOccupation?.occupations || [];
      if (occupations.length === 0) return [];

      return occupations
        .sort((a, b) => b.metrics.employmentRate - a.metrics.employmentRate)
        .slice(0, 5)
        .map(occupation => ({
          major: occupation.name,
          employmentRate: occupation.metrics.employmentRate,
          occupation: occupation.name
        }));
    }

    // Case 3: Narrow Major - use majorsInsights/byGeneralMajor/generalMajors/byNarrowMajor/narrowMajors/overall/topMajorsByOccupation
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors.find(
      item => item.name === narrowMajor
    );
    if (!narrowMajorData?.overall?.topMajorsByOccupation?.occupations) return [];

    const occupations = narrowMajorData.overall.topMajorsByOccupation.occupations;
    return occupations
      .sort((a, b) => b.metrics.employmentRate - a.metrics.employmentRate)
      .slice(0, 5)
      .map(occupation => ({
        major: occupation.name,
        employmentRate: occupation.metrics.employmentRate,
        occupation: occupation.name
      }));
  };

  // Update the getTopMajorsByHighestPaidOccupation function with correct data mapping
  const getTopMajorsByHighestPaidOccupation = (generalMajor: string | null, narrowMajor: string | null) => {
    if (!generalMajor) {
      // Case 1: All General Majors - use majorsInsights/overall/topMajorsByOccupation
      const occupations = mockDataTyped.majorsInsights.overall.topMajorsByOccupation?.occupations || [];
      if (occupations.length === 0) return [];

      return occupations
        .sort((a, b) => b.metrics.averageSalary - a.metrics.averageSalary)
        .slice(0, 5)
        .map(occupation => ({
          major: occupation.name,
          graduates: occupation.metrics.graduates,
          employmentRate: occupation.metrics.employmentRate,
          averageSalary: occupation.metrics.averageSalary,
          occupation: occupation.name
        }));
    }

    const generalMajorData = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
      item => item.name === generalMajor
    );
    if (!generalMajorData) return [];

    if (!narrowMajor) {
      // Case 2: Specific General Major - use majorsInsights/byGeneralMajor/generalMajors/overall/topMajorsByOccupation
      const occupations = generalMajorData.overall.topMajorsByOccupation?.occupations || [];
      if (occupations.length === 0) return [];

      return occupations
        .sort((a, b) => b.metrics.averageSalary - a.metrics.averageSalary)
        .slice(0, 5)
        .map(occupation => ({
          major: occupation.name,
          graduates: occupation.metrics.graduates,
          employmentRate: occupation.metrics.employmentRate,
          averageSalary: occupation.metrics.averageSalary,
          occupation: occupation.name
        }));
    }

    // Case 3: Narrow Major - use majorsInsights/byGeneralMajor/generalMajors/byNarrowMajor/narrowMajors/overall/topMajorsByOccupation
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors.find(
      item => item.name === narrowMajor
    );
    if (!narrowMajorData?.overall?.topMajorsByOccupation?.occupations) return [];

    const occupations = narrowMajorData.overall.topMajorsByOccupation.occupations;
    return occupations
      .sort((a, b) => b.metrics.averageSalary - a.metrics.averageSalary)
      .slice(0, 5)
      .map(occupation => ({
        major: occupation.name,
        graduates: occupation.metrics.graduates,
        employmentRate: occupation.metrics.employmentRate,
        averageSalary: occupation.metrics.averageSalary,
        occupation: occupation.name
      }));
  };

  // Update the data fetching functions to handle all filter cases
  

  // Update the getGenderDistributionData function
  const getGenderDistributionData = (): GenderDistribution[] => {
    const { generalMajor, narrowMajor } = filters;

    // Case 1: No general major selected
    if (!generalMajor) {
      return mockDataTyped.majorsInsights.overall.genderDistribution;
    }

    // Case 2: General major selected
    // Extract from majorsInsights/overall/genderDistribution list
    const overallGenderData = mockDataTyped.majorsInsights.overall.genderDistribution;
    const selectedGeneralMajorData = overallGenderData.find(
      item => item.generalMajor === generalMajor
    );

    if (!selectedGeneralMajorData) return [];

    // If no narrow major is selected, return the general major data
    if (!narrowMajor) {
      return [selectedGeneralMajorData];
    }

    // Case 3: Both general and narrow major selected
    // Find the general major first
    const generalMajorData = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors
      .find(major => major.name === generalMajor);

    if (!generalMajorData) return [];

    // Find the narrow major in the general major's genderDistribution
    const narrowMajorDataList = generalMajorData.overall.genderDistribution;
    const narrowMajorData = narrowMajorDataList.find(
      major => major.narrowMajor === narrowMajor
    );

    if (!narrowMajorData) return [];

    // Return the data in the format expected by the chart
    return [{
      generalMajor, // Keep the generalMajor for the chart to find
      narrowMajor,
      male: narrowMajorData.male,
      female: narrowMajorData.female
    }];
  };

  // Update the getSalaryDistributionData function
  const getSalaryDistributionData = (): SalaryDistribution[] => {
    const { generalMajor, narrowMajor } = filters;

    // Case 1: No general major selected
    if (!generalMajor) {
      return mockData.majorsInsights.overall.salaryDistribution;
    }

    // Find the general major data
    const generalMajorData = mockData.majorsInsights.byGeneralMajor.generalMajors
      .find(major => major.name === generalMajor);

    if (!generalMajorData) return [];

    // Case 2: General major selected, but no narrow major
    if (!narrowMajor) {
      return generalMajorData.overall.salaryDistribution;
    }

    // Case 3: Both general and narrow major selected
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors
      .find(major => major.name === narrowMajor);

    if (!narrowMajorData) return [];

    return narrowMajorData.overall.salaryDistribution;
  };

  // Update the getEmploymentTimingData function
  const getEmploymentTimingData = (filters: MajorFilterOptions): EmploymentTiming[] => {
    const { generalMajor, narrowMajor } = filters;

    // Case 1: No general major selected
    if (!generalMajor) {
      return mockData.majorsInsights.overall.employmentTiming;
    }

    // Find the general major data
    const generalMajorData = mockData.majorsInsights.byGeneralMajor.generalMajors
      .find(major => major.name === generalMajor);

    if (!generalMajorData) return [];

    // Case 2: General major selected, but no narrow major
    if (!narrowMajor) {
      return generalMajorData.overall.employmentTiming.map(item => ({
        ...item,
        generalMajor: item.narrowMajor
      }));
    }

    // Case 3: Both general and narrow major selected
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors
      .find(major => major.name === narrowMajor);

    if (!narrowMajorData) return [];

    return narrowMajorData.overall.employmentTiming;
  };

  // Function to get employment timeline data based on selected filters
  const getEmploymentTimelineData = (filters: MajorFilterOptions): EmploymentTimeline[] => {
    const { generalMajor, narrowMajor } = filters;

    // Case 1: No general major selected
    if (!generalMajor) {
      return mockData.majorsInsights.overall.employmentTimeline;
    }

    // Find the general major data
    const generalMajorData = mockData.majorsInsights.byGeneralMajor.generalMajors
      .find(major => major.name === generalMajor);

    if (!generalMajorData) return [];

    // Case 2: General major selected, but no narrow major
    if (!narrowMajor) {
      return generalMajorData.overall.employmentTimeline.map(item => ({
        ...item,
        generalMajor: item.narrowMajor // Use narrowMajor as the label for each timeline entry
      }));
    }

    // Case 3: Both general and narrow major selected
    const narrowMajorData = generalMajorData.byNarrowMajor?.narrowMajors
      .find(major => major.name === narrowMajor);

    if (!narrowMajorData?.overall?.employmentTimeline) return [];

    // Return all employment timeline entries for the selected narrow major
    return narrowMajorData.overall.employmentTimeline.map(item => ({
      ...item,
      generalMajor: item.name || narrowMajor
    }));
  };

  // Add these functions with the other data fetching functions
  const getTopMajorsGenderGapData = () => {
    return mockData.majorsInsights.overall.topGeneralMajorsInsights.byGenderGap.rankings.rankings.map(item => ({
      generalMajor: item.generalMajor,
      malePercentage: item.malePercentage,
      femalePercentage: item.femalePercentage,
      genderGap: item.genderGap
    }));
  };

  const getTopOccupationsGenderGapData = (filters: MajorFilterOptions) => {
    const { generalMajor, narrowMajor } = filters;

    // Case 1: No general major selected - use majorsInsights/overall/topMajorsByOccupation/occupations
    if (!generalMajor) {
      return mockDataTyped.majorsInsights.overall.topMajorsByOccupation?.occupations.map(occupation => ({
        name: occupation.name,
        malePercentage: occupation.metrics.genderDistribution?.male?.percentage || 0,
        femalePercentage: occupation.metrics.genderDistribution?.female?.percentage || 0,
        genderGap: (occupation.metrics.genderDistribution?.male?.percentage || 0) - 
                  (occupation.metrics.genderDistribution?.female?.percentage || 0)
      })) || [];
    }

    // Case 2: General major selected (no narrow major)
    // Use majorsInsights/byGeneralMajor/generalMajors/overall/topMajorsByOccupation/occupations
    const selectedGeneralMajor = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
      major => major.name === generalMajor
    );
    if (!selectedGeneralMajor) return [];

    if (!narrowMajor) {
      return selectedGeneralMajor.overall.topMajorsByOccupation?.occupations.map(occupation => ({
        name: occupation.name,
        malePercentage: occupation.metrics.genderDistribution?.male?.percentage || 0,
        femalePercentage: occupation.metrics.genderDistribution?.female?.percentage || 0,
        genderGap: (occupation.metrics.genderDistribution?.male?.percentage || 0) - 
                  (occupation.metrics.genderDistribution?.female?.percentage || 0)
      })) || [];
    }

    // Case 3: Both general and narrow major selected
    // Use majorsInsights/byGeneralMajor/generalMajors/byNarrowMajor/narrowMajors/topMajorsByOccupation/occupations
    const selectedNarrowMajor = selectedGeneralMajor.byNarrowMajor?.narrowMajors.find(
      major => major.name === narrowMajor
    );
    if (!selectedNarrowMajor) return [];

    return selectedNarrowMajor.overall.topMajorsByOccupation?.occupations.map(occupation => ({
      name: occupation.name,
      malePercentage: occupation.metrics.genderDistribution?.male?.percentage || 0,
      femalePercentage: occupation.metrics.genderDistribution?.female?.percentage || 0,
      genderGap: (occupation.metrics.genderDistribution?.male?.percentage || 0) - 
                (occupation.metrics.genderDistribution?.female?.percentage || 0)
    })) || [];
  };

  // Add this function to get the overview metrics data
  // const getOverviewMetrics = () => {
  //   if (filters.generalMajor) {
  //     const majorData = mockData.majorsInsights.byGeneralMajor.generalMajors.find(
  //       major => major.name === filters.generalMajor
  //     );
  //     if (!majorData) return mockData.majorsInsights.overall.basicMetrics[0];
  //     return majorData.overall.basicMetrics[0];
  //   }
  //   return mockData.majorsInsights.overall.basicMetrics[0];
  // };

  // Function to get top majors by gender gap based on selected filters
  const getTopMajorsGenderGap = (filters: MajorFilterOptions) => {
    const { generalMajor, narrowMajor } = filters;

    if (!generalMajor) {
      // If no general major is selected
      return mockDataTyped.majorsInsights.overall.topGeneralMajorsInsights.byGenderGap.rankings.rankings;
    } else if (generalMajor && !narrowMajor) {
      // If only general major is selected
      return mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
        major => major.name === generalMajor
      )?.overall.topNarrowMajorsInsights?.byGenderGap?.rankings || [];
    } else if (generalMajor && narrowMajor) {
      // If both general and narrow major are selected
      const selectedMajor = mockDataTyped.majorsInsights.byGeneralMajor.generalMajors.find(
        major => major.name === generalMajor
      );
      const selectedNarrowMajor = selectedMajor?.byNarrowMajor?.narrowMajors.find(
        major => major.name === narrowMajor
      );
      const rankings = selectedNarrowMajor?.overall.topMajorsInsights?.byGenderGap?.rankings || [];
      return rankings.map(item => ({
        ...item,
        narrowMajor: item.name // Map the name field to narrowMajor
      }));
    }
    return [];
  };

  // Function to get summary card data based on selected filters
  const getSummaryCardData = () => {
    const { generalMajor, narrowMajor } = filters;

    // Case 1: No general major selected
    if (!generalMajor) {
      return mockData.majorsInsights.totalMetrics;
    }

    // Case 2: General major selected, but no narrow major
    if (!narrowMajor) {
      // Extract the selected general major from the basicMetrics list
      const selectedMajorMetrics = mockData.majorsInsights.overall.basicMetrics
        .find(major => major.generalMajor === generalMajor);
      
      if (!selectedMajorMetrics) return null;
      return selectedMajorMetrics;
    }

    // Case 3: Both general and narrow major selected
    // Find the general major data
    const generalMajorData = mockData.majorsInsights.byGeneralMajor.generalMajors
      .find(major => major.name === generalMajor);

    if (!generalMajorData) return null;

    // Extract the selected narrow major from basicMetrics list
    const selectedNarrowMajorMetrics = generalMajorData.overall.basicMetrics
      .find(major => major.narrowMajor === narrowMajor);

    return selectedNarrowMajorMetrics || null;
  };

  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined) => {
    return value?.toLocaleString() || '0';
  };

  // Helper function to safely format percentages
  const formatPercentage = (value: number | undefined) => {
    return value ? `${value}%` : '0%';
  };

  // Helper function to safely format currency
  const formatCurrency = (value: number | undefined) => {
    return value ? `SAR ${value.toLocaleString()}` : 'SAR 0';
  };

  // Helper function to safely format days
  const formatDays = (value: number | undefined) => {
    return value ? `${value} days` : '0 days';
  };

  return (
    <div className="space-y-6 p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${fontClasses.heading} text-white text-sm`}>Select General Major</h2>
          {filters.generalMajor && (
            <button
              onClick={() => setFilters({ generalMajor: null, narrowMajor: null, specificMajor: null })}
              className="px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-md 
                hover:from-red-700 hover:to-red-800 flex items-center gap-2"
            >
              <X size={16} />
              Clear Selection
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {generalMajors.map((major) => (
            <button
              key={major}
              onClick={() => handleGeneralMajorChange(major)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                filters.generalMajor === major
                  ? 'bg-[#a9267f] text-white'
                  : 'bg-[#1a2657] text-gray-300 hover:bg-[#2e365f]'
              }`}
            >
              {major}
            </button>
          ))}
        </div>
        
        {/* Rest of the filters section */}
        {filters.generalMajor && (
          <div className="mt-4 flex items-center gap-2">
            {/* ... narrow major select ... */}
          </div>
        )}
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
        {/* Graduates Card */}
        <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Total Graduates</div>
            <Users className="text-[#2AB1BB] w-6 h-6" />
          </div>
          <div className="text-white text-2xl font-semibold">
            {formatNumber(getSummaryCardData()?.graduates)}
          </div>
        </div>
        {/* Employment Rate Card */}
        <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Employment Rate</div>
            <Briefcase className="text-[#2E6BB2] w-6 h-6" />
          </div>
          <div className="text-white text-2xl font-semibold">
            {formatPercentage(getSummaryCardData()?.employmentRate)}
          </div>
        </div>
        {/* Average Salary Card */}
        <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Average Salary</div>
            <DollarSign className="text-[#AC4863] w-6 h-6" />
          </div>
          <div className="text-white text-2xl font-semibold">
            {formatCurrency(getSummaryCardData()?.averageSalary).replace('$', 'SAR ')}
          </div>
        </div>
        {/* Time to Employment Card */}
        <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-400 text-sm">Average Time to Employment</div>
            <Clock className="text-[#1F5B58] w-6 h-6" />
          </div>
          <div className="text-white text-2xl font-semibold">
            {formatDays(getSummaryCardData()?.timeToEmployment)}
          </div>
        </div>
      </div>

      {!filters.generalMajor && (
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${fontClasses.heading} text-white text-xl mb-4`}>Gender Distribution By All Majors</h2>
          <button
            onClick={handleExpandClick}
            className={`${fontClasses.body} text-white/60 hover:text-white/90 transition-colors`}
          >
            View All
          </button>
        </div>
      )}
      
      {/* Gender Distribution and Gender Gap Section */}
      <div className="mt-8">
        {/* Top 3 Gender Distribution Charts - Only show when no general major is selected */}
        {!filters.generalMajor && (
          <div className="grid grid-cols-3 gap-4 w-full mb-8">
            {getTopThreeByGraduates(getGenderDistributionData())
              .filter(data => data.generalMajor && (data.male.count > 0 || data.female.count > 0)) // Filter out empty data
              .map((data, index) => (
                <div key={index} className="cursor-pointer" onClick={() => handleGeneralMajorChange(data.generalMajor || '')}>
                  <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
                    <h3 className={`${fontClasses.subheading} text-white/80 text-sm mb-3 truncate`}>
                      {data.generalMajor}
                    </h3>
                    <AllMajorsGenderDistributionChart 
                      generalMajor={data.generalMajor ?? null}
                      data={[data]}
                    />
                  </div>
                </div>
            ))}
          </div>
        )}

        {/* Three Chart Layout - Always show */}
       
        <div id="gender-insights" className="mt-8">
          <h2 className="text-white text-xl font-semibold mb-4">Gender Distribution</h2>
        <div className="grid grid-cols-3 gap-4 w-full">
            {!filters.generalMajor ? (
              <>
                <div>
                  <GenderDistributionChart 
                    generalMajor={filters.generalMajor}
                    data={getGenderDistributionData()}
                  />
                </div>
                <div>
                  <TopMajorsGenderGapChart 
                    generalMajor={filters.generalMajor}
                    data={getTopMajorsGenderGapData()}
                    onBarClick={(narrowMajor) => {
                      setFilters(prev => ({
                        ...prev,
                        narrowMajor: narrowMajor
                      }));
                    }}
                    onGeneralMajorSelect={(generalMajor) => {
                      setFilters(prev => ({
                        ...prev,
                        generalMajor: generalMajor,
                        narrowMajor: null,
                        specificMajor: null
                      }));
                    }}
                  />
                </div>
                <div>
                  <TopOccupationsGenderGapChart 
                    generalMajor={filters.generalMajor}
                    data={getTopOccupationsGenderGapData(filters)}
                    onBarClick={(narrowMajor) => {
                      setFilters(prev => ({
                        ...prev,
                        narrowMajor: narrowMajor
                      }));
                    }}
                    onGeneralMajorSelect={(generalMajor) => {
                      setFilters(prev => ({
                        ...prev,
                        generalMajor: generalMajor,
                        narrowMajor: null,
                        specificMajor: null
                      }));
                    }}
                  />
                </div>
              </>
            ) : (
              <>
          <div>
            <GenderDistributionChart 
              generalMajor={filters.generalMajor}
              data={getGenderDistributionData()}
            />
              </div>
          <div>
            <TopMajorsGenderGapChart 
              generalMajor={filters.generalMajor}
              data={getTopMajorsGenderGap(filters)}
              onBarClick={(narrowMajor) => {
                setFilters(prev => ({
                  ...prev,
                  narrowMajor: narrowMajor
                }));
              }}
              onGeneralMajorSelect={(generalMajor) => {
                setFilters(prev => ({
                  ...prev,
                  generalMajor: generalMajor,
                  narrowMajor: null,
                  specificMajor: null
                }));
              }}
            />
              </div>
          <div>
            <TopOccupationsGenderGapChart 
              generalMajor={filters.generalMajor}
              data={getTopOccupationsGenderGapData(filters)}
              onBarClick={(narrowMajor) => {
                setFilters(prev => ({
                  ...prev,
                  narrowMajor: narrowMajor
                }));
              }}
              onGeneralMajorSelect={(generalMajor) => {
                setFilters(prev => ({
                  ...prev,
                  generalMajor: generalMajor,
                  narrowMajor: null,
                  specificMajor: null
                }));
              }}
            />
              </div>
              </>
            )}
            </div>
              </div>
      </div>

      {/* Top General Majors Insights Section */}
      <div id="general-majors-insights" className="mt-8">        
        <h2 className={`${fontClasses.heading} text-white text-xl mb-4`} />
      <div id="general-majors-insights" className="mt-8">        
        <h2 className="text-white text-xl font-semibold mb-4">
          {filters.narrowMajor ? 'Top Majors Insights' : filters.generalMajor ? 'Top Narrow Majors Insights' : 'Top General Majors Insights'}
        </h2>        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 w-full">
            <TopNarrowMajorsChart 
              generalMajor={filters.generalMajor}
              narrowMajor={filters.narrowMajor}
              data={getTopNarrowMajorsData(filters.generalMajor, filters.narrowMajor)}
              onBarClick={(narrowMajor) => {
                setFilters(prev => ({
                  ...prev,
                  narrowMajor: narrowMajor
                }));
              }}
              onGeneralMajorSelect={(generalMajor) => {
                handleGeneralMajorChange(generalMajor);
              }}
            />

            <TopEmployableNarrowMajorsChart 
              generalMajor={filters.generalMajor}
              narrowMajor={filters.narrowMajor}
              data={getTopEmployableNarrowMajorsData(filters.generalMajor, filters.narrowMajor)}
              onBarClick={(narrowMajor) => {
                setFilters(prev => ({
                  ...prev,
                  narrowMajor: narrowMajor
                }));
              }}
              onGeneralMajorSelect={(generalMajor) => {
                handleGeneralMajorChange(generalMajor);
              }}
            />
            <TopPaidNarrowMajorsChart 
              generalMajor={filters.generalMajor}
              narrowMajor={filters.narrowMajor}
              data={getTopPaidNarrowMajorsData(filters.generalMajor, filters.narrowMajor)}
              onBarClick={(narrowMajor) => {
                setFilters(prev => ({
                  ...prev,
                  narrowMajor: narrowMajor
                }));
              }}
              onGeneralMajorSelect={(generalMajor) => {
                handleGeneralMajorChange(generalMajor);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {/* <TopPaidNarrowMajorsChart 
              generalMajor={filters.generalMajor}
              narrowMajor={filters.narrowMajor}
              data={getTopPaidNarrowMajorsData(filters.generalMajor, filters.narrowMajor)}
              onBarClick={(narrowMajor) => {
                setFilters(prev => ({
                  ...prev,
                  narrowMajor: narrowMajor
                }));
              }}
              onGeneralMajorSelect={(generalMajor) => {
                handleGeneralMajorChange(generalMajor);
              }}
            /> */}
            {/* <TopMajorsGenderGapChart 
              generalMajor={filters.generalMajor}
              data={getTopMajorsGenderGapData()}
            /> */}
          </div>        
        </div>
      </div>

      {/* Second group of charts - Top Major Occupations */}
      <div id="occupations-insights" className="mt-8">
        <h2 className={`${fontClasses.heading} text-white text-xl mb-4`}>Top Occupations Insights</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 w-full">
            <TopMajorsByPopularOccupationsChart 
              generalMajor={filters.generalMajor}
              narrowMajor={filters.narrowMajor}
              data={getTopMajorsByPopularOccupationsData(filters.generalMajor, filters.narrowMajor)}
            />

            <TopMajorsByMostEmployedOccupationChart 
              generalMajor={filters.generalMajor}
              data={getTopMajorsByMostEmployedOccupation(filters.generalMajor, filters.narrowMajor)}
            />
            <TopMajorsByHighestPaidOccupationChart 
              generalMajor={filters.generalMajor}
              data={getTopMajorsByHighestPaidOccupation(filters.generalMajor, filters.narrowMajor)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {/* <TopMajorsByHighestPaidOccupationChart 
              generalMajor={filters.generalMajor}
              data={getTopMajorsByHighestPaidOccupation(filters.generalMajor, filters.narrowMajor)}
            /> */}
            {/* <TopOccupationsGenderGapChart 
              generalMajor={filters.generalMajor}
              data={getTopOccupationsGenderGapData(filters)}
            /> */}
          </div>
        </div>
      </div>

      {/* Employment Timing Distribution Section */}
      <div id="timing-insights" className="mt-8">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <h3 className={`${fontClasses.subheading} text-white text-lg mb-4`}>Employment Timing Distribution</h3>
            <EmploymentTimingChart 
              generalMajor={filters.generalMajor}
              data={getEmploymentTimingData(filters)}
              onBarClick={(narrowMajor) => {
                setFilters(prev => ({
                  ...prev,
                  narrowMajor: narrowMajor
                }));
              }}
              onGeneralMajorSelect={(generalMajor) => {
                setFilters(prev => ({
                  ...prev,
                  generalMajor: generalMajor,
                  narrowMajor: null,
                  specificMajor: null
                }));
              }}
            />
          </div>
          <div>
            <h3 className={`${fontClasses.subheading} text-white text-lg mb-4`}>Employment Timeline Analysis</h3>
            <EmploymentTimelineChart 
              generalMajor={filters.generalMajor}
              data={getEmploymentTimelineData(filters)}
              onBarClick={(narrowMajor) => {
                setFilters(prev => ({
                  ...prev,
                  narrowMajor: narrowMajor
                }));
              }}
              onGeneralMajorSelect={(generalMajor) => {
                setFilters(prev => ({
                  ...prev,
                  generalMajor: generalMajor,
                  narrowMajor: null,
                  specificMajor: null
                }));
              }}
            />
          </div>
        </div>
      </div>

      {/* Salary and Gender Distribution Section */}
      <div id="salary-insights" className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
        <h2 className={`${fontClasses.heading} text-white text-xl mb-4`}>Salary Distribution</h2>
          <SalaryDistributionChart 
            generalMajor={filters.generalMajor}
            data={getSalaryDistributionData()}
            onBarClick={(narrowMajor) => {
              setFilters(prev => ({
                ...prev,
                narrowMajor: narrowMajor
              }));
            }}
            onGeneralMajorSelect={(generalMajor) => {
              setFilters(prev => ({
                ...prev,
                generalMajor: generalMajor,
                narrowMajor: null,
                specificMajor: null
              }));
            }}
          />
        </div>
          {/* <div>
            <h2 className="text-white text-xl font-semibold mb-4">Gender Distribution</h2>
            <AllMajorsGenderDistributionChart 
              generalMajor={filters.generalMajor}
              data={getGenderDistributionData()}
            />
      </div> */}
        </div>
      </div>

      {/* Add the modal component */}
      <GenderDistributionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setButtonPosition(null);
        }}
        data={getGenderDistributionData()}
        onSelectMajor={handleGeneralMajorChange}
        buttonPosition={buttonPosition}
      />
    </div>
    </div>
  );}