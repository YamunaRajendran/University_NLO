import React from 'react';
// import { ResponsiveContainer } from 'recharts';
import { ResponsiveBar } from '@nivo/bar';

interface TopMajorsByHighestPaidOccupationChartProps {
  generalMajor: string | null;
  data: Array<{
    major: string;
    averageSalary: number;
    occupation: string;
  }>;
}

export default function TopMajorsByHighestPaidOccupationChart({ 
  data 
}: TopMajorsByHighestPaidOccupationChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const chartData = data
    .sort((a, b) => b.averageSalary - a.averageSalary)
    .map(item => ({
      name: item.major,
      "Average Salary": item.averageSalary
    }))
    .reverse();

  return (
    <div className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-200 mb-4">Highest Paid Occupations</h3>
      <div style={{ height: '80%' }}>
        <ResponsiveBar
          data={chartData}
          keys={["Average Salary"]}
          indexBy="name"
          layout="horizontal"
          margin={{ top: 20, right: 20, left: 150, bottom: 20 }}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band' }}
          colors={["#60a5fa"]}
          borderRadius={4}
          enableGridY={false}
          enableGridX={false}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32,
            tickValues: 5,
            format: value => `${value.toLocaleString()}`,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          role="application"
          isInteractive={true}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: "#9ca3af"
                }
              }
            }
          }}
          layers={[
            'grid',
            'axes',
            ({ bars, }) => {
              return bars.map(bar => {
                const { x, y, width, height, color } = bar;
                return (
                  <g key={`${x}-${y}`}>
                    <defs>
                      <linearGradient id={`gradient-${x}-${y}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    {/* Main bar */}
                    <rect x={x} y={y} width={width} height={height} fill={`url(#gradient-${x}-${y})`} />
                    {/* Top face */}
                    <path 
                      d={`M ${x},${y} l 10,-5 l ${width},0 l -10,5 z`} 
                      fill={color} 
                      opacity={0.9}
                    />
                    {/* Side face */}
                    <path 
                      d={`M ${x + width},${y} l 10,-5 l 0,${height} l -10,5 z`} 
                      fill={color} 
                      opacity={0.7}
                    />
                  </g>
                );
              });
            },
            'bars',
            'markers',
            'legends',
          ]}
        />
      </div>
    </div>
  );
}
