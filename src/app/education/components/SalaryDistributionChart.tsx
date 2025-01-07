import brandData from '@/app/education/brand/color.json';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ChartData {
  educationLevel: string;
  salary: number;


   
  percentage: number;
  median: number;
}

interface Props {
  data: ChartData[]; 
  title: string;
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

const SalaryDistributionChart: React.FC<Props> = ( props: Props) => {
  if (props.data.length === 0) {
    return (
      <div className="h-[400px] bg-white rounded-lg border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500 font-roboto">No salary distribution data available</p>
      </div>
    );
  }

  // Sort data by salary for better visualization
  const sortedData = [...props.data]
    .sort((a, b) => b.salary - a.salary)
    .map(item => ({
      name: item.educationLevel,
      salary: item.salary,
      median: item.median,
      percentage: item.percentage
    }));

  // const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  //   if (active && payload && payload.length > 0) {
  //     const data = payload[0].payload;
  //     return (
  //       <div className="bg-[#1a2657] border border-[#2e365f] rounded-md p-3 shadow-lg font-roboto">
  //         <p className="font-neosans-bold text-white">{label}</p>
  //         <p className="text-gray-400">{`Salary: ${data.salary.toLocaleString()} SAR`}</p>
  //         <p className="text-gray-400">{`Median: ${data.median.toLocaleString()} SAR`}</p>
  //         <p className="text-gray-400">{`Percentage: ${data.percentage}%`}</p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg mb-4 font-neo-sans-medium">Salary Distribution</h3>
      <ResponsiveContainer width="100%" height="95%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{
            top: 5,
            right: 60,
            left: -35,
            bottom: 20
          }}
        >
          <XAxis
            type="number"
            tickFormatter={(value) => `${value.toLocaleString()} SAR`}
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
              fill: '#9ca3af',
              fontSize: 12,
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
            labelStyle={{ 
              color: '#fff',
              fontFamily: brandData.typography.english.body
            }}
            itemStyle={{ 
              color: '#9ca3af',
              fontFamily: brandData.typography.english.body
            }}
          />
          <Bar
            dataKey="salary"
            fill={BRAND_COLORS.primary.teal}
            radius={[0, 4, 4, 0]}
            maxBarSize={30}
            label={{ 
              position: 'right',
              formatter: (value: number) => `${value.toLocaleString()} SAR`,
              fill: '#fff',
              fontSize: 12,
              fontFamily: brandData.typography.english.body
            }}
          />
          <ReferenceLine
            x={sortedData[0]?.median}
            stroke={BRAND_COLORS.secondary.rose}
            strokeDasharray="3 3"
            label={{
              value: 'Median',
              position: 'insideTopLeft',
              fill: BRAND_COLORS.secondary.rose,
              fontFamily: brandData.typography.english.body
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalaryDistributionChart;