import { Major } from '../types';

export const applyCommonFilters = (data: Major[]): Major[] => {
  return data.filter(item => 
    // Must have total graduates
    item.metrics.totalGraduates > 0 &&
    // Must have a valid general major name
    item.generalMajorName && 
    item.generalMajorName.trim() !== '' &&
    // Must have some employment data
    item.metrics.employedGraduates > 0
  );
};

export const getTopNByGraduates = (data: Major[], n: number = 10): Major[] => {
  return [...data]
    .sort((a, b) => b.metrics.totalGraduates - a.metrics.totalGraduates)
    .slice(0, n);
};
