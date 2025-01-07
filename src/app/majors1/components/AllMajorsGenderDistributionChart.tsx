'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface Props {
  generalMajor: string | null;
  data: Array<{
    generalMajor?: string;
    male: { count: number; percentage: number };
    female: { count: number; percentage: number };
  }>;
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percentage: number;
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: CustomLabelProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percentage } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const isRightSide = midAngle >= -90 && midAngle <= 90;
  const textAnchor = isRightSide ? 'start' : 'end';
  const xOffset = isRightSide ? 5 : -5;

  return (
    <text 
      x={x + xOffset} 
      y={y} 
      fill="white" 
      textAnchor={textAnchor}
      dominantBaseline="middle"
      fontSize="10"
    >
      {`${percentage.toFixed(1)}%`}
    </text>
  );
};

export default function GenderDistributionChart({
  generalMajor,
  data
}: Props) {
  if (data.length === 0) {
    return (
      <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No gender distribution data available</p>
      </div>
    );
  }

  const selectedData = generalMajor
    ? data.find(item => item.generalMajor === generalMajor)
    : data[0];

  if (!selectedData) {
    return (
      <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No gender distribution data available</p>
      </div>
    );
  }

  const chartData = [
    { 
      name: 'Male', 
      value: selectedData.male.count,
      percentage: selectedData.male.percentage
    },
    { 
      name: 'Female', 
      value: selectedData.female.count,
      percentage: selectedData.female.percentage
    }
  ];

  const COLORS = ['#266bfc', '#a9267f'];
  const totalGraduates = selectedData.male.count + selectedData.female.count;

  return (
    <div className="h-[300px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-3 rounded-lg">
      <div className="h-[calc(100%-2rem)] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="40%"
              innerRadius="40%"
              outerRadius="60%"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a1230',
                border: '1px solid #2e365f',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#fff'}}
              itemStyle={{ color: '#9ca3af' }}
              formatter={(value: ValueType, name: NameType) => {
                if (typeof value !== 'number') return [value.toString(), name];
                const entry = chartData.find(item => item.value === value);
                if (!entry) return [value.toLocaleString(), name];
                return [
                  `${value.toLocaleString()} (${entry.percentage.toFixed(1)}%)`,
                  name
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2.01 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-white text-sm font-semibold ">{totalGraduates.toLocaleString()}</div>
          <div className="text-gray-400 text-xs">Total</div>
          <div className="text-gray-400 text-xs ">Graduates</div>
          <div></div>
        </div>
        <div className="absolute bottom-3 w-full flex justify-center gap-6">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
              <span className="text-gray-400 text-sm">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}