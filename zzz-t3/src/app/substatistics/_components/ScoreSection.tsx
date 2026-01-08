'use client';

import React, { useState } from 'react';
import Select from 'react-select';
import ChartTable from './ChartTable';
import { calculateScoreData } from '~/lib/subStatisticsCalculations';
import { prepareChartData } from '~/lib/chartUtils';

interface ScoreSectionProps {
  scoreData: any[];
  scoreSetData: any[];
  scoreSourceData: any[];
  scoreSetSourceData: any[];
  isLoading: boolean;
}

const ScoreSection: React.FC<ScoreSectionProps> = ({
  scoreData,
  scoreSetData,
  scoreSourceData,
  scoreSetSourceData,
  isLoading,
}) => {
  const [isSetSelected, setIsSetSelected] = useState(false);
  const [isSourceSelected, setIsSourceSelected] = useState(false);
  const [isSpecificSelected, setIsSpecificSelected] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedSet, setSelectedSet] = useState<string>('');

  const calculations = calculateScoreData(4);

  const handleSetSelection = () => {
    setIsSetSelected(!isSetSelected);
  };

  const handleSourceSelection = () => {
    setIsSourceSelected(!isSourceSelected);
  };

  const handleSpecificSelection = () => {
    setIsSpecificSelected(!isSpecificSelected);
    setIsSetSelected(false);
    setIsSourceSelected(false);
    setSelectedSource('');
    setSelectedSet('');
  };

  const renderDropdown = () => {
    if (isSpecificSelected) {
      const customStyles = {
        control: (provided: any) => ({
          ...provided,
          backgroundColor: '#1e293b', // slate-800
          borderColor: '#334155', // slate-700
          color: 'white',
        }),
        menu: (provided: any) => ({
          ...provided,
          backgroundColor: '#1e293b', // slate-800
        }),
        option: (provided: any, state: any) => ({
          ...provided,
          backgroundColor: state.isFocused ? '#334155' : '#1e293b', // slate-700 : slate-800
          color: 'white',
        }),
        singleValue: (provided: any) => ({
          ...provided,
          color: 'white',
        }),
        input: (provided: any) => ({
          ...provided,
          color: 'white',
        }),
      };

      if (isSetSelected && !isSourceSelected) {
        const sets = [...new Set(scoreSetData.map(item => item.set))].map(set => ({
          value: set,
          label: set,
        }));
        return (
          <div className="w-full max-w-md mb-4">
            <Select
              value={sets.find(option => option.value === selectedSet)}
              onChange={(selectedOption) => setSelectedSet(selectedOption ? selectedOption.value : '')}
              options={sets}
              placeholder="Select or type to search Set"
              isClearable
              classNamePrefix="select"
              styles={customStyles}
            />
          </div>
        );
      } else if (isSourceSelected && !isSetSelected) {
        const sources = [...new Set(scoreSourceData.map(item => item.where))].map(source => ({
          value: source,
          label: source,
        }));
        return (
          <div className="w-full max-w-md mb-4">
            <Select
              value={sources.find(option => option.value === selectedSource)}
              onChange={(selectedOption) => setSelectedSource(selectedOption ? selectedOption.value : '')}
              options={sources}
              placeholder="Select or type to search Source"
              isClearable
              classNamePrefix="select"
              styles={customStyles}
            />
          </div>
        );
      } else if (isSetSelected && isSourceSelected) {
        const sources = [...new Set(scoreSourceData.map(item => item.where))].map(source => ({
          value: source,
          label: source,
        }));
        const sets = [...new Set(scoreSetData.map(item => item.set))].map(set => ({
          value: set,
          label: set,
        }));

        return (
          <div className="flex flex-col gap-4 w-full max-w-md mb-4">
            <Select
              value={sources.find(option => option.value === selectedSource)}
              onChange={(selectedOption) => setSelectedSource(selectedOption ? selectedOption.value : '')}
              options={sources}
              placeholder="Select or type to search Source"
              isClearable
              classNamePrefix="select"
              styles={customStyles}
            />
            <Select
              value={sets.find(option => option.value === selectedSet)}
              onChange={(selectedOption) => setSelectedSet(selectedOption ? selectedOption.value : '')}
              options={sets}
              placeholder="Select or type to search Set"
              isClearable
              classNamePrefix="select"
              styles={customStyles}
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
    if (isSetSelected && selectedSet && !isSourceSelected) {
      const separatedData = calculations.separateDataOfScoreSource(scoreSetSourceData, selectedSet);
      chartdata = calculations.prepareScoreSourceSpecificData(separatedData);
      tabledata = calculations.prepareScoreSourceSpecificData(separatedData);
      title = `Score for Set: ${selectedSet}`;
    } else if (isSourceSelected && selectedSource && !isSetSelected) {
      const separatedData = calculations.separateDataOfScoreSet(scoreSetSourceData, selectedSource);
      chartdata = calculations.prepareScoreSetSpecificData(separatedData);
      tabledata = calculations.prepareScoreSetSpecificData(separatedData);
      title = `Score for Source: ${selectedSource}`;
    } else if (isSetSelected && selectedSet && isSourceSelected && selectedSource) {
      const filteredData = scoreSetSourceData.filter(item => item.where === selectedSource && item.set === selectedSet);
      chartdata = calculations.prepareScoreSetSpecificData(filteredData);
      tabledata = calculations.prepareScoreSetSpecificData(filteredData);
      title = `Score for Source: ${selectedSource} and Set: ${selectedSet}`;
    }
  } else {
    if (isSetSelected && isSourceSelected) {
      tabledata = calculations.prepareTableScoreData(scoreData);
      chartdata = calculations.prepareChartScoreData(scoreData);
      title = 'Score Distribution';
    } else if (isSetSelected) {
      chartdata = calculations.prepareChartScoreSetData(scoreSetData);
      tabledata = calculations.prepareTableScoreSetData(scoreSetData);
      title = 'Score and Set Distribution';
    } else if (isSourceSelected) {
      chartdata = calculations.prepareChartScoreSourceData(scoreSourceData);
      tabledata = calculations.prepareTableScoreSourceData(scoreSourceData);
      title = 'Score and Source Distribution';
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
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
              isSetSelected
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
            onClick={handleSetSelection}
          >
            Set
          </button>
          <button
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
              isSourceSelected
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
            onClick={handleSourceSelection}
          >
            Source
          </button>
          <button
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
              isSpecificSelected
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
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
          <p>Loading score analytics...</p>
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
            <p className="text-sm text-gray-400 mt-2">Click Set, Source, or Specific to view score analytics</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreSection;
