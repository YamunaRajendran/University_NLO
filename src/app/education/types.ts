// Basic metrics interface shared across different levels
export interface BasicMetric {
  educationLevel: string;
  graduates: number;
  graduatesPercentage: number;
  employmentRate: number;
  averageSalary: number;
  timeToEmployment: number;
}

// Total metrics for all education levels
export interface TotalMetrics {
  graduates: number;
  graduatesPercentage: number;
  employmentRate: number;
  averageSalary: number;
  timeToEmployment: number;
}

// Popular education level insight
export interface PopularEducationLevel {
  educationLevel: string;
  graduates: number;
  percentage: number;
}

// Most employable education level insight
export interface EmployableEducationLevel {
  educationLevel: string;
  employmentRate: number;
  graduates: number;
}

// Highest paid education level insight
export interface HighestPaidEducationLevel {
  educationLevel: string;
  averageSalary: number;
  graduates: number;
}

// Top insights for education levels
export interface TopInsights {
  mostPopular: PopularEducationLevel[];
  mostEmployable: EmployableEducationLevel[];
  highestPaying: HighestPaidEducationLevel[];
}

// Gender distribution data
export interface GenderGapRanking {
  educationLevel: string;
  malePercentage: number;
  femalePercentage: number;
  genderGap: number;
  graduates: number;
}

// Salary distribution for education levels
export interface SalaryDistributionItem {
  educationLevel: string;
  salary: number;
  percentage: number;
  median: number;
}

// Employment timing periods
export interface TimingPeriod {
  count: number;
  percentage: number;
}

// Employment timing for education levels
export interface EmploymentTimingItem {
  educationLevel: string;
  beforeGraduation: TimingPeriod;
  withinYear: TimingPeriod;
  afterYear: TimingPeriod;
}

// Employment timeline waiting periods
export interface WaitingPeriods {
  beforeGraduation: TimingPeriod;
  withinYear: TimingPeriod;
  afterYear: TimingPeriod;
}

// Employment timeline for education levels
export interface EmploymentTimelineItem {
  educationLevel: string;
  averageTime: number;
  quickEmploymentRate: number;
  waitingPeriods: WaitingPeriods;
}

// Overall data structure
export interface Overall {
  basicMetrics: BasicMetric[];
  topInsights: TopInsights;
  genderGap: {
    rankings: GenderGapRanking[];
  };
  salaryDistribution: SalaryDistributionItem[];
  employmentTiming: EmploymentTimingItem[];
  employmentTimeline: EmploymentTimelineItem[];
}

// Main education insights data structure
export interface EducationInsights {
  totalMetrics: TotalMetrics;
  overall: Overall;
}

// Root data structure
export interface EducationData {
  educationInsights: EducationInsights;
}

// Chart data types
export interface ChartDataItem {
  narrowMajor: string;
  value: number;
  percentage?: number;
  graduates?: number;
}

export interface GenderDistributionItem {
  generalMajor: string;
  male: {
    count: number;
    percentage: number;
  };
  female: {
    count: number;
    percentage: number;
  };
  genderGap: number;
}

// Filter options
export interface FilterOptions {
  generalMajor: string | null;
  narrowMajor: string | null;
  specificMajor: string | null;
}

// Summary cards
export interface SummaryCards {
  totalGraduates: number;
  employmentRate: number;
  averageSalary: number;
  timeToEmployment: number;
  graduatesPercentage: number;
}
