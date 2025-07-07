import React from 'react';
import ChartTable from '../ChartTable';
import { calculateSubstatOverall, calculateSubstatSpecific } from '../../utils/statisticsCalculations';
import { prepareChartData } from '../../utils/chartDataHelpers';
import styles from '../../Styles/Pages/StatisticsPage.module.css';

const SubstatOverallSection = ({ substatData }) => {
  const substatDistribution = calculateSubstatOverall(substatData);

  return (
    <ChartTable
      chartType="bar"
      chartData={prepareChartData(substatDistribution, 'substat', 'percentage')}
      tableData={substatDistribution}
      chartTitle="Substat Distribution"
      tableTitle="Substat Counts"
      tableFirstField="Substat"
    />
  );
};

const SubstatSpecificSection = ({ 
  substatData, 
  typeData, 
  mainStatData, 
  selectedType, 
  setSelectedType, 
  selectedMainStat, 
  setSelectedMainStat 
}) => {
  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setSelectedMainStat(null);
  };

  const substatDistribution = calculateSubstatSpecific(substatData, selectedType, selectedMainStat);

  return (
    <div className={styles.subContentContainer}>
      <div className={styles.subButtonsContainer}>
        {typeData.map(item => (
          <button
            key={item[0]}
            className={`${styles.subButton} ${selectedType === item[0] ? styles.active : ''}`}
            onClick={() => handleTypeSelection(item[0])}
          >
            {item[0]}
          </button>
        ))}
      </div>
      {selectedType && (
        <div className={styles.subButtonsContainer}>
          {mainStatData.filter(item => item[0] === selectedType).map(item => (
            <button
              key={item[1]}
              className={`${styles.subButton} ${selectedMainStat === item[1] ? styles.active : ''}`}
              onClick={() => setSelectedMainStat(item[1])}
            >
              {item[1]}
            </button>
          ))}
        </div>
      )}
      {selectedType && selectedMainStat && (
        <ChartTable
          chartType="bar"
          chartData={prepareChartData(substatDistribution, 'substat', 'percentage')}
          tableData={substatDistribution}
          chartTitle={`${selectedType} - ${selectedMainStat} Substat Distribution`}
          tableTitle={`${selectedType} - ${selectedMainStat} Substat Counts`}
          tableFirstField="Substat"
        />
      )}
    </div>
  );
};

const SubstatSection = ({ 
  selectedSubstatChart, 
  setSelectedSubstatChart, 
  substatData, 
  typeData, 
  mainStatData, 
  selectedType, 
  setSelectedType, 
  selectedMainStat, 
  setSelectedMainStat 
}) => {
  return (
    <>
      <div className={styles.subButtonsContainer}>
        <button 
          className={`${styles.subButton} ${selectedSubstatChart === 'Overall' ? styles.active : ''}`} 
          onClick={() => setSelectedSubstatChart('Overall')}
        >
          🌐 Overall
        </button>
        <button 
          className={`${styles.subButton} ${selectedSubstatChart === 'Specific' ? styles.active : ''}`} 
          onClick={() => setSelectedSubstatChart('Specific')}
        >
          🎯 Specific
        </button>
      </div>
      {selectedSubstatChart === 'Overall' && (
        <SubstatOverallSection substatData={substatData} />
      )}
      {selectedSubstatChart === 'Specific' && (
        <SubstatSpecificSection
          substatData={substatData}
          typeData={typeData}
          mainStatData={mainStatData}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedMainStat={selectedMainStat}
          setSelectedMainStat={setSelectedMainStat}
        />
      )}
    </>
  );
};

export default SubstatSection;
