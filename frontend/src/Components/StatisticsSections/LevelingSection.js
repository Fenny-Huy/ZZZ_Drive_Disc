import React from 'react';
import LevelingChartTable from '../LevelingChartTable';
import { 
  calculateLevelingOverall, 
  calculateLevelingSpecific, 
  getUniqueTypes, 
  getUniqueMainStats 
} from '../../utils/statisticsCalculations';
import { prepareChartData, prepareLevelingChartData } from '../../utils/chartDataHelpers';
import styles from '../../Styles/Pages/StatisticsPage.module.css';

const LevelingOverallSection = ({ levelingData }) => {
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

const LevelingSpecificSection = ({ 
  levelingData, 
  selectedType, 
  setSelectedType, 
  selectedMainStat, 
  setSelectedMainStat 
}) => {
  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setSelectedMainStat(null);
  };

  const handleMainStatSelection = (mainStat) => {
    setSelectedMainStat(mainStat);
  };

  const uniqueTypes = getUniqueTypes(levelingData);
  const uniqueMainStats = selectedType ? getUniqueMainStats(levelingData, selectedType) : [];

  const { substatDistribution, addedSubstatData } = selectedType && selectedMainStat 
    ? calculateLevelingSpecific(levelingData, selectedType, selectedMainStat)
    : { substatDistribution: [], addedSubstatData: [] };

  return (
    <>
      <div className={styles.subButtonsContainer}>
        {uniqueTypes.map(type => (
          <button
            key={type}
            className={`${styles.subButton} ${selectedType === type ? styles.active : ''}`}
            onClick={() => handleTypeSelection(type)}
          >
            {type}
          </button>
        ))}
      </div>
      {selectedType && (
        <div className={styles.subButtonsContainer}>
          {uniqueMainStats.map(mainStat => (
            <button
              key={mainStat}
              className={`${styles.subButton} ${selectedMainStat === mainStat ? styles.active : ''}`}
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
    </>
  );
};

const LevelingSection = ({ 
  selectedLevelingChart, 
  setSelectedLevelingChart, 
  levelingData, 
  selectedType, 
  setSelectedType, 
  selectedMainStat, 
  setSelectedMainStat 
}) => {
  return (
    <>
      <div className={styles.subButtonsContainer}>
        <button 
          className={`${styles.subButton} ${selectedLevelingChart === 'Overall' ? styles.active : ''}`} 
          onClick={() => setSelectedLevelingChart('Overall')}
        >
          🌐 Overall
        </button>
        <button 
          className={`${styles.subButton} ${selectedLevelingChart === 'Specific' ? styles.active : ''}`} 
          onClick={() => setSelectedLevelingChart('Specific')}
        >
          🎯 Specific
        </button>
      </div>
      {selectedLevelingChart === 'Overall' && (
        <LevelingOverallSection levelingData={levelingData} />
      )}
      {selectedLevelingChart === 'Specific' && (
        <LevelingSpecificSection
          levelingData={levelingData}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedMainStat={selectedMainStat}
          setSelectedMainStat={setSelectedMainStat}
        />
      )}
    </>
  );
};

export default LevelingSection;
