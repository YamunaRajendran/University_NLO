export interface LaborData {
  IndicatorDescription: string;
  IndicatorValue: number;
  Nationality: string;
  Gender: string;
  'Graduation Year': number;
  EducationLevel: string;
  GeneralMajorName: string;
  NarrowMajorName: string;
  Major: string;
  GOSIoccupationDescription: string;
  ISCOOccupationDescription: string;
  PeriodToEmployment: string;
}

export const loadLaborData = async (): Promise<LaborData[]> => {
  try {
    const response = await fetch('/output/translated_data_mock 1.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  } catch (error) {
    console.error('Error loading labor data:', error);
    throw error;
  }
};
