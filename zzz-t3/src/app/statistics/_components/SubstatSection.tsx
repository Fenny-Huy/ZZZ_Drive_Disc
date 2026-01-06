"use client";

import React, { useState } from 'react';
import { ChartTable } from './ChartTable';
import { calculateSubstatOverall, calculateSubstatSpecific } from '~/lib/statisticsCalculations';
import { prepareChartData } from '~/lib/chartUtils';

interface SubstatSectionProps {
  selectedSubstatChart: string;
  setSelectedSubstatChart: (chart: string) => void;
  substatData: any[];
  typeData: any[];
  mainStatData: any[];
  isLoading: boolean;
}

export const SubstatSection: React.FC<SubstatSectionProps> = ({
  selectedSubstatChart,
  setSelectedSubstatChart,
  substatData,
  typeData,
  mainStatData,
  isLoading
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMainStat, setSelectedMainStat] = useState<string | null>(null);

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
    setSelectedMainStat(null);
  };

  const renderOverall = () => {
    const substatDistribution = calculateSubstatOverall(substatData);
    
    return (
      <ChartTable
        chartType="bar"
        chartData={prepareChartData(substatDistribution, 'substat', 'percentage')}
        tableData={substatDistribution}
        chartTitle="Substat Distribution"
        tableTitle="Substat Counts"
        tableFirstField="Substat"
        isLoading={isLoading}
      />
    );
  };

  const renderSpecific = () => {
    const substatDistribution = calculateSubstatSpecific(substatData, selectedType, selectedMainStat);
    
    // Get unique types from typeData
    const types = typeData.map(t => t.substat);

    // Get main stats for selected type
    const mainStats = selectedType 
      ? mainStatData
          .filter(m => m.type === selectedType)
          .map(m => m.substat)
      : [];

    return (
      <div className="space-y-8">
        {/* Type Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 border border-blue-500/30">1</span>
            Select Drive Disc Slot:
          </p>
          <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeSelection(type)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
                  selectedType === type
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stat Selection */}
        {selectedType && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 border border-blue-500/30">2</span>
              Select Main Stat for Slot {selectedType}:
            </p>
            <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
              {mainStats.map((stat) => (
                <button
                  key={stat}
                  onClick={() => setSelectedMainStat(stat)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
                    selectedMainStat === stat
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chart */}
        {selectedType && selectedMainStat ? (
          <ChartTable
            chartType="bar"
            chartData={prepareChartData(substatDistribution, 'substat', 'percentage')}
            tableData={substatDistribution}
            chartTitle={`Slot ${selectedType} - ${selectedMainStat} Substat Distribution`}
            tableTitle={`Slot ${selectedType} - ${selectedMainStat} Substat Counts`}
            tableFirstField="Substat"
            isLoading={isLoading}
          />
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-300">Select a Type and Main Stat</p>
              <p className="text-sm text-gray-400 mt-2">Click buttons above to filter substat statistics</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Sub-navigation Tabs */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400 flex items-center gap-2">
          Choose view slot:
        </p>
        <div className="flex w-full max-w-md gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
          <button
            onClick={() => setSelectedSubstatChart('Overall')}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
              selectedSubstatChart === 'Overall'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
          >
          Overall
          </button>
          <button
            onClick={() => setSelectedSubstatChart('Specific')}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
              selectedSubstatChart === 'Specific'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
          >
          Specific
          </button>
        </div>
      </div>

      {selectedSubstatChart === 'Overall' ? renderOverall() : renderSpecific()}
    </div>
  );
};
