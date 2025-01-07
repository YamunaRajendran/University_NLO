import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList
} from 'recharts';
import { GenderGapRanking } from '../types';
import { typography } from '@/app/comparison/branding';

interface GenderGapRankingChartProps {
  generalMajor: string | null;
  data: Array<GenderGapRanking>;
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

export default function GenderGapRankingChart({
  data
}: GenderGapRankingChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 font-roboto">No gender gap data available</p>
      </div>
    );
  }

  // Sort data by gender gap value for better visualization
  const sortedData = [...data]
    .sort((a, b) => Math.abs(b.genderGap) - Math.abs(a.genderGap))
    .slice(0, 5)
    .map(item => ({
      name: item.educationLevel,
      Male: item.malePercentage,
      Female: item.femalePercentage,
      'Gender Gap': item.genderGap,
    }));

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-4 rounded-lg">
      <h3 className="text-white text-lg mb-4 font-neos-sans-medium">Gender Gap by Education Level</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: -40,
            bottom: 5
          }}
          barGap={-28}
          barCategoryGap={0}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ 
              fill: '#9ca3af',
              fontFamily: typography.english.body
            }}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ 
              fill: '#9ca3af',
              fontSize: 12,
              fontFamily: typography.english.body
            }}
            width={180}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: BRAND_COLORS.primary.navy,
              border: `1px solid ${BRAND_COLORS.primary.teal}`,
              borderRadius: '6px',
              fontFamily: typography.english.body
            }}
            labelStyle={{ 
              color: '#fff',
              fontFamily: typography.english.body
            }}
            itemStyle={{ 
              color: '#9ca3af',
              fontFamily: typography.english.body
            }}
            formatter={(value: number) => [`${value}%`]}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ 
                color: '#9ca3af',
                fontFamily: typography.english.body
              }}>
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="Male"
            fill={BRAND_COLORS.primary.blue}
            radius={[4, 4, 4, 4]}
            maxBarSize={12}
          >
            <LabelList
              dataKey="Male"
              position="right"
              fill="#fff"
              fontSize={12}
              formatter={(value: number) => `${value}%`}
              style={{
                fontFamily: typography.english.body
              }}
            />
          </Bar>
          <Bar
            dataKey="Female"
            fill={BRAND_COLORS.secondary.rose}
            radius={[4, 4, 4, 4]}
            maxBarSize={12}
          >
            <LabelList
              dataKey="Female"
              position="right"
              fill="#fff"
              fontSize={12}
              formatter={(value: number) => `${value}%`}
              style={{
                fontFamily: typography.english.body
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
