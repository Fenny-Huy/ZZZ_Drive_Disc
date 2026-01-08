"use client";

import React, { useState } from 'react';
import Select from 'react-select';
import ChartTable from './ChartTable';
import { calculateSetSourceData } from '~/lib/subStatisticsCalculations';
import { prepareChartData } from '~/lib/chartUtils';

interface SetSourceSectionProps {
  setData: { set: string | null; count: number }[];
  sourceData: { where: string | null; count: number }[];
  setSourceComboData: { set: string | null; where: string | null; count: number }[];
  isLoading: boolean;
}

const SetSourceSection: React.FC<SetSourceSectionProps> = ({
  setData,
  sourceData,
  setSourceComboData,
  isLoading,
}) => {
  const [isSetSelected, setIsSetSelected] = useState(false);
  const [isSourceSelected, setIsSourceSelected] = useState(false);
  const [isSpecificSelected, setIsSpecificSelected] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);

  const calculations = calculateSetSourceData(3.5);

  const handleSetSelection = () => {
    if (isSpecificSelected) {
      setIsSourceSelected(false);
    }
    setIsSetSelected(!isSetSelected);
  };
  
  const handleSourceSelection = () => {
    if (isSpecificSelected) {
      setIsSetSelected(false);
    }
    setIsSourceSelected(!isSourceSelected);
  };
  
  const handleSpecificSelection = () => {
    setIsSpecificSelected(!isSpecificSelected);
    setIsSetSelected(false);
    setIsSourceSelected(false);
    setSelectedSource(null);
    setSelectedSet(null);
  };

  const renderDropdown = () => {
    if (isSpecificSelected) {
      if (isSetSelected) {
        const sources = [...new Set(setSourceComboData.map(item => item.where))].filter(Boolean).map(source => ({
          value: source!,
          label: source!,
        }));
        return (
          <div className="w-full max-w-md mb-6">
            <Select
              value={sources.find(option => option.value === selectedSource)}
              onChange={(selectedOption) => setSelectedSource(selectedOption ? selectedOption.value : null)}
              options={sources}
              placeholder="Select or type to search Source"
              isClearable
              className="text-slate-900"
              classNames={{
                control: () => "!bg-slate-800 !border-slate-700 !text-white",
                menu: () => "!bg-slate-800 !border-slate-700",
                option: ({ isFocused }) => isFocused ? "!bg-slate-700 !text-white" : "!bg-slate-800 !text-gray-300",
                singleValue: () => "!text-white",
                input: () => "!text-white",
              }}
            />
          </div>
        );
      } else if (isSourceSelected) {
        const sets = [...new Set(setSourceComboData.map(item => item.set))].filter(Boolean).map(set => ({
          value: set!,
          label: set!,
        }));
        return (
          <div className="w-full max-w-md mb-6">
            <Select
              value={sets.find(option => option.value === selectedSet)}
              onChange={(selectedOption) => setSelectedSet(selectedOption ? selectedOption.value : null)}
              options={sets}
              placeholder="Select or type to search Set"
              isClearable
              className="text-slate-900"
              classNames={{
                control: () => "!bg-slate-800 !border-slate-700 !text-white",
                menu: () => "!bg-slate-800 !border-slate-700",
                option: ({ isFocused }) => isFocused ? "!bg-slate-700 !text-white" : "!bg-slate-800 !text-gray-300",
                singleValue: () => "!text-white",
                input: () => "!text-white",
              }}
            />
          </div>
        );
      }
    }
    return null;
  };

  let chartdata: any[] = [];
  let tabledata: any[] = [];
  let title = '';

  if (isSpecificSelected) {
    if (isSetSelected && selectedSource) {
      const filtered = setSourceComboData.filter(item => item.where === selectedSource);
      chartdata = calculations.prepareChartSetSpecificData(filtered);
      tabledata = calculations.prepareTableSetSpecificData(filtered);
      title = `Set Distribution for Source: ${selectedSource}`;
    } else if (isSourceSelected && selectedSet) {
      const filtered = setSourceComboData.filter(item => item.set === selectedSet);
      chartdata = calculations.prepareSourceSpecificData(filtered);
      tabledata = calculations.prepareSourceSpecificData(filtered);
      title = `Source Distribution for Set: ${selectedSet}`;
    }
  } else {
    if (isSetSelected && isSourceSelected) {
      tabledata = calculations.prepareTableSetSourceComboData(setSourceComboData);
      chartdata = calculations.prepareChartSetSourceComboData(setSourceComboData);
      title = 'Set and Source Distribution';
    } else if (isSetSelected) {
      chartdata = calculations.prepareChartSetData(setData);
      tabledata = calculations.prepareTableSetData(setData);
      title = 'Set Distribution';
    } else if (isSourceSelected) {
      chartdata = calculations.prepareSourceData(sourceData);
      tabledata = calculations.prepareSourceData(sourceData);
      title = 'Source Distribution';
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-2">
        <p className="text-sm text-gray-400">
          Choose filters:
        </p>
        <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800 w-fit">
          <button 
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${isSetSelected ? 'bg-slate-700 text-white shadow-md' : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'}`} 
            onClick={handleSetSelection}
          >
            Set
          </button>
          <button 
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${isSourceSelected ? 'bg-slate-700 text-white shadow-md' : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'}`} 
            onClick={handleSourceSelection}
          >
            Source
          </button>
          <button 
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${isSpecificSelected ? 'bg-slate-700 text-white shadow-md' : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'}`} 
            onClick={handleSpecificSelection}
          >
            Specific
          </button>
        </div>
      </div>

      {renderDropdown()}

      {isLoading ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-xl bg-slate-800/50 text-gray-400">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-yellow-500"></div>
          <p>Loading analytics...</p>
        </div>
      ) : (isSetSelected || isSourceSelected) ? (
        <ChartTable
          chartType="pie"
          chartData={prepareChartData(chartdata, 'label', 'percentage')}
          tableData={tabledata}
          chartTitle={title}
          tableTitle={title}
          tableFirstField="Label"
        />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-300">Select filters above</p>
            <p className="text-sm text-gray-400 mt-2">Click Set, Source, or Specific to view distribution analytics</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetSourceSection;
