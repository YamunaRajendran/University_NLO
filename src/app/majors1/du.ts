export interface Occupation {
  name: string;
  metrics: {
    graduates: number;
    employmentRate: number;
    averageSalary: number;
  };
}

export interface GeneralMajorData {
  name: string;
  overall: {
    basicMetrics: Array<{
      generalMajor: string;
      graduates: number;
      employmentRate: number;
      averageSalary: number;
      timeToEmployment: number;
      maleCount: number;
      femaleCount: number;
      malePercentage: number;
      femalePercentage: number;
    }>;
    topMajorsByOccupation?: {
      occupations: Occupation[];
    };
    genderDistribution: Array<{
      generalMajor?: string;
      male: { count: number; percentage: number };
      female: { count: number; percentage: number };
    }>;
    employmentTiming: Array<{
      generalMajor: string;
      beforeGraduation: { count: number; percentage: number };
      withinYear: { count: number; percentage: number };
      afterYear: { count: number; percentage: number };
    }>;
    employmentTimeline: EmploymentTimelineData;
  };
  byNarrowMajor?: {
    narrowMajors: Array<{
      name: string;
      overall: {
        basicMetrics: Array<{
          generalMajor: string;
          graduates: number;
          employmentRate: number;
          averageSalary: number;
          timeToEmployment: number;
          maleCount: number;
          femaleCount: number;
          malePercentage: number;
          femalePercentage: number;
        }>;
        topMajorsByOccupation?: {
          occupations: Occupation[];
        };
        genderDistribution: Array<{
          generalMajor?: string;
          male: { count: number; percentage: number };
          female: { count: number; percentage: number };
        }>;
        employmentTiming: Array<{
          generalMajor: string;
          beforeGraduation: { count: number; percentage: number };
          withinYear: { count: number; percentage: number };
          afterYear: { count: number; percentage: number };
        }>;
        employmentTimeline: EmploymentTimelineData;
      };
    }>;
  };
}

export interface MajorsInsights {
  overall: {
    basicMetrics: Array<{
      generalMajor: string;
      graduates: number;
      employmentRate: number;
      averageSalary: number;
      timeToEmployment: number;
      maleCount: number;
      femaleCount: number;
      malePercentage: number;
      femalePercentage: number;
    }>;
    topGeneralMajorsInsights: {
      byGenderGap: {
        rankings: {
          rankings: Array<{
            generalMajor: string;
            genderGap: number;
            malePercentage: number;
            femalePercentage: number;
          }>;
        };
      };
    };
    topMajorsByOccupation?: {
      occupations: Occupation[];
    };
    genderDistribution: Array<{
      generalMajor?: string;
      male: { count: number; percentage: number };
      female: { count: number; percentage: number };
    }>;
    salaryDistribution: Array<{
      salary: number;
      percentage: number;
      median?: number;
    }>;
    employmentTimeline: EmploymentTimelineData;
    employmentTiming: Array<{
      generalMajor: string;
      beforeGraduation: { count: number; percentage: number };
      withinYear: { count: number; percentage: number };
      afterYear: { count: number; percentage: number };
    }>;
  };
  byGeneralMajor: {
    generalMajors: Array<GeneralMajorData>;
  };
  totalMetrics: string | number;
}

export interface EmploymentTimelineData {
  generalMajor: string;
  averageTime: number;
  quickEmploymentRate: number;
  waitingPeriods: {
    beforeGraduation: { count: number; percentage: number };
    withinYear: { count: number; percentage: number };
    afterYear: { count: number; percentage: number };
  };
}
