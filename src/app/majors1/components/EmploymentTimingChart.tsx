import React from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
// SankeyNodeDatum

interface EmploymentTiming {
  generalMajor?: string;
  name?: string;
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

interface Props {
  generalMajor: string | null;
  data: EmploymentTiming[];
  onBarClick?: (narrowMajor: string) => void;
  onGeneralMajorSelect?: (generalMajor: string) => void;
}

interface SankeyNode {
  id: string;
}

interface CustomSankeyNode extends SankeyNode {
  originalData?: EmploymentTiming;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

interface SankeyData {
  nodes: CustomSankeyNode[];
  links: SankeyLink[];
}

interface NodeClickData {
  originalData?: {
    generalMajor?: string;
    narrowMajor?: string;
  };
}

const nodeColors: { [key: string]: string } = {
  // General Majors
  'Health and welfare': '#06b6d4',
  'Engineering, Manufacturing and Construction': '#8b5cf6',
  'Business, Administration and Law': '#f59e0b',
  'Information and Communication Technologies': '#ec4899',
  'Natural Sciences, Mathematics and Statistics': '#3b82f6',
  'Social Sciences, Journalism, Information and Media': '#14b8a6',
  'Agriculture, Forestry, Fisheries and Veterinary': '#84cc16',
  'education': '#7c3aed',
  'Services': '#f43f5e',
  'Generic Programmes and Qualifications': '#8b5cf6',
  'Health and Welfare': '#06b6d4',
  'Engineering, manufacturing and construction': '#8b5cf6',
  'Business, administration and law': '#f59e0b',
  'Communications and Information Technology': '#ec4899',
  'Arts and Humanities': '#10b981',
  'All Majors': '#6366f1',
  
  // Employment timing nodes
  'Before Graduation': '#22c55e',
  'Within First Year': '#f59e0b',
  'After First Year': '#ef4444',
};

const linkColors: { [key: string]: string } = {
  'Before Graduation': '#4ade80',
  'Within First Year': '#fbbf24',
  'After First Year': '#f87171',
};

const EmploymentTimingChart: React.FC<Props> = ({ data, generalMajor, onBarClick, onGeneralMajorSelect }) => {
  if (data.length === 0) {
    return (
      <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center h-[400px]">
        <p className="text-gray-400">No employment timing data available</p>
      </div>
    );
  }

  const handleNodeClick = (node: NodeClickData) => {
    if (!generalMajor && node.originalData?.generalMajor && onGeneralMajorSelect) {
      onGeneralMajorSelect(node.originalData.generalMajor);
    } else if (generalMajor && node.originalData?.narrowMajor && onBarClick) {
      onBarClick(node.originalData.narrowMajor);
    }
  };

  // Transform data into Sankey format
  const transformedData = data.reduce<SankeyData>((acc, item) => {
    const majorName = item.generalMajor || item.name || 'All Majors';

    // Add nodes if they don't exist
    if (!acc.nodes.some(node => node.id === majorName)) {
      acc.nodes.push({ 
        id: majorName,
        originalData: item // Keep original data for click handling
      });
    }
    if (!acc.nodes.some(node => node.id === 'Before Graduation')) {
      acc.nodes.push({ id: 'Before Graduation' });
    }
    if (!acc.nodes.some(node => node.id === 'Within First Year')) {
      acc.nodes.push({ id: 'Within First Year' });
    }
    if (!acc.nodes.some(node => node.id === 'After First Year')) {
      acc.nodes.push({ id: 'After First Year' });
    }

    // Add links
    acc.links.push(
      {
        source: majorName,
        target: 'Before Graduation',
        value: item.beforeGraduation.percentage,
        color: linkColors['Before Graduation']
      },
      {
        source: majorName,
        target: 'Within First Year',
        value: item.withinYear.percentage,
        color: linkColors['Within First Year']
      },
      {
        source: majorName,
        target: 'After First Year',
        value: item.afterYear.percentage,
        color: linkColors['After First Year']
      }
    );

    return acc;
  }, { nodes: [], links: [] });

  // Get the color of the selected general major
  const getNodeColor = (node: { id: string }) => {
    if (generalMajor) {
      // If we have a selected general major, use its color for narrow majors
      const generalMajorColor = nodeColors[generalMajor];
      if (node.id !== 'Before Graduation' && 
          node.id !== 'Within First Year' && 
          node.id !== 'After First Year') {
        return generalMajorColor;
      }
    }
    // Otherwise use the default color mapping
    return nodeColors[node.id] || '#4f46e5';
  };

  return (
    <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg mb-4">Employment Timing Distribution</h3>
      <div className="h-[400px]">
        <ResponsiveSankey
          data={transformedData}
          margin={{ top: 20, right: 85, bottom: 20, left: 270 }}
          align="justify"
          colors={getNodeColor}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderRadius={3}
          linkOpacity={0.8}
          linkHoverOthersOpacity={0.1}
          linkBlendMode="normal"
          linkContract={3}
          enableLinkGradient={false}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{ from: 'color', modifiers: [] }}
          animate={true}
          motionConfig="gentle"
          onClick={(node) => {
            if ('id' in node) {  // This is a node click
              const sankeyNode = node as unknown as CustomSankeyNode;
              handleNodeClick({
                originalData: sankeyNode.originalData
              });
            }
          }}
          theme={{
            background: 'transparent',
            text: {
              fontSize: 12,
              fill: '#ffffff',
              fontWeight: 600,
            },
            tooltip: {
              container: {
                background: '#0a1230',
                color: '#ffffff',
                fontSize: '14px',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                padding: '12px 16px',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default EmploymentTimingChart;
