'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TopNarrowMajorsChartProps {
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

export default function TopNarrowMajorsChart({ 
  generalMajor, 
  narrowMajor, 
  data,
  onBarClick,
  onGeneralMajorSelect
}: TopNarrowMajorsChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      name: item.narrowMajor || item.occupation || '',  
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
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg mb-4">
        {!generalMajor 
          ? 'Top General Majors by Graduates'
          : narrowMajor 
            ? `Top Majors in ${narrowMajor}`
            : `Top Narrow Majors in ${generalMajor}`
        }
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 40,
            left: -10,
            bottom: 5
          }}
          onClick={(e) => e?.activePayload && handleClick(e.activePayload[0].payload)}
        >
          <defs>
            <linearGradient id="graduatesGradient" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#47edb8" stopOpacity={1} />
              <stop offset="100%" stopColor="#47edb8" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e365f" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fill: '#9ca3af' }}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ 
              fill: '#9ca3af',
              fontSize: 12
            }}
            width={180}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a1230',
              border: '1px solid #2e365f',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#9ca3af' }}
            formatter={(value: number) => [value.toLocaleString(), 'Graduates']}
          />
          <Bar 
            dataKey="value" 
            fill="url(#graduatesGradient)"
            radius={[0, 4, 4, 0]}
            cursor={!narrowMajor ? 'pointer' : 'default'}
            maxBarSize={30}
            label={{
              position: 'right',
              fill: '#9ca3af',
              formatter: (value: number) => value.toLocaleString()
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 