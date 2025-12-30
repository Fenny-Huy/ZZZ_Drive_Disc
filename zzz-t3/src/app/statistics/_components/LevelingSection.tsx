
"use client";

import React, { useState } from 'react';
import LevelingChartTable from './LevelingChartTable';
import { 
  calculateLevelingOverall, 
  calculateLevelingSpecific, 
  getUniqueTypes, 
  getUniqueMainStats,
  type LevelingDataItem
} from '~/lib/statisticsCalculations';
import { prepareChartData, prepareLevelingChartData } from '~/lib/chartUtils';

interface LevelingSectionProps {
  levelingData: LevelingDataItem[];
  isLoading: boolean;
}

const LevelingOverallSection: React.FC<{ levelingData: LevelingDataItem[] }> = ({ levelingData }) => {
  const { substatDistribution, addedSubstatData } = calculateLevelingOverall(levelingData);

  return (
    <LevelingChartTable
      chartType="bar"
      levelingChartData={prepareLevelingChartData(
        substatDistribution, 
        'substat', 
        ['appearancePercentage', 'rollPercentage']
      )}
      levelingTableData={substatDistribution}
      addedChartData={prepareChartData(addedSubstatData, 'substat', 'percentage')}
      addedTableData={addedSubstatData}
    />
  );
};

const LevelingSpecificSection: React.FC<{ levelingData: LevelingDataItem[] }> = ({ levelingData }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMainStat, setSelectedMainStat] = useState<string | null>(null);

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
    setSelectedMainStat(null);
  };

  const handleMainStatSelection = (mainStat: string) => {
    setSelectedMainStat(mainStat);
  };

  const uniqueTypes = getUniqueTypes(levelingData);
  const uniqueMainStats = selectedType ? getUniqueMainStats(levelingData, selectedType) : [];

  const { substatDistribution, addedSubstatData } = selectedType && selectedMainStat 
    ? calculateLevelingSpecific(levelingData, selectedType, selectedMainStat)
    : { substatDistribution: [], addedSubstatData: [] };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
        {uniqueTypes.map(type => (
          <button
            key={type}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              selectedType === type
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
            onClick={() => handleTypeSelection(type)}
          >
            {type}
          </button>
        ))}
      </div>
      
      {selectedType && (
        <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
          {uniqueMainStats.map(mainStat => (
            <button
              key={mainStat}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedMainStat === mainStat
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
              }`}
              onClick={() => handleMainStatSelection(mainStat)}
            >
              {mainStat}
            </button>
          ))}
        </div>
      )}

      {selectedType && selectedMainStat && (
        <LevelingChartTable
          chartType="pie"
          levelingChartData={prepareLevelingChartData(
            substatDistribution, 
            'substat', 
            ['appearancePercentage', 'rollPercentage']
          )}
          levelingTableData={substatDistribution}
          addedChartData={prepareChartData(addedSubstatData, 'substat', 'percentage')}
          addedTableData={addedSubstatData}
        />
      )}
    </div>
  );
};

export const LevelingSection: React.FC<LevelingSectionProps> = ({ levelingData, isLoading }) => {
  const [selectedLevelingChart, setSelectedLevelingChart] = useState<'Overall' | 'Specific'>('Overall');

  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl bg-slate-800/50 text-gray-400">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-yellow-500"></div>
        <p>Loading leveling statistics...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800 w-fit">
        <button 
          className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
            selectedLevelingChart === 'Overall' 
              ? 'bg-slate-700 text-white shadow-md' 
              : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
          }`}
          onClick={() => setSelectedLevelingChart('Overall')}
        >
          🌐 Overall
        </button>
        <button 
          className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
            selectedLevelingChart === 'Specific' 
              ? 'bg-slate-700 text-white shadow-md' 
              : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
          }`}
          onClick={() => setSelectedLevelingChart('Specific')}
        >
          🎯 Specific
        </button>
      </div>

      {selectedLevelingChart === 'Overall' && (
        <LevelingOverallSection levelingData={levelingData} />
      )}
      {selectedLevelingChart === 'Specific' && (
        <LevelingSpecificSection levelingData={levelingData} />
      )}
    </div>
  );
};
