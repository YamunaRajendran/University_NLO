import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface SalaryDistributionChartProps {
  generalMajor: string | null;
  data: Array<{
    generalMajor?: string;
    narrowMajor?: string;
    occupation?: string;
    salary: number;
    percentage: number;
    median?: number;
  }>;
  onBarClick?: (narrowMajor: string) => void;
  onGeneralMajorSelect?: (generalMajor: string) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

interface BarClickData {
  originalData: {
    generalMajor?: string;
    narrowMajor?: string;
    occupation?: string;
  };
}

export default function SalaryDistributionChart({
  generalMajor,
  data,
  onBarClick,
  onGeneralMajorSelect
}: SalaryDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No salary distribution data available</p>
      </div>
    );
  }

  const chartData = [...data]
    .sort((a, b) => b.salary - a.salary)
    .map(item => ({

      name: item.narrowMajor || item.generalMajor || item.name,
      salary: item.salary,
      median: item.median,
      originalData: item // Keep the original data for click handling
    }));

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-[#0a1230] border border-[#2e365f] rounded-md p-3">
          <p className="text-white mb-1">{label}</p>
          <p className="text-gray-300">{`Salary: SAR ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: BarClickData) => {
    const item = data.originalData;
    if (!generalMajor && item.generalMajor && onGeneralMajorSelect) {
      onGeneralMajorSelect(item.generalMajor);
    } else if (generalMajor && item.narrowMajor && onBarClick) {
      onBarClick(item.narrowMajor);
    }
  };

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg mb-4">
        {generalMajor
          ? `Salary Distribution for ${data[0]?.narrowMajor || data[0]?.generalMajor || generalMajor}`
          : 'Overall Salary Distribution'
        }
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 90,
            left: 0,
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2e365f" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#9ca3af' }}
            tickFormatter={(value) => `SAR ${value.toLocaleString()}`}
            label={{
              value: 'Salary',
              position: 'insideBottom',
              fill: '#9ca3af',
              offset: -10
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{
              fill: '#9ca3af',
              fontSize: 12,
              width: 150,
              textAnchor: 'end'
            }}
            width={180}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="salary"
            fill="#a9267f"
            radius={[0, 4, 4, 0]}
            maxBarSize={25}
            label={{
              position: 'right',
              fill: '#9ca3af',
              formatter: (value: number) => `SAR ${value.toLocaleString()}`
            }}
            onClick={handleBarClick}
            cursor="pointer"
          />

          <ReferenceLine
            x={chartData[0]?.median}
            stroke="#2AB1BB"
            strokeWidth={2}
            label={{
              value: `Median: SAR ${chartData[0]?.median?.toLocaleString()}`,
              fill: '#2AB1BB',
              position: 'top',
              fontSize: 12,
              fontWeight: 'bold'
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}