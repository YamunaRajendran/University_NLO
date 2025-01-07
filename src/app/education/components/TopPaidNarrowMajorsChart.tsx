'use client';

import brandData from '@/app/education/brand/color.json';
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TopPaidNarrowMajorsChartProps {
  generalMajor: string | null;
  narrowMajor?: string | null;
  data: Array<{
    narrowMajor: string;
    value: number;
    topMajors?: Array<{ major: string; value: number }>;
  }>;
  onBarClick?: (narrowMajor: string) => void;
  onGeneralMajorSelect?: (generalMajor: string) => void;
}

interface ClickEventData {
  name: string;
  value: number;
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

export default function TopPaidNarrowMajorsChart({ 
  generalMajor, 
  narrowMajor, 
  data,
  onBarClick,
  onGeneralMajorSelect
}: TopPaidNarrowMajorsChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      name: item.narrowMajor,
      value: item.value
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  }, [data]);

  const handleClick = (data: ClickEventData) => {
    if (!generalMajor && onGeneralMajorSelect && data.name) {
      onGeneralMajorSelect(data.name);
    } else if (!narrowMajor && onBarClick && data.name) {
      onBarClick(data.name);
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 font-roboto">No salary data available</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg mb-4 font-neo-sans-medium">
        {!generalMajor 
          ? 'Top Paying Educational levels'
          : narrowMajor 
            ? `Average Salaries in ${narrowMajor}`
            : 'Top Paying Narrow Majors'
        }
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 70,
            left: -80,
            bottom: 5
          }}
          onClick={(e) => e?.activePayload && handleClick(e.activePayload[0].payload)}
        >
          <XAxis 
            type="number"
            tick={{ 
              fill: '#9ca3af',
              fontSize: 12,
              fontFamily: brandData.typography.english.body
            }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ 
              fill: '#9ca3af',
              fontSize: 12,
              fontFamily: brandData.typography.english.body
            }}
            width={180}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: BRAND_COLORS.primary.navy,
              border: `1px solid ${BRAND_COLORS.primary.teal}`,
              borderRadius: '6px',
              fontFamily: brandData.typography.english.body
            }}
            labelStyle={{ 
              color: '#fff',
              fontFamily: brandData.typography.english.body
            }}
            itemStyle={{ 
              color: '#9ca3af',
              fontFamily: brandData.typography.english.body
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Average Salary']}
          />
          <Bar 
            dataKey="value" 
            fill={BRAND_COLORS.primary.teal}
            radius={[0, 4, 4, 0]}
            cursor={!narrowMajor ? 'pointer' : 'default'}
            maxBarSize={30}
            label={{
              position: 'right',
              fill: '#9ca3af',
              formatter: (value: number) => `$${value.toLocaleString()}`,
              style: {
                fontSize: 12,
                fontFamily: brandData.typography.english.body
              }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}