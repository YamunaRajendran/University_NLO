'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import comparisonData from './mock.json';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaChartBar, FaChartPie, FaUndo } from 'react-icons/fa';

type MetricCategory = 'graduateMetrics' | 'employmentMetrics';
type MajorLevel = 'generalMajors' | 'narrowMajors' | 'majors' | undefined;

export default function ComparisonPage() {
  const [level, setLevel] = useState<MajorLevel>(undefined);
  const [metricCategory] = useState<MetricCategory>('employmentMetrics'); // Default to employment metrics
  const [selectedItems, setSelectedItems] = useState<string[]>(['', '', '']);
  const [availableItems, setAvailableItems] = useState<string[]>([]);

  const handleReset = () => {
    setLevel(undefined);
    setSelectedItems(['', '', '']);
  };

  // Get available items based on level
  useEffect(() => {
    if (level) {
      const items = comparisonData.compareChartInsights[metricCategory][level].map(item => item.name);
      setAvailableItems(items);
    } else {
      setAvailableItems([]);
    }
  }, [level, metricCategory]); // Remove metricCategory from dependencies since it's now fixed

  // Get metrics for selected items
  const getMetricsData = () => {
    const validSelections = selectedItems.filter(item => item !== '');
    if (validSelections.length === 0 || !level) return [];

    return validSelections.map(itemName => {
      const itemData = comparisonData.compareChartInsights[metricCategory][level]
        .find(item => item.name === itemName);
      
      if (!itemData) return null;

      return {
        ...itemData
      };
    }).filter(Boolean);
  };

  // Format value for display
  const formatValue = (value: number, key: string) => {
    if (key.toLowerCase().includes('rate')) {
      return `${value}%`;
    } else if (key.toLowerCase().includes('salary')) {
      return `${value.toLocaleString()} SAR`;
    } else if (key.toLowerCase().includes('time')) {
      return `${value} days`;
    }
    return value.toLocaleString();
  };

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
    <div className="min-h-screen w-full p-6">
      <div className="flex flex-col h-full space-y-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaChartBar className="text-[#4ADBFF]" />
          Major Comparison
        </h1>

        <div className="flex-1 grid grid-rows-[auto,1fr] gap-6">
          <div className="max-w-5xl mx-auto w-full">
            <div className="w-full overflow-x-auto">
              <Card className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-[#4ADBFF]/30 shadow-lg shadow-[#4ADBFF]/5">
                <div className="flex items-end gap-6 min-w-max mx-auto">
                  {/* Level Selection */}
                  <div className="w-44 group">
                    <label className="text-[#4ADBFF] text-sm mb-2 block font-medium tracking-wide">
                      Level
                    </label>
                    <Select
                      value={level}
                      onValueChange={(value: string) => {
                        setLevel(value as MajorLevel);
                        setSelectedItems(['', '', '']);
                      }}
                    >
                      <SelectTrigger className="bg-black/60 border-[#4ADBFF]/20 text-white h-11 transition-all duration-200 hover:border-[#4ADBFF]/40 focus:border-[#4ADBFF]/60 group-hover:border-[#4ADBFF]/40">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-[#4ADBFF]/20">
                        <SelectItem value="generalMajors" className="text-white hover:bg-[#4ADBFF]/10 focus:bg-[#4ADBFF]/10">General Majors</SelectItem>
                        <SelectItem value="narrowMajors" className="text-white hover:bg-[#4ADBFF]/10 focus:bg-[#4ADBFF]/10">Narrow Majors</SelectItem>
                        <SelectItem value="majors" className="text-white hover:bg-[#4ADBFF]/10 focus:bg-[#4ADBFF]/10">Specific Majors</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Item Selections - Only show if level is selected */}
                  {level && [0, 1, 2].map((index) => {
                    const shouldShow = index === 0 || selectedItems[index - 1] !== '';
                    
                    return shouldShow && (
                      <div key={index} className="w-44 animate-in fade-in slide-in-from-left duration-300 group">
                        <label className="text-[#4ADBFF] text-sm mb-2 block font-medium tracking-wide">
                          Major {index + 1}
                        </label>
                        <Select
                          value={selectedItems[index]}
                          onValueChange={(value: string) => {
                            const newSelectedItems = [...selectedItems];
                            newSelectedItems[index] = value;
                            setSelectedItems(newSelectedItems);
                          }}
                        >
                          <SelectTrigger className="bg-black/60 border-[#4ADBFF]/20 text-white h-11 transition-all duration-200 hover:border-[#4ADBFF]/40 focus:border-[#4ADBFF]/60 group-hover:border-[#4ADBFF]/40">
                            <SelectValue placeholder={`Select Major ${index + 1}`} />
                          </SelectTrigger>
                          <SelectContent className="bg-black/95 border-[#4ADBFF]/20">
                            {availableItems.map((item) => (
                              <SelectItem
                                key={item}
                                value={item}
                                disabled={selectedItems.includes(item)}
                                className="text-white hover:bg-[#4ADBFF]/10 focus:bg-[#4ADBFF]/10 disabled:opacity-50"
                              >
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}

                  {/* Reset Button - Only show when at least one item is selected */}
                  {selectedItems.some(item => item !== '') && (
                    <div className="flex items-end">
                      <button 
                        onClick={handleReset}
                        className="h-11 px-6 bg-red-500/10 hover:bg-red-500/20 text-white border border-red-500/30 hover:border-red-500/50 rounded-md flex items-center justify-center gap-2 transition-all duration-200 group"
                      >
                        <FaUndo className="group-hover:rotate-[-45deg] transition-transform duration-300" />
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
            {getMetricsData().length > 0 && getAvailableMetrics().map((metric) => (
              <div key={metric} className="h-[400px] bg-gradient-to-r from-[#1a2657] to-[#1a2657]/90 p-6 rounded-lg">
                <h3 className="text-white text-lg mb-4 flex items-center gap-2">
                  <FaChartBar className="text-[#4ADBFF]" />
                  {metric.split(/(?=[A-Z])/).join(' ')}
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart
                    data={getMetricsData()}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 80,
                      left: 20,
                      bottom: 20
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e365f" horizontal={false} />
                    <XAxis 
                      type="number"
                      tick={{ fill: '#9ca3af' }}
                      tickFormatter={(value: number) => formatValue(value, metric)}
                      label={{ 
                        value: metric === 'employmentRate' ? 'Percentage (%)' 
                             : metric === 'averageSalary' ? 'Salary (SAR)'
                             : 'Days',
                        position: 'bottom',
                        fill: '#9ca3af',
                        offset: 0
                      }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ 
                        fill: '#9ca3af',
                        fontSize: 12
                      }}
                      width={80}
                      label={{ 
                        value: 'Majors',
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#9ca3af',
                        dy: 60,
                        offset: -10
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a1230',
                        border: '1px solid #2e365f',
                        borderRadius: '6px',
                      }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#9ca3af' }}
                    />
                    <Bar 
                      dataKey={metric}
                      fill="#4ADBFF"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={30}
                      label={{
                        position: 'right',
                        fill: '#9ca3af',
                        dx: -2,
                        formatter: (value: number) => formatValue(value, metric)
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}

            {/* Grouped Bar Chart */}
            {getMetricsData().length > 0 && (
              <Card className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/50 lg:col-span-3">
                <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center gap-2">
                  <FaChartPie className="text-[#4ADBFF]" />
                  Metrics Comparison
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getMetricsData()}
                      margin={{
                        top: 45,
                        right: 40,
                        left: 40,
                        bottom: 40
                      }}
                      barSize={30}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#fff' }}
                        interval={0}
                        height={90}
                        label={{ 
                            value: 'Majors',
                            angle: 0,
                            position: 'insidecenter',
                            fill: '#fff',
                            offset: 40
                          }}
                      />
                      <YAxis 
                        yAxisId="left"
                        orientation="left"
                        tick={{ fill: '#fff' }}
                        tickFormatter={(value: number) => `${value}%`}
                        domain={[0, 100]}
                        label={{ 
                          value: 'Employment Rate & Time',
                          angle: -90,
                          dy: 80,
                          dx: -30,
                          position: 'insideLeft',
                          fill: '#fff',
                          offset: 10
                        }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: '#fff' }}
                        tickFormatter={(value: number) => value.toLocaleString()}
                        domain={[0, 'auto']}
                        label={{ 
                          value: 'Average Salary (SAR)',
                          angle: -270,
                          dy: 80,
                          dx: -10,
                          position: 'insideRight',
                          fill: '#fff',
                          offset: -30
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0a1230',
                          border: '1px solid #2e365f',
                          borderRadius: '6px',
                        }}
                        labelStyle={{ color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number, name: string) => {
                          if (name === 'employmentRate') return [`${value}%`, 'Employment Rate'];
                          if (name === 'averageTimeToEmployment') return [`${value} days`, 'Time to Employment'];
                          return [value.toLocaleString(), name.split(/(?=[A-Z])/).join(' ') + ' (SAR)'];
                        }}
                      />
                      <Legend 
                        formatter={(value) => value.split(/(?=[A-Z])/).join(' ')}
                        wrapperStyle={{ color: '#fff' }}
                      />
                      <Bar 
                        yAxisId="left"
                        dataKey="employmentRate" 
                        fill="#4ADBFF"
                        radius={[4, 4, 0, 0]}
                        label={{
                          position: 'top',
                          fill: '#fff',
                          angle: -45,
                          dy: -10,
                          formatter: (value: number) => `${value}%`
                        }}
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="averageSalary" 
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                        label={{
                          position: 'top',
                          fill: '#fff',
                          angle: -45,
                          dy: -10,
                          formatter: (value: number) => value.toLocaleString() + ' SAR'
                        }}
                      />
                      <Bar 
                        yAxisId="left"
                        dataKey="averageTimeToEmployment" 
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        label={{
                          position: 'top',
                          fill: '#fff',
                          angle: -45,
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
  );
}