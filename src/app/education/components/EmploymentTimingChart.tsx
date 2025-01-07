import React from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { EmploymentTimingItem } from '../types';
import brandData from '@/app/education/brand/color.json';

interface Props {
  generalMajor: string | null;
  data: EmploymentTimingItem[];
}

interface SankeyNode {
  id: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Brand Colors
const BRAND_COLORS = {
  primary: {
    teal: 'rgb(42, 177, 187)',
    blue: 'rgb(46, 107, 178)',
    navy: 'rgb(33, 38, 94)'
  },
  secondary: {
    darkTeal: 'rgb(31, 91, 88)',
    rose: 'rgb(172, 72, 99)',
    slate: 'rgb(119, 117, 134)'
  }
};

const nodeColors: { [key: string]: string } = {
  'Before Graduation': BRAND_COLORS.primary.teal,
  'Within Year': BRAND_COLORS.primary.blue,
  'After Year': BRAND_COLORS.secondary.rose,
  "Bachelor's": BRAND_COLORS.primary.teal,
  "Master's": BRAND_COLORS.primary.blue,
  'PhD (Doctoral)': BRAND_COLORS.secondary.darkTeal,
  'Higher Diploma': BRAND_COLORS.secondary.rose,
  'Associate Diploma': BRAND_COLORS.primary.teal,
  'Intermediate Diploma': BRAND_COLORS.primary.blue,
  'All Levels': BRAND_COLORS.secondary.slate,
  'fellowship': BRAND_COLORS.primary.teal,
  'Overall': BRAND_COLORS.primary.navy,
  'Unclassified': BRAND_COLORS.secondary.slate,
};

const EmploymentTimingChart: React.FC<Props> = ({ data, generalMajor }) => {
  console.log('Initial data:', data);
  console.log('General Major:', generalMajor);

  // First filter by general major if specified
  const majorFilteredData = generalMajor && generalMajor !== 'ALL_LEVELS'
    ? data.filter(item => item.educationLevel === generalMajor)
    : data;

  console.log('Major filtered data:', majorFilteredData);

  const filteredData = majorFilteredData.filter(item => 
    item.educationLevel && 
    (item.beforeGraduation.count > 0 || 
     item.withinYear.count > 0 || 
     item.afterYear.count > 0)
  );

  console.log('Final filtered data:', filteredData);

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 rounded-lg">
        <p className="text-gray-400 font-roboto">No data available</p>
      </div>
    );
  }

  // Get unique education levels
  const uniqueEducationLevels = Array.from(new Set(filteredData.map(item => item.educationLevel)));

  const sankeyData: SankeyData = {
    nodes: [
      // Education level nodes
      ...uniqueEducationLevels.map(level => ({ id: level })),
      // Timing nodes
      { id: 'Before Graduation' },
      { id: 'Within Year' },
      { id: 'After Year' },
    ],
    links: filteredData.flatMap(item => [
      item.beforeGraduation.count > 0 ? {
        source: item.educationLevel,
        target: 'Before Graduation',
        value: item.beforeGraduation.count,
      } : null,
      item.withinYear.count > 0 ? {
        source: item.educationLevel,
        target: 'Within Year',
        value: item.withinYear.count,
      } : null,
      item.afterYear.count > 0 ? {
        source: item.educationLevel,
        target: 'After Year',
        value: item.afterYear.count,
      } : null,
    ]).filter((link): link is SankeyLink => link !== null),
  };

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg font-neo-sans-medium">Employment Timing by Education Level</h3>
      <ResponsiveSankey
        data={sankeyData}
        margin={{ top: 70, right: 160, bottom: 40, left: 160 }}
        align="justify"
        colors={({ id, source }: { id?: string; source?: string; }) => {
          if (id) {
            // This is a node
            return nodeColors[id] || BRAND_COLORS.secondary.slate;
          }
          // This is a link
          return nodeColors[source!] || BRAND_COLORS.secondary.slate;
        }}
        nodeOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]],
        }}
        linkOpacity={0.8}
        linkHoverOthersOpacity={0.1}
        linkContract={3}
        enableLinkGradient={false}
        linkBlendMode="normal"
        labelPosition="outside"
        label={d => `${d.id} (${d.value.toLocaleString()})`}
        labelTextColor={{ from: 'color', modifiers: [] }}
        theme={{
          labels: {
            text: {
              fontFamily: brandData.typography.english.body,
              fill: '#9ca3af'
            }
          },
          tooltip: {
            container: {
              background: BRAND_COLORS.primary.navy,
              color: '#fff',
              fontFamily: brandData.typography.english.body,
              border: `1px solid ${BRAND_COLORS.primary.teal}`,
              borderRadius: '6px',
            }
          }
        }}
      />
    </div>
  );
};

export default EmploymentTimingChart;
