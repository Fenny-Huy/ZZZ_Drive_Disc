import React from 'react';
import ChartTable from '../ChartTable';
import { prepareChartData, transformMainStatData } from '../../utils/chartDataHelpers';
import styles from '../../Styles/Pages/StatisticsPage.module.css';

const MainStatSection = ({ 
  selectedChart, 
  setSelectedChart, 
  typeData, 
  mainStatData, 
  isLoading 
}) => {
  const data = transformMainStatData(typeData, mainStatData, selectedChart);

  return (
    <>
      <div className={styles.subButtonsContainer}>
        <button 
          className={`${styles.subButton} ${selectedChart === 'Types' ? styles.active : ''}`} 
          onClick={() => setSelectedChart('Types')}
        >
          📋 Types
        </button>
        <button 
          className={`${styles.subButton} ${selectedChart === '4' ? styles.active : ''}`} 
          onClick={() => setSelectedChart('4')}
        >
          4
        </button>
        <button 
          className={`${styles.subButton} ${selectedChart === '5' ? styles.active : ''}`} 
          onClick={() => setSelectedChart('5')}
        >
          5
        </button>
        <button 
          className={`${styles.subButton} ${selectedChart === '6' ? styles.active : ''}`} 
          onClick={() => setSelectedChart('6')}
        >
          6
        </button>
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
    </>
  );
};

export default MainStatSection;
