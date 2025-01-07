export interface MajorMetrics {
  averageSalary: number;
  employmentRate: number;
  waitingTime: number;
  employedGraduates: number;
  totalGraduates: number;
  versatilityScore: number;
}

export interface NarrowMajorMetrics {
  totalGraduates: number;
  employedGraduates: number;
  totalSalaryAfterGrad: number;
  salaryRecordsCount: number;
  totalDaysUntilFirstJob: number;
  daysUntilFirstJobCount: number;
  averageSalary?: number;
  employmentRate?: number;
  averageDaysUntilFirstJob?: number;
}

export interface Major {
  id: string;
  generalMajorName: string;
  narrowMajorName: string;
  specificMajor: string;
  gender: string;
  educationLevel: string;
  name: string;
  totalGraduates: number;
  maleGraduates: number;
  femaleGraduates: number;
  waitingTimeDistribution: {
    '0-3': number;
    '3-6': number;
    '6-12': number;
    '12+': number;
  };
  metrics: {
    averageSalary: number;
    employmentRate: number;
    waitingTime: number;
    employedGraduates: number;
    totalGraduates: number;
    versatilityScore: number;
  };
  topPayingMajors: Array<{
    name: string;
    'Average Salary': number;
    totalGraduates: number;
  }>;
}

export interface FilterOptions {
  searchQuery?: string;
  generalMajor: string | null;
  narrowMajor: string | null;
  specificMajor: string | null;
  minSalary?: number;
  minEmploymentRate?: number;
}

export interface RawDataItem {
  id?: number;
  nationality?: string;
  gender?: string;
  graduation_year?: number;
  education_level?: string;
  general_major_name?: string;
  narrow_major_name?: string;
  specific_major?: string;
  occupation_english?: string;
  occupation_arabic?: string;
  employed?: boolean;
  salary?: number;
  waiting_days?: number;
}

export interface SalaryDistribution {
  generalMajor?: string;
  narrowMajor?: string;
  occupation?: string;
  salary: number;
  percentage: number;
  median: number;
}

export interface GenderDistribution {
  generalMajor?: string;
  narrowMajor?: string;
  specificMajor?: string;
  male: {
    count: number;
    percentage: number;
  };
  female: {
    count: number;
    percentage: number;
  };
}
