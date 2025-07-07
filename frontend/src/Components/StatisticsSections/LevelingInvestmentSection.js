import React from 'react';
import Select from 'react-select';
import ChartTable from '../ChartTable';
import { calculateLevelingInvestmentData } from '../../utils/subStatisticsCalculations';
import { prepareSubChartData } from '../../utils/subChartDataHelpers';
import styles from '../../Styles/Pages/SubStatisticsPage.module.css';

const LevelingInvestmentSection = ({
  levelingInvestmentData,
  isTypeSelected,
  isSetLevelingSelected,
  selectedType,
  selectedLevelingSet,
  setIsTypeSelected,
  setIsSetLevelingSelected,
  setSelectedType,
  setSelectedLevelingSet,
}) => {
  const calculations = calculateLevelingInvestmentData(levelingInvestmentData);

  const renderTypeButtons = () => {
    const types = calculations.getUniqueTypes();
    return (
      <div className={styles.button_container}>
        <button
          key="All"
          className={`${styles.button} ${selectedType === 'All' ? styles.active : ''}`}
          onClick={() => setSelectedType(selectedType === 'All' ? '' : 'All')}
        >
          All
        </button>
        {types.map(type => (
          <button
            key={type}
            className={`${styles.button} ${selectedType === type ? styles.active : ''}`}
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
      <div className={styles.select_container}>
        <Select
          options={setOptions}
          value={selectedLevelingSet ? { value: selectedLevelingSet, label: selectedLevelingSet } : null}
          onChange={(selected) => setSelectedLevelingSet(selected ? selected.value : '')}
          placeholder="Select a set..."
          isClearable
          className={styles.select}
        />
      </div>
    );
  };

  let chartData = [];
  let tableData = [];
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
    <>
      <div className={styles.button_container}>
        <button
          className={`${styles.button} ${isTypeSelected ? styles.active : ''}`}
          onClick={() => {
            setIsTypeSelected(!isTypeSelected);
            setIsSetLevelingSelected(false);
            setSelectedType('');
            setSelectedLevelingSet('');
          }}
        >
          Type
        </button>
        <button
          className={`${styles.button} ${isSetLevelingSelected ? styles.active : ''}`}
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
      
      {isTypeSelected && renderTypeButtons()}
      {isSetLevelingSelected && renderSetDropdown()}
      
      {((isTypeSelected && selectedType)) && (
        <ChartTable
          chartType="bar"
          chartData={prepareSubChartData(chartData, 'label', 'percentage')}
          tableData={tableData}
          chartTitle={title}
          tableTitle={title}
          tableFirstField="Label"
        />
      )}

      {((isSetLevelingSelected && selectedLevelingSet)) && (
        <ChartTable
          chartType="pie"
          chartData={prepareSubChartData(chartData, 'label', 'percentage')}
          tableData={tableData}
          chartTitle={title}
          tableTitle={title}
          tableFirstField="Label"
        />
      )}
    </>
  );
};

export default LevelingInvestmentSection;
