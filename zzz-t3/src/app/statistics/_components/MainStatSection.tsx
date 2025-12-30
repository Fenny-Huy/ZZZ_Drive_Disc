"use client";

import React from 'react';
import { ChartTable } from './ChartTable';
import { prepareChartData, transformMainStatData } from '~/lib/chartUtils';

interface MainStatSectionProps {
  selectedChart: string;
  setSelectedChart: (chart: string) => void;
  typeData: any[];
  mainStatData: any[];
  isLoading: boolean;
}

export const MainStatSection: React.FC<MainStatSectionProps> = ({
  selectedChart,
  setSelectedChart,
  typeData,
  mainStatData,
  isLoading
}) => {
  const data = transformMainStatData(typeData, mainStatData, selectedChart);

  const tabs = [
    { id: 'Types', label: 'Types' },
    { id: 'Sand', label: 'Sand' },
    { id: 'Goblet', label: 'Goblet' },
    { id: 'Circlet', label: 'Circlet' },
  ];

  return (
    <div className="space-y-8">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedChart(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              selectedChart === tab.id
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ChartTable
        chartType="pie"
        chartData={prepareChartData(data, 'substat', 'percentage')}
        tableData={data}
        chartTitle={selectedChart === 'Types' ? 'Type Distribution' : `${selectedChart} Main Stat Distribution`}
        tableTitle={selectedChart === 'Types' ? 'Type Counts' : `${selectedChart} Main Stat Counts`}
        tableFirstField={selectedChart === 'Types' ? 'Type' : 'Main Stat'}
        isLoading={isLoading}
      />
    </div>
  );
};
