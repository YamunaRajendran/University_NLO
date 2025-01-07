import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList
} from 'recharts';
import { EmploymentTimelineItem } from '../types';
import brandData from '@/app/education/brand/color.json';

interface Props {
  generalMajor: string | null;
  data: EmploymentTimelineItem[];
}

interface ChartData {
  name: string;
  beforeGraduation: number;
  withinYear: number;
  afterYear: number;
  averageTime: number;
  quickEmploymentRate: number;
}

const EmploymentTimelineChart: React.FC<Props> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 font-roboto">No data available</p>
      </div>
    );
  }

  const chartData: ChartData[] = data.map((item) => ({
    name: item.educationLevel,
    beforeGraduation: item.waitingPeriods.beforeGraduation.percentage,
    withinYear: item.waitingPeriods.withinYear.percentage,
    afterYear: item.waitingPeriods.afterYear.percentage,
    averageTime: item.averageTime,
    quickEmploymentRate: item.quickEmploymentRate,
  }));

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

  const colors = {
    beforeGraduation: BRAND_COLORS.primary.teal,
    withinYear: BRAND_COLORS.primary.blue,
    afterYear: BRAND_COLORS.secondary.rose,
    averageTime: BRAND_COLORS.secondary.slate,
    quickEmploymentRate: BRAND_COLORS.secondary.darkTeal,
  };

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg mb-4 font-neo-sans-medium">Employment Timeline by Education Level</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: -10,
            bottom: 5,
          }}
          barGap={0}
          barCategoryGap={30}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ 
              fill: '#9ca3af',
              fontSize: 12,
              fontFamily: brandData.typography.english.body
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ 
              fontSize: 12, 
              fill: '#9ca3af',
              fontFamily: brandData.typography.english.body
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: BRAND_COLORS.primary.navy,
              border: `1px solid ${BRAND_COLORS.primary.teal}`,
              borderRadius: '6px',
              fontFamily: brandData.typography.english.body
            }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#9ca3af' }}
          />
          <Legend 
            verticalAlign="top" 
            wrapperStyle={{
              fontFamily: brandData.typography.english.body
            }}
          />
          <Bar
            dataKey="beforeGraduation"
            name="Before Graduation"
            fill={colors.beforeGraduation}
            barSize={20}
          >
            <LabelList 
              dataKey="beforeGraduation" 
              position="center" 
              fill="#fff"
              formatter={(value: number) => `${value}%`}
              style={{
                fontFamily: brandData.typography.english.body
              }}
            />
          </Bar>
          <Bar
            dataKey="withinYear"
            name="Within Year"
            fill={colors.withinYear}
            barSize={20}
          >
            <LabelList 
              dataKey="withinYear" 
              position="center" 
              fill="#fff"
              formatter={(value: number) => `${value}%`}
              style={{
                fontFamily: brandData.typography.english.body
              }}
            />
          </Bar>
          <Bar
            dataKey="afterYear"
            name="After Year"
            fill={colors.afterYear}
            barSize={20}
          >
            <LabelList 
              dataKey="afterYear" 
              position="center" 
              fill="#fff"
              formatter={(value: number) => `${value}%`}
              style={{
                fontFamily: brandData.typography.english.body
              }}
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmploymentTimelineChart;
