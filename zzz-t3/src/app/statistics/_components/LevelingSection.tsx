
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
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 border border-blue-500/30">1</span>
          Select Drive Disc Slot:
        </p>
        <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
          {uniqueTypes.map(type => (
            <button
              key={type}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
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
      </div>
      
      {selectedType && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 border border-blue-500/30">2</span>
            Select Main Stat for Slot {selectedType}:
          </p>
          <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800">
            {uniqueMainStats.map(mainStat => (
              <button
                key={mainStat}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
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
        </div>
      )}

      {selectedType && selectedMainStat ? (
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
      ) : (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-300">Select a Slot and Main Stat</p>
            <p className="text-sm text-gray-400 mt-2">Click buttons above to filter leveling statistics</p>
          </div>
        </div>
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
      <div className="space-y-2">
        <p className="text-sm text-gray-400 flex items-center gap-2">
          Choose view type:
        </p>
        <div className="flex gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800 w-fit">
          <button 
            className={`group rounded-lg px-6 py-2 text-sm font-medium transition-all ${
              selectedLevelingChart === 'Overall' 
                ? 'bg-slate-700 text-white shadow-md' 
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
            onClick={() => setSelectedLevelingChart('Overall')}
          >
            <span className="flex items-center gap-2">
              Overall
            </span>
          </button>
          <button 
            className={`group rounded-lg px-6 py-2 text-sm font-medium transition-all ${
              selectedLevelingChart === 'Specific' 
                ? 'bg-slate-700 text-white shadow-md' 
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
            onClick={() => setSelectedLevelingChart('Specific')}
          >
            <span className="flex items-center gap-2">
              Specific
            </span>
          </button>
        </div>
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
