import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from 'recharts';

// interface WaitingPeriods {
//   beforeGraduation: { count: number; percentage: number };
//   withinYear: { count: number; percentage: number };
//   afterYear: { count: number; percentage: number };
// }

interface EmploymentTimeline {
  generalMajor?: string;
  averageTime: number;
  quickEmploymentRate: number;
  waitingPeriods: {
    beforeGraduation: { count: number; percentage: number };
    withinYear: { count: number; percentage: number };
    afterYear: { count: number; percentage: number };
  };
}

interface Props {
  generalMajor: string | null;
  data: EmploymentTimeline[];
  onBarClick?: (narrowMajor: string) => void;
  onGeneralMajorSelect?: (generalMajor: string) => void;
}

interface ChartData {
  name: string | undefined;
  "Before Graduation": number;
  "Within First Year": number;
  "After First Year": number;
}

interface BarClickData {
  payload: {
    originalData?: {
      generalMajor?: string;
      narrowMajor?: string;
    };
  };
}

export default function EmploymentTimelineChart({ 
  data,
  generalMajor,
  onBarClick,
  onGeneralMajorSelect
}: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg flex items-center justify-center h-[400px]">
        <p className="text-gray-400">No employment timeline data available</p>
      </div>
    );
  }

  const handleBarClick = (data: BarClickData) => {
    if (!generalMajor && data.payload.originalData?.generalMajor && onGeneralMajorSelect) {
      onGeneralMajorSelect(data.payload.originalData.generalMajor);
    } else if (generalMajor && data.payload.originalData?.narrowMajor && onBarClick) {
      onBarClick(data.payload.originalData.narrowMajor);
    }
  };

  const transformedData: ChartData[] = data.map((item) => ({
    name: item.generalMajor,
    "Before Graduation": item.waitingPeriods.beforeGraduation.percentage,
    "Within First Year": item.waitingPeriods.withinYear.percentage,
    "After First Year": item.waitingPeriods.afterYear.percentage,
    originalData: item // Keep original data for click handling
  }));

  return (
    <div className="bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
      <h3 className="text-white text-lg mb-4">Employment Timeline Distribution</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={transformedData}
            layout="vertical"
            margin={{ top: 20, right: 70, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2e365f" horizontal={false} />
            <XAxis 
              type="number"
              tick={{ fill: '#9ca3af' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              width={180}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a1230',
                border: '1px solid #2e365f',
                borderRadius: '6px',
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ paddingBottom: '10px' }}
              formatter={(value) => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>}
            />
            
            <Bar
              dataKey="Before Graduation"
              fill="#22c55e"
              stackId="a"
              name="Before Graduation"
              maxBarSize={30}
              onClick={handleBarClick}
              cursor="pointer"
            >
              <LabelList dataKey="Before Graduation" position="inside" fill="#fff" fontSize={12} />
            </Bar>
            <Bar
              dataKey="Within First Year"
              fill="#f59e0b"
              stackId="a"
              name="Within First Year"
              maxBarSize={30}
              onClick={handleBarClick}
              cursor="pointer"
            >
              <LabelList dataKey="Within First Year" position="inside" fill="#fff" fontSize={12} />
            </Bar>
            <Bar
              dataKey="After First Year"
              fill="#ef4444"
              stackId="a"
              name="After First Year"
              maxBarSize={30}
              onClick={handleBarClick}
              cursor="pointer"
            >
              <LabelList dataKey="After First Year" position="inside" fill="#fff" fontSize={12} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
