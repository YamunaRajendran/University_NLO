import React from 'react';
import { FilterOptions } from '../types';
import styles from '../styles/FilterPanel.module.css';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleChange = (field: keyof FilterOptions, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterGroup}>
        <label htmlFor="search">Search Majors</label>
        <input
          type="text"
          id="search"
          placeholder="Search by major name..."
          value={filters.searchQuery}
          onChange={(e) => handleChange('searchQuery', e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="minSalary">Minimum Salary</label>
        <input
          type="number"
          id="minSalary"
          placeholder="Enter minimum salary..."
          value={filters.minSalary || ''}
          onChange={(e) => handleChange('minSalary', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="minEmploymentRate">Minimum Employment Rate (%)</label>
        <input
          type="number"
          id="minEmploymentRate"
          placeholder="Enter minimum rate..."
          min="0"
          max="100"
          value={filters.minEmploymentRate ? filters.minEmploymentRate * 100 : ''}
          onChange={(e) => handleChange('minEmploymentRate', e.target.value ? Number(e.target.value) / 100 : undefined)}
        />
      </div>
    </div>
  );
};

export default FilterPanel;
