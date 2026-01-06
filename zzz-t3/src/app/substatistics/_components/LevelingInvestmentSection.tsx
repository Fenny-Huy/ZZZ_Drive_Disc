'use client';

import React, { useState } from 'react';
import Select from 'react-select';
import ChartTable from './ChartTable';
import { calculateLevelingInvestmentData } from '~/lib/subStatisticsCalculations';
import { prepareChartData } from '~/lib/chartUtils';

interface LevelingInvestmentSectionProps {
  levelingInvestmentData: any[];
}

const LevelingInvestmentSection: React.FC<LevelingInvestmentSectionProps> = ({
  levelingInvestmentData,
}) => {
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [isSetLevelingSelected, setIsSetLevelingSelected] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLevelingSet, setSelectedLevelingSet] = useState<string>('');

  const calculations = calculateLevelingInvestmentData(levelingInvestmentData);

  const renderTypeButtons = () => {
    const types = calculations.getUniqueTypes();
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          key="All"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            selectedType === 'All'
              ? 'bg-slate-700 text-white shadow-md'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-200'
          }`}
          onClick={() => setSelectedType(selectedType === 'All' ? '' : 'All')}
        >
          All
        </button>
        {types.map(type => (
          <button
            key={type}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedType === type
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-200'
            }`}
            onClick={() => setSelectedType(selectedType === type ? '' : type)}
          >
            {type}
          </button>
        ))}
      </div>
    );
  };

  const renderSetDropdown = () => {
    const sets = calculations.getUniqueSets();
    const setOptions = sets.map(set => ({ value: set, label: set }));
    
    return (
      <div className="w-full max-w-md mb-6">
        <Select
          options={setOptions}
          value={selectedLevelingSet ? { value: selectedLevelingSet, label: selectedLevelingSet } : null}
          onChange={(selected) => setSelectedLevelingSet(selected ? selected.value : '')}
          placeholder="Select a set..."
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
  };

  let chartData: any[] = [];
  let tableData: any[] = [];
  let title = '';

  if (isTypeSelected && selectedType) {
    if (selectedType === 'All') {
      const allTypeData = calculations.getAllTypeData();
      chartData = allTypeData;
      tableData = allTypeData;
      title = 'All Types - Total Rolls by Set';
    } else {
      const typeData = calculations.getTypeData(selectedType);
      chartData = typeData;
      tableData = typeData;
      title = `${selectedType} - Total Rolls by Set`;
    }
  } else if (isSetLevelingSelected && selectedLevelingSet) {
    const setData = calculations.getSetData(selectedLevelingSet);
    chartData = setData;
    tableData = setData;
    title = `${selectedLevelingSet} - Total Rolls by Type`;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-2">
        <p className="text-sm text-gray-400">
          Choose analysis type:
        </p>
        <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900 p-2 border border-slate-800 w-fit">
          <button
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
              isTypeSelected
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
            onClick={() => {
              setIsTypeSelected(!isTypeSelected);
              setIsSetLevelingSelected(false);
              setSelectedType('');
              setSelectedLevelingSet('');
            }}
          >
            Slot
          </button>
          <button
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-105 ${
              isSetLevelingSelected
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
            onClick={() => {
              setIsSetLevelingSelected(!isSetLevelingSelected);
              setIsTypeSelected(false);
              setSelectedType('');
              setSelectedLevelingSet('');
            }}
          >
            Set
          </button>
        </div>
      </div>
      
      {isTypeSelected && renderTypeButtons()}
      {isSetLevelingSelected && renderSetDropdown()}
      
      {((isTypeSelected && selectedType)) && (
        <ChartTable
          chartType="bar"
          chartData={prepareChartData(chartData, 'label', 'percentage')}
          tableData={tableData}
          chartTitle={title}
          tableTitle={title}
          tableFirstField="Label"
        />
      )}

      {((isSetLevelingSelected && selectedLevelingSet)) && (
        <ChartTable
          chartType="pie"
          chartData={prepareChartData(chartData, 'label', 'percentage')}
          tableData={tableData}
          chartTitle={title}
          tableTitle={title}
          tableFirstField="Label"
        />
      )}
    </div>
  );
};

export default LevelingInvestmentSection;
