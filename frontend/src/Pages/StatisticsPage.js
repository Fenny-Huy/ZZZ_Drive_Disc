import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'chart.js/auto';
import styles from '../Styles/Pages/StatisticsPage.module.css';
import { apiConfig } from '../config/config';

// Import section components
import MainStatSection from '../Components/StatisticsSections/MainStatSection';
import SubstatSection from '../Components/StatisticsSections/SubstatSection';
import LevelingSection from '../Components/StatisticsSections/LevelingSection';

const StatisticsPage = () => {
  const [typeData, setTypeData] = useState([]);
  const [mainStatData, setMainStatData] = useState([]);
  const [substatData, setSubstatData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('Types');
  const [selectedCategory, setSelectedCategory] = useState('Main Stat');
  const [selectedSubstatChart, setSelectedSubstatChart] = useState('Overall');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMainStat, setSelectedMainStat] = useState(null);
  const [levelingData, setLevelingData] = useState([]);
  const [selectedLevelingChart, setSelectedLevelingChart] = useState('Overall');
  const [selectedSet, setSelectedSet] = useState(null);
  const [availableSets, setAvailableSets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchAvailableSets = async () => {
      try {
        if (selectedCategory === 'Main Stat') {
          const response = await axios.get(`${apiConfig.apiUrl}/mainstatsets`);
          setAvailableSets(response.data);
        } else if (selectedCategory === 'Substats') {
          const response = await axios.get(`${apiConfig.apiUrl}/mainstatsets`);
          setAvailableSets(response.data);
        } else if (selectedCategory === 'Leveling') {
          const response = await axios.get(`${apiConfig.apiUrl}/levelingsets`);
          setAvailableSets(response.data);
        }
        
      } catch (error) {
        console.error('Error fetching available sets:', error);
      }
    };
    fetchAvailableSets();
  }, [selectedCategory]);


  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const url = selectedSet ? `${apiConfig.apiUrl}/statistics/mainstat/${selectedSet}` : `${apiConfig.apiUrl}/statistics/mainstat`;
        const response = await axios.get(url);
        setTypeData(response.data.type_percentages);
        setMainStatData(response.data.main_stat_percentages);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to fetch statistics data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchStatistics();
  }, [selectedSet]);
  
  useEffect(() => {
    const fetchSubstatStatistics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const url = selectedSet ? `${apiConfig.apiUrl}/statistics/substats/${selectedSet}` : `${apiConfig.apiUrl}/statistics/substats`;
        const response = await axios.get(url);
        setSubstatData(response.data);
      } catch (error) {
        console.error('Error fetching substat statistics:', error);
        setError('Failed to fetch substat statistics');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSubstatStatistics();
  }, [selectedSet]);
  
  useEffect(() => {
    const fetchLevelingStatistics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const url = selectedSet ? `${apiConfig.apiUrl}/statistics/leveling/${selectedSet}` : `${apiConfig.apiUrl}/statistics/leveling`;
        const response = await axios.get(url);
        setLevelingData(response.data);
      } catch (error) {
        console.error('Error fetching leveling statistics:', error);
        setError('Failed to fetch leveling statistics');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchLevelingStatistics();
  }, [selectedSet]);

  useEffect(() => {
    setSelectedMainStat(null);
    setSelectedType(null);
  }, [selectedCategory]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading statistics data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
        </div>
      );
    }

    switch (selectedCategory) {
      case 'Main Stat':
        return (
          <MainStatSection
            selectedChart={selectedChart}
            setSelectedChart={setSelectedChart}
            typeData={typeData}
            mainStatData={mainStatData}
            isLoading={isLoading}
          />
        );

      case 'Substats':
        return (
          <SubstatSection
            selectedSubstatChart={selectedSubstatChart}
            setSelectedSubstatChart={setSelectedSubstatChart}
            substatData={substatData}
            typeData={typeData}
            mainStatData={mainStatData}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedMainStat={selectedMainStat}
            setSelectedMainStat={setSelectedMainStat}
          />
        );

      case 'Leveling':
        return (
          <LevelingSection
            selectedLevelingChart={selectedLevelingChart}
            setSelectedLevelingChart={setSelectedLevelingChart}
            levelingData={levelingData}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedMainStat={selectedMainStat}
            setSelectedMainStat={setSelectedMainStat}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.statisticsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Artifact Statistics</h1>
        <p className={styles.pageSubtitle}>Explore comprehensive data insights and patterns</p>
      </div>
      
      <div className={styles.controlsContainer}>
        <div className={styles.categoryButtons}>
          <button className={`${styles.categoryButton} ${selectedCategory === 'Main Stat' ? styles.active : ''}`} onClick={() => setSelectedCategory('Main Stat')}>
            📊 Main Stat
          </button>
          <button className={`${styles.categoryButton} ${selectedCategory === 'Substats' ? styles.active : ''}`} onClick={() => setSelectedCategory('Substats')}>
            ⚡ Substats
          </button>
          <button className={`${styles.categoryButton} ${selectedCategory === 'Leveling' ? styles.active : ''}`} onClick={() => setSelectedCategory('Leveling')}>
            🔄 Leveling
          </button>
        </div>
        
        <div className={styles.filterSection}>
          <div className={styles.filterLabel}>Filter by Artifact Set</div>
          <div className={styles.selectContainer}>
            <Select
              value={availableSets.find(option => option.value === selectedSet)}
              onChange={(selectedOption) => setSelectedSet(selectedOption ? selectedOption.value : null)}
              options={availableSets.map(set => ({ value: set, label: set }))}
              placeholder="Select or type to search Set"
              isClearable
              classNamePrefix="select"
            />
          </div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {renderContent()}
      </div>
    </div>
  );
};

export default StatisticsPage;