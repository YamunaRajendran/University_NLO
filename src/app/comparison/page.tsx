'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import comparisonData from './original.json';
import {  typography } from '@/app/comparison/branding';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  
  LabelList,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaChartBar, FaChartPie, FaUndo,  FaTimes } from 'react-icons/fa';

type MetricCategory = 'graduateMetrics' | 'employmentMetrics';
type MajorLevel = 'generalMajors' | 'narrowMajors' | 'majors' ;

// interface CheckboxProps {
//   checked: boolean;
//   onChange: () => void;
//   disabled?: boolean;
//   label: string;
// }

interface MetricData {
  name: string;
  totalGraduates: number;
  maleGraduates: number;
  femaleGraduates: number;
}

interface MetricEntry {
  name: string;
  employmentRate?: number;
  averageSalary?: number;
  averageTimeToEmployment?: number;
  totalGraduates?: number;
  maleGraduates?: number;
  femaleGraduates?: number;
  beforeGraduation?: number;
  withinYear?: number;
  afterYear?: number;
}

// const CustomCheckbox: React.FC<CheckboxProps> = ({ checked, onChange, disabled, label }) => {
//   return (
//     <div className="flex items-center space-x-2">
//       <div 
//         onClick={() => !disabled && onChange()}
//         className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all duration-200 ${
//           checked 
//             ? 'bg-[#4ADBFF] border-[#4ADBFF]' 
//             : 'border-[#4ADBFF]/20 hover:border-[#4ADBFF]/40'
//         } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//       >
//         {checked && <FaCheck size={12} className="text-black" />}
//       </div>
//       <label className="text-sm font-medium leading-none text-white cursor-pointer">
//         {label}
//       </label>
//     </div>
//   );
// };

const TotalGraduatesChart = ({ data }: { data: MetricData[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: 10,
          bottom: 40
        }}
        barSize={30}
        barGap={8}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
        <XAxis 
          dataKey="name" 
          angle={-35}
          textAnchor="end"
          height={60}
          interval={0}
          tick={(props) => {
            const { x, y, payload } = props;
            const words = payload.value.split(' ');
            const firstLine = words.slice(0, -2).join(' ');
            const secondLine = words[words.length - 1];
            
            
            return (
              <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                  y={10}
                    textAnchor="end"
                    fill="white"
                  fontSize={12}
                  fontWeight={500}
                  transform="rotate(-45)"
                  fontFamily = {typography.english.body}

                  >
                  <tspan x={0} dy="0">{firstLine}</tspan>
                  <tspan x={0} dy="1.2em">{secondLine}</tspan>
                  
                  </text>
              </g>
            );
          }}
          tickLine={{ stroke: 'white' }}
          axisLine={{ stroke: 'white' }}
        />
        <YAxis
          tick={{ 
            fill: 'white',
            fontSize: 12,
            fontWeight: 500,
            fontFamily: typography.english.body
          }}
          tickLine={{ stroke: 'white' }}
          axisLine={{ stroke: 'white' }}
          label={{
            value: 'Total Graduates',
            angle: -90,
            position: 'insideLeft',
            fill: 'white',
            offset: 0,
            style: { 
              textAnchor: 'middle',
              fontWeight: 500,
              fontSize: 14
            }
          }}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.1)' }}
          contentStyle={{
            backgroundColor: '#0a1230',
            border: '1px solid #4ADBFF',
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(74,219,255,0.15)',
            fontFamily: typography.english.body
          }}
          labelStyle={{ color: 'white', fontWeight: 600, marginBottom: '4px' ,fontFamily: typography.english.body}}
          itemStyle={{ color: '#4ADBFF', fontWeight: 500 }}
        />
        <Bar 
          dataKey="totalGraduates" 
          fill="#4ADBFF"
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`}
              fill={`hsl(195, 100%, ${65 - (index * 5)}%)`}
            />
          ))}
          <LabelList 
            dataKey="totalGraduates" 
            position="top" 
            fill="white"
            formatter={(value: number) => value.toLocaleString()}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              fontFamily: typography.english.body
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function ComparisonPage() {
const [level, setLevel] = useState<MajorLevel|undefined>(undefined);
const [metricCategory] = useState<MetricCategory>('employmentMetrics');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (level) {
      const items = comparisonData.compareChartInsights[metricCategory][level].map(item => item.name);
      setAvailableItems(items);
      setSelectedItems([]); // Reset selections when major type changes
      setSearchQuery(''); // Reset search when level changes
    }
  }, [level, metricCategory]);

  const filteredItems = availableItems.filter(item => 
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReset = () => {
    setLevel(undefined);
    setSelectedItems([]);
  };

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        // Limit to 5 selections
        if (prev.length >= 5) return prev;
        return [...prev, item];
      }
    });
  };

  // Get metrics for selected items
  const getMetricsData = (): MetricEntry[] => {
    const validSelections = selectedItems;
    if (validSelections.length === 0 || !level) return [];

    return validSelections.map(itemName => {
      const itemData = comparisonData.compareChartInsights[metricCategory][level]
        .find(item => item.name === itemName);
      
      if (!itemData) return null;

      return {
        ...itemData
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  };

  // Format value for display
  // const formatValue = (value: number, key: string) => {
  //   if (key.toLowerCase().includes('rate')) {
  //     return `${value}%`;
  //   } else if (key.toLowerCase().includes('salary')) {
  //     return `${value.toLocaleString()} SAR`;
  //   } else if (key.toLowerCase().includes('time')) {
  //     return `${value} days`;
  //   }
  //   return value.toLocaleString();
  // };

  // Get available metrics for the current category
  const getAvailableMetrics = () => {
    if (level) {
      const metrics = comparisonData.compareChartInsights[metricCategory][level][0] || {};
      return Object.keys(metrics).filter(key => key !== 'name');
    } else {
      return [];
    }
  };

  return (
    <div className="min-h-screen w-full p-1"  >
      <div className="flex flex-col h-full space-y-3 p-4" >
        <h1 className="text-2xl font-bold font-neo-sans-bold text-white flex items-center gap-3" >
          <FaChartBar className="text-[#4ADBFF]"  />
          Major Comparison
        </h1>

        <div className="flex-1 grid grid-rows-[auto,1fr] gap-3 " >
          <div className="max-w-8xl mx-auto font-neo-sans-medium w-full" >
            <div className="w-full overflow-x-auto">
            <Card className="bg-gradient-to-br from-[#1a2657] to-[#0f1631] p-4 rounded-lg border border-[#4ADBFF]/20 hover:border-[#4ADBFF]/40 transition-all duration-300 lg:col-span-3" >
            <div className="flex flex-col gap-3" >
                  {/* Selected Majors Display */}
                  {selectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedItems.map((item, index) => (
                        <div 
                          key={index}
                          className="bg-[#1a2657]/80 text-white px-3 py-1.5 rounded-full border border-[#4ADBFF]/20 flex items-center gap-2"
                        >
                          <span className="text-sm">{item}</span>
                          <button
                            onClick={() => handleItemToggle(item)}
                            className="text-[#4ADBFF] hover:text-[#4ADBFF]/80 transition-colors"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mb-2">
                    {/* Level Selection */}
                    <div className="w-44 group">
                    
                      <Select
                        value={level || ""}
                        onValueChange={(value: string) => {
                          setLevel(value as MajorLevel);
                          setSelectedItems([]);
                        }}
                      >
                        <SelectTrigger className="bg-white border-[#4ADBFF]/20 text-black h-10 transition-all duration-200 hover:border-[#4ADBFF]/40 focus:border-[#4ADBFF]/60 group-hover:border-[#4ADBFF]/40">
                          <SelectValue placeholder="Select Major Level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white font-neo-sans-medium border-[black]">
                          <SelectItem value="generalMajors" className="text-black hover:bg-blue-900 focus:bg-blue-300">General Majors</SelectItem>
                          <SelectItem value="narrowMajors" className="text-black hover:bg-blue-900 focus:bg-blue-300">Narrow Majors</SelectItem>
                          <SelectItem value="majors" className="text-black hover:bg-blue-900 focus:bg-blue-300">Specific Majors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Major Selection with Checkboxes */}
                    {level && (
                      <div className="flex-1">
                        <div className="relative w-[300px] font-neo-sans-medium">
                          <Select
                            value="multiple"
                            onValueChange={() => {}}
                          >
                            <SelectTrigger className="bg-white border-[#4ADBFF]/20 text-black h-10 transition-all duration-200 hover:border-[#4ADBFF]/40 focus:border-[#4ADBFF]/60" >
                              <SelectValue >
                                {selectedItems.length === 0 
                                  ? "Select Majors To Compare" 
                                  : `${selectedItems.length} Major${selectedItems.length > 1 ? 's' : ''} Selected`}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white font-neo-sans-medium border-[#4ADBFF]/20">
                              <div className="p-2">
                                <div className="mb-2">
                                  <input
                                    type="text"
                                    placeholder="Search majors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-2 py-1.5 bg-white border border-[#4ADBFF]/70 rounded text-black text-sm focus:outline-none focus:border-[#4ADBFF]/80"
                                  />
                                </div>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                  {filteredItems.map((item) => (
                                    <label
                                      key={item}
                                      className="flex items-center px-2 py-1.5 rounded hover:bg-blue-300 cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item)}
                                        onChange={() => handleItemToggle(item)}
                                        className="w-4 h-4 rounded border-[#4ADBFF]/40 bg-transparent mr-3"
                                      />
                                      <span className="text-black">{item}</span>
                                    </label>
                                  ))}
                                  {filteredItems.length === 0 && (
                                    <div className="text-white/50 text-sm px-2 py-1.5">
                                      No majors found
                                    </div>
                                  )}
                                </div>
                              </div>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Reset Button - Only show when at least one item is selected */}
                    <div className="flex items-end">
                      <button 
                        onClick={handleReset}
                        className="h-10 px-3 bg-red-700 hover:bg-red-500/20 text-white border border-red-500/30 hover:border-red-500/50 rounded-md flex items-center justify-center gap-2 transition-all duration-200 group"
                      >
                        <FaUndo className="group-hover:rotate-[-45deg] transition-transform duration-300" />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          

          {/* Charts */}
          <div className="flex flex-col gap-3">
            {/* Total Graduates and Gender Distribution Container */}
            {selectedItems.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Total Graduates Chart */}
                <div className="w-full lg:w-[450px] min-h-[300px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-4 md:p-6 rounded-lg shadow-xl hover:shadow-[#4ADBFF]/10 transition-all duration-300">
                  <h3 className="text-white text-lg font-neo-sans-bold mb-4 md:mb-6 flex items-center gap-2 " >
                  
                    <FaChartBar className="text-[#4ADBFF]" />
                    Total Graduates
                  </h3>
                  <div className="h-[300px]">
                    <TotalGraduatesChart 
                      data={level ? comparisonData.compareChartInsights.graduateMetrics[level]
                        .filter((item: MetricData) => selectedItems.includes(item.name)) : []}
                    />
                  </div>
                </div>

                {/* Gender Distribution Chart */}
                <div className="lg:flex-1" >
                  <div className="h-full min-h-[300px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-1 md:p-6 rounded-lg shadow-xl hover:shadow-[#4ADBFF]/10 transition-all duration-300">
                    <h3 className="text-white text-lg font-neo-sans-medium mb-4 md:mb-6 flex items-center gap-2 " >
                      <FaChartPie className="text-[#4ADBFF]" />
                      Gender Distribution
                      {/* <span className="ml-auto text-sm text-[#4ADBFF]">{selectedItems.length} Selected</span> */}
                    </h3>

                    <div 
                      className={`grid w-full ${
                        selectedItems.length <= 2 
                          ? 'grid-cols-2' 
                          : selectedItems.length === 3 
                          ? 'grid-cols-3' 
                          : selectedItems.length === 4 
                          ? 'grid-cols-4'
                          : 'grid-cols-5'
                      } gap-4` }
                    >
                      {selectedItems.map((item, index) => {
                        if (!level) return null;
                        const genderData = comparisonData.compareChartInsights.graduateMetrics[level].find(
                          (major) => major.name === item
                        );

                        if (!genderData) return null;

                        const maleCount = genderData.maleGraduates;
                        const femaleCount = genderData.femaleGraduates;
                        const totalStudents = maleCount + femaleCount;

                        return (
                          <div
                            key={index}
                            className="flex-1 bg-[#16214b] rounded-lg p-4"
                            style={{ fontFamily: typography.english.body }}
                          >
                            <h4 className="text-white text-sm font-medium mb-4 whitespace-normal min-h-[40px] text-center" title={item}>
                              {item.split(' ').map((word, i, arr) => (
                                <span key={i}>
                                  {word}
                                  {i < arr.length - 1 && ' '}
                                  {i === Math.floor(arr.length / 2) - 1 && <br />}
                                </span>
                              ))}
                            </h4>
                            
                            <div className="h-[130px] relative">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: 'Male', value: maleCount },
                                      { name: 'Female', value: femaleCount }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={20}
                                    outerRadius={45}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                      return (
                                        <text
                                          x={x}
                                          y={y}
                                          fill="white"
                                          fontSize={10}
                                          textAnchor="middle"
                                          dominantBaseline="middle"
                                        >
                                          {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                      );
                                    }}
                                  >
                                    {[
                                      { name: 'Male', value: maleCount },
                                      { name: 'Female', value: femaleCount }
                                    ].map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.name === 'Male' ? '#4ADBFF' : '#ca5f6b'} stroke="none" />
                                    ))}
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>

                            <div className="space-y-1 mt-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[#4ADBFF]"></span>
                                  <span className="text-white text-sm">Male</span>
                                </div>
                                <span className="text-[#4ADBFF] text-sm">{maleCount.toLocaleString()} </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[#ca5f6b]"></span>
                                  <span className="text-white text-sm">Female</span>
                                </div>
                                <span className="text-[#ca5f6b] text-sm">{femaleCount.toLocaleString()} </span>
                              </div>
                              <div className="pt-3 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                  <span className="text-white/90 text-sm">Total Students</span>
                                  <span className="text-[#4ADBFF] text-sm">{totalStudents.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Metric Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 h-full">
              {getMetricsData().length > 0 && getAvailableMetrics().map((metric) => {
                const baseColors = {
                  employmentRate: { 
                    gradient: ['#00E5FF', '#0091EA', '#2962FF', '#0D47A1'],
                    text: '#00E5FF'
                  },
                  averageSalary: { 
                    // gradient: ['#00E676', '#00C853', '#00BFA5', '#00695C'],
                    gradient: ['#2db0ba', '#2db0ba', '#2db0ba', '#2db0ba'],
                    text: '#2db0ba'
                  },
                  averageTimeToEmployment: { 
                    gradient: ['#ac4762', '#ac4762', '#ac4762', '#ac4762'],
                    text: '#ac4762' 
                  }
                  
                };

                // const getChartColor = (index: number, metric: string) => {
                //   const colors = baseColors[metric as keyof typeof baseColors];
                //   return colors ? colors.gradient[index % colors.gradient.length] : '#4ADBFF';
                // };

                const getTextColor = (metric: string) => {
                  const colors = baseColors[metric as keyof typeof baseColors];
                  return colors ? colors.text : '#2db0ba';
                };

                return (
                  <Card key={metric} className="bg-gradient-to-br from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg border border-[#4ADBFF]/20 hover:border-[#4ADBFF]/40 transition-all duration-300">
                    <h3 className="text-lg font-medium font-neo-sans-bold text-white mb-6 flex items-center gap-2" >
                      <FaChartBar className={`text-[#4ADBFF]`} />
                      {metric.split(/(?=[A-Z])/).join(' ')}
                    </h3>
                    <div className="flex flex-col">
                      {metric === 'employmentRate' ? (
                        <div className="relative h-[300px] mb-3">
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadialBarChart
                                cx="50%"
                                cy="40%"
                                innerRadius="20%"
                                outerRadius="90%"
                                barSize={20}
                                
                                data={getMetricsData().sort((a, b) => (a.employmentRate ?? 0) - (b.employmentRate ?? 0))}
                                startAngle={0}
                                endAngle={360}
                              >
                                <RadialBar
                                  // minAngle={15}
                                  background={true}
                                  // clockWise={true}
                                  // paddingAngle={5}
                                  dataKey={metric}
                                  cornerRadius={10}
                                  label={{ fill: 'white',
                                    position:'middle',
                                    formatter: (value: number) => `${value}`,
                                    fontSize: 8,
                                    angle: 0,
                                    offset:15,
                                    textAnchor: 'middle'
                                   }}
                                >
                                  {getMetricsData().map((entry, index) => {
                                    const colors = ['#4DD0E1',  '#5C6BC0', '#777585','#ca5f6b','#2db0ba'];
                                    return (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                      />
                                    );
                                  })}
                                </RadialBar>
                                <Tooltip
                                  cursor={false}
                                  contentStyle={ {fontFamily: typography.english.body} }
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-[#0a1230] border  border-[#4ADBFF] rounded-lg p-3 shadow-lg" >
                                          <p className="text-white font-semibold mb-1">{data.name}</p>
                                          <p className="text-[#4ADBFF]">Employment Rate: {data.employmentRate}%</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </RadialBarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Labels below chart */}
                          <div className="absolute bottom-0 left-0 w-full flex flex-col items-start space-y-1">
                            {getMetricsData()
                              .sort((a, b) => (a.employmentRate ?? 0) - (b.employmentRate ?? 0))
                              .map((entry, index) => {
                                const colors = ['#4DD0E1', '#5C6BC0', '#777585','#ca5f6b','#2db0ba'];
                                return (
                                  <div key={`legend-${index}`} className="flex items-center gap-2 text-white text-sm">
                                    <div 
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: colors[index % colors.length] }}
                                    />
                                    <span style={{ fontFamily: typography.english.body }}>{entry.name} - ({entry.employmentRate}%)</span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-[300px] mb-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getMetricsData()}
                              layout="vertical"
                              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                            >
                              {/* <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} /> */}
                              <XAxis 
                                type="number"
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: typography.english.body}}
                                interval={0}
                                angle={0}
                                textAnchor="end"
                                height={40}
                              />
                              <YAxis 
                                type="category"
                                dataKey="name"
                                tick={{ 
                                  fill: 'white',
                                  fontSize: 12,
                                  width: 100,
                                  textAnchor: 'end',
                                  fontFamily: typography.english.body
                                }}
                                tickLine={{ stroke: 'white' }}
                                axisLine={{ stroke: 'white' }}
                                width={110}
                              />
                              <Bar 
                                dataKey={metric} 
                                fill={getTextColor(metric)}
                                radius={[0, 4, 4, 0]}
                                barSize={25}
                              >
                                <LabelList
                                  dataKey={metric}
                                  position="right"
                                  fill="white"
                                  fontSize={11}
                                  fontFamily={typography.english.body}
                                  formatter={(value: number) => {
                                    if (metric === 'employmentRate') return `${value}%`;
                                    if (metric === 'averageSalary') return `${(value/1000).toFixed(1)}k`;
                                    return `${value} d`;
                                  }}
                                />
                              </Bar>
                              <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                contentStyle={{
                                  backgroundColor: '#0a1230',
                                  border: `1px solid ${getTextColor(metric)}`,
                                  borderRadius: '8px',
                                  fontFamily: typography.english.body
                                }}
                                labelStyle={{ color: 'white', fontFamily: typography.english.body }}
                                formatter={(value: number) => {
                                  if (metric === 'employmentRate') return [`${value}%`, 'Employment Rate'];
                                  if (metric === 'averageSalary') return [`${(value/1000).toFixed(1)}k`, 'Average Salary'];
                                  return [`${value} days`, 'Time to Employment'];
                                }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                          <div className="absolute -bottom-6 left-0 right-0 text-center text-white text-sm" style={{ fontFamily: typography.english.body }}>
                            {metric === 'employmentRate' ? 'Percentage (%)' : 
                             metric === 'averageSalary' ? 'Salary (SAR)' : 
                             'Days'}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
              {/* Grouped Bar Chart */}
              {getMetricsData().length > 0 && (
                <Card className="bg-gradient-to-br from-[#1a2657] to-[#0f1631] p-6 rounded-lg border border-[#4ADBFF]/20 hover:border-[#4ADBFF]/40 transition-all duration-300 lg:col-span-3">
                  <h3 className="text-lg font-medium font-neo-sans-bold text-white mb-4 flex items-center gap-2 " >
                    <FaChartBar className="text-[#4ADBFF]" />
                    Metrics Comparison
                  </h3>
                  <div className="h-[400px]" style={{ fontFamily: typography.english.body }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={500}
                        data={getMetricsData()}
                        margin={{
                          top: 30,
                          right: 30,
                          left: 20,
                          bottom: 10
                        }}
                        barSize={30}
                        barGap={8}
                      >
                        <defs>
                          <linearGradient id="employmentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4ADBFF" stopOpacity={1} />
                            <stop offset="100%" stopColor="#4ADBFF" stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ac4762" stopOpacity={1} />
                            <stop offset="100%" stopColor="#ac4762" stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c8c7ce" stopOpacity={1} />
                            <stop offset="100%" stopColor="#c8c7ce" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          vertical={false}
                          stroke="rgba(255, 255, 255, 0.1)"
                        />
                        <XAxis 
                          dataKey="name" 
                          angle={0}
                          textAnchor="middle"
                          height={100}
                          axisLine={{ stroke: 'white' }}
                          tickLine={{ stroke: 'white' }}
                          interval={0}
                          tick={(props) => {
                            const { x, y, payload } = props;
                            const words = payload.value.split(' ');
                            const maxWordsPerLine = 2;
                            const lines = [];
                            
                            for (let i = 0; i < words.length; i += maxWordsPerLine) {
                              lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
                              }
                            
                            return (
                              <g transform={`translate(${x},${y})`}>
                                {lines.map((line, index) => (
                                  <text
                                    key={index}
                                    x={0}
                                    y={0}
                                    dy={16 * (index + 1)}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize={13}
                                    fontFamily={typography.english.body}
                                  >
                                    {line}
                                  </text>
                                ))}
                              </g>
                            );
                          }}
                        />
                        {/* Employment Rate Y-axis */}
                        <YAxis 
                          yAxisId="left"
                          orientation="left"
                          tick={{ fill: '#4ADBFF', fontSize: 14, fontWeight: 900, }}
                          tickFormatter={(value: number) => `${value}%`}
                          domain={[0, 100]}
                          axisLine={{ stroke: '#4ADBFF' }}
                          tickLine={{ stroke: '#4ADBFF' }}
                          label={{ 
                            value: 'Employment Rate (%)',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#4ADBFF',
                            offset: 0,
                            dx: -10,
                            style: { fontWeight: 500, textAnchor: 'middle' }
                          }}
                        />
                        {/* Average Salary Y-axis */}
                        <YAxis 
                          yAxisId="middle"
                          orientation="right"
                          tick={{ fill: '#ac4762', fontSize: 14, fontWeight: 900 }}
                          tickFormatter={(value: number) => `${(value/1000).toFixed(1)}k`}
                          domain={[0, 'auto']}
                          axisLine={{ stroke: '#ac4762' }}
                          tickLine={{ stroke: '#ac4762' }}
                          width={90}
                          label={{ 
                            value: 'Average Salary (SAR)',
                            angle: -90,
                            position: 'insideRight',
                            fill: '#ac4762',
                            offset: 30,
                            style: { fontWeight: 500, textAnchor: 'middle' }
                          }}
                        />
                        {/* Time to Employment Y-axis */}
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tick={{ fill: '#c8c7ce', fontSize: 14, fontWeight: 900 }}
                          tickFormatter={(value: number) => `${value}d`}
                          domain={[0, 'auto']}
                          axisLine={{ stroke: '#c8c7ce' }}
                          tickLine={{ stroke: '#c8c7ce' }}
                          width={90}
                          label={{ 
                            value: 'Time to Employment (Days)',
                            angle: -90,
                            position: 'insideRight',
                            fill: '#c8c7ce',
                            offset:30,
                            style: { fontWeight: 500, textAnchor: 'middle'}
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                          contentStyle={{ fontFamily: typography.english.body }}
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-[#0a1230] border border-[#4ADBFF] rounded-lg p-3 shadow-lg">
                                  <p className="text-white font-semibold mb-2">{label}</p>
                                  {payload[0]?.value !== undefined && (
                                    <p className="text-[#4ADBFF] font-medium">
                                      Employment Rate: {payload[0].value}%
                                    </p>
                                  )}
                                  {payload[1]?.value !== undefined && (
                                    <p className="text-[#ac4762] font-medium">
                                      Average Salary: {payload[1].value.toLocaleString()} SAR
                                    </p>
                                  )}
                                  {payload[2]?.value !== undefined && (
                                    <p className="text-[#2db0ba] font-medium">
                                      Time to Employment: {payload[2].value} days
                                    </p>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend
                          formatter={(value) => value.split(/(?=[A-Z])/).join(' ')}
                          wrapperStyle={{ 
                            color: 'white', 
                            fontWeight: 500,
                            top: '-40px',
                            right: '20px'
                          }}
                          verticalAlign="top"
                          align="right"
                          iconSize={16}
                          iconType="circle"
                          layout="horizontal"
                        />
                        {/* Employment Rate Bar */}
                        <Bar 
                          yAxisId="left"
                          dataKey="employmentRate" 
                          fill="url(#employmentGradient)"
                          radius={[4, 4, 0, 0]}
                          label={{
                            position: 'top',
                            fill: 'white',
                            fontSize: 12,
                            fontWeight: 500,
                            dy: -10,
                            formatter: (value: number) => `${value}%`
                          }}
                        />
                        {/* Salary Bar */}
                        <Bar 
                          yAxisId="middle"
                          dataKey="averageSalary" 
                          fill="url(#salaryGradient)"
                          radius={[4, 4, 0, 0]}
                          label={{
                            position: 'top',
                            fill: 'white',
                            fontSize: 12,
                            fontWeight: 500,
                            dy: -10,
                            formatter: (value: number) => `${(value/1000).toFixed(1)}k`
                          }}
                        />
                        {/* Time to Employment Bar */}
                        <Bar 
                          yAxisId="right"
                          dataKey="averageTimeToEmployment" 
                          fill="url(#timeGradient)"
                          radius={[4, 4, 0, 0]}
                          label={{
                            position: 'top',
                            fill: 'white',
                            fontSize: 12,
                            fontWeight: 500,
                            dy: -10,
                            formatter: (value: number) => `${value}d`
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
　　 　　 　 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}