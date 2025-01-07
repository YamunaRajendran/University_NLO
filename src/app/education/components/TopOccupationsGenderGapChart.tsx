import brandData from '@/app/education/brand/color.json';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend, TooltipProps } from 'recharts';

// Define brand colors locally
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

interface Props {
  data: {
    male: Array<{
      occupation: string;
      count: number;
      averageSalary: number;
    }>;
    female: Array<{
      occupation: string;
      count: number;
      averageSalary: number;
    }>;
  };
  generalMajor: string | null;
}

const TopOccupationsGenderGapChart: React.FC<Props> = ({ data, generalMajor }) => {
  // Transform data for the chart
  const transformedData = data.male.map(maleOcc => {
    const femaleOcc = data.female.find(f => f.occupation === maleOcc.occupation);
    return {
      occupation: maleOcc.occupation,
      Male: maleOcc.count,
      Female: femaleOcc?.count || 0,
      maleSalary: maleOcc.averageSalary,
      femaleSalary: femaleOcc?.averageSalary || 0
    };
  });

  if (!data || (data.male.length === 0 && data.female.length === 0)) {
    return (
      <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 font-roboto">No occupation data available</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg mb-4 font-neo-sans-medium">
        {generalMajor ? `Top Occupations in ${generalMajor}` : 'Top Occupations by Gender'}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={transformedData}
          layout="vertical"
          margin={{
            top: 20,
            right: 70,
            left: -40,
            bottom: 5
          }}
          barGap={-15}
          barCategoryGap={0}
        >
          <XAxis 
            type="number"
            tick={{ 
              fill: '#9ca3af',
              fontSize: 12,
              fontFamily: brandData.typography.english.body
            }}
          />
          <YAxis
            type="category"
            dataKey="occupation"
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
            formatter={(value: number, name: string, props: TooltipProps<number, string>) => {
              const payload = props.payload?.[0]?.payload;
              if (!payload?.maleSalary || !payload?.femaleSalary) return [value, name];
              
              if (name === 'Male' || name === 'Female') {
                const salary = name === 'Male' ? payload.maleSalary : payload.femaleSalary;
                return [`${value} (${salary.toLocaleString()} SAR)`, name];
              }
              return [value, name];
            }}
          />
          <Legend 
            verticalAlign="top"
            align="right"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span style={{ 
                color: '#9ca3af',
                fontFamily: brandData.typography.english.body,
                fontSize: '12px'
              }}>
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="Male"
            fill={BRAND_COLORS.primary.blue}
            maxBarSize={15}
          >
            <LabelList
              dataKey="Male"
              position="right"
              fill="#fff"
              fontSize={12}
              fontFamily={brandData.typography.english.body}
              formatter={(value: number) => value.toLocaleString()}
            />
          </Bar>
          <Bar
            dataKey="Female"
            fill={BRAND_COLORS.secondary.rose}
            maxBarSize={15}
          >
            <LabelList
              dataKey="Female"
              position="right"
              fill="#fff"
              fontSize={12}
              fontFamily={brandData.typography.english.body}
              formatter={(value: number) => value.toLocaleString()}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopOccupationsGenderGapChart;
