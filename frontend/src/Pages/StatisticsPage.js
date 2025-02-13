import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ChartTable from '../Components/ChartTable'; // Import the new component
import 'chart.js/auto';
import styles from '../Styles/Pages/StatisticsPage.module.css';
import { apiConfig, keysConfig } from '../config/config';
import LevelingChartTable from '../Components/LevelingChartTable';

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
        const url = selectedSet ? `${apiConfig.apiUrl}/statistics/mainstat/${selectedSet}` : `${apiConfig.apiUrl}/statistics/mainstat`;
        const response = await axios.get(url);
        setTypeData(response.data.type_percentages);
        setMainStatData(response.data.main_stat_percentages);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
  
    fetchStatistics();
  }, [selectedSet]);
  
  useEffect(() => {
    const fetchSubstatStatistics = async () => {
      try {
        const url = selectedSet ? `${apiConfig.apiUrl}/statistics/substats/${selectedSet}` : `${apiConfig.apiUrl}/statistics/substats`;
        const response = await axios.get(url);
        setSubstatData(response.data);
      } catch (error) {
        console.error('Error fetching substat statistics:', error);
      }
    };
  
    fetchSubstatStatistics();
  }, [selectedSet]);
  
  useEffect(() => {
    const fetchLevelingStatistics = async () => {
      try {
        const url = selectedSet ? `${apiConfig.apiUrl}/statistics/leveling/${selectedSet}` : `${apiConfig.apiUrl}/statistics/leveling`;
        const response = await axios.get(url);
        setLevelingData(response.data);
      } catch (error) {
        console.error('Error fetching leveling statistics:', error);
      }
    };
  
    fetchLevelingStatistics();
  }, [selectedSet]);

  useEffect(() => {
    setSelectedMainStat(null);
    setSelectedType(null);
  }, [selectedCategory]);





  const prepareChartData = (data, labelKey, valueKey) => {
    // Sort data in descending order based on the value
    const sortedData = data.sort((a, b) => b[valueKey] - a[valueKey]);

    const colors = [
      '#FF0000',  // Bright red  
      '#00FF00',  // Bright green  
      '#0000FF',  // Bright blue  
      '#FFFF00',  // Bright yellow  
      '#FF00FF',  // Magenta  
      '#00FFFF',  // Cyan  
      '#FFA500',  // Orange  
      '#800080',  // Purple  
      '#008000',  // Dark green  
      '#000080',  // Navy blue  
      '#A52A2A',  // Brown  
      '#808080',  // Gray  
      '#FFC0CB',  // Pink  
      '#FFD700',  // Gold  
      '#008080',  // Teal  
    ];

    return {
      labels: sortedData.map(item => item[labelKey]),
      datasets: [
        {
          
          data: sortedData.map(item => item[valueKey]),
          backgroundColor: colors.slice(0, sortedData.length),
        },
      ],
    };
  };


  const prepareLevelingChartData = (data, labelKey, valueKeys) => {
    // Sort data in descending order based on the first value key
    const sortedData = data.sort((a, b) => b[valueKeys[0]] - a[valueKeys[0]]);

    const colors = [
      '#FF0000',  // Bright red  
      '#00FF00',  // Bright green  
      '#0000FF',  // Bright blue  
      '#FFFF00',  // Bright yellow  
      '#FF00FF',  // Magenta  
      '#00FFFF',  // Cyan  
      '#FFA500',  // Orange  
      '#800080',  // Purple  
      '#008000',  // Dark green  
      '#000080',  // Navy blue  
      '#A52A2A',  // Brown  
      '#808080',  // Gray  
      '#FFC0CB',  // Pink  
      '#FFD700',  // Gold  
      '#008080',  // Teal  
    ];

    return {
      labels: sortedData.map(item => item[labelKey]),
      datasets: valueKeys.map((key, index) => ({
        label: key,
        data: sortedData.map(item => item[key]),
        backgroundColor: colors.slice(index, index + 1),
      })),
    };
  };

  const renderLevelingOverall = () => {
    const substatKeyToMainStat = {};
    const levelingSubstatKeyToMainStat = {};
    const substatToLevelingKeys = {};
    const addedToMainStatKey = {};

    keysConfig.forEach(mapping => {
      const [subKey, rollKey, addedKey, value] = mapping;
      if (subKey) substatKeyToMainStat[subKey] = value;
      if (rollKey) levelingSubstatKeyToMainStat[rollKey] = value;
      if (subKey && rollKey) substatToLevelingKeys[subKey] = rollKey;
      if (addedKey) addedToMainStatKey[addedKey] = value;
    });

    const substatTotals = levelingData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('sub_') && item.main_stat !== substatKeyToMainStat[key]) {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});
    

    const totalSubstatCounts = Object.keys(substatKeyToMainStat).reduce((acc, key) => {
      acc[key] = levelingData.reduce((sum, item) => {
        if (item.main_stat !== substatKeyToMainStat[key]) {
          return sum + item.substatCount;
        }
        return sum;
      }, 0);
      return acc;
    }, {});

    const levelingCount = levelingData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('roll_') && item.main_stat !== levelingSubstatKeyToMainStat[key]) {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});


    const totalLevelingCount = Object.keys(levelingSubstatKeyToMainStat).reduce((acc, key) => {
      acc[key] = levelingData.reduce((sum, item) => {
        if (item.main_stat !== levelingSubstatKeyToMainStat[key]) {
          return sum + item.TotalRoll;
        }
        return sum;
      }, 0);
      return acc;
    }, {});

    
    
    const substatDistribution = Object.keys(substatTotals).map(key => ({
      substat: substatKeyToMainStat[key],
      appearancePercentage: (substatTotals[key] / totalSubstatCounts[key]) * 100,
      rollPercentage: (levelingCount[substatToLevelingKeys[key]] / totalLevelingCount[substatToLevelingKeys[key]]) * 100,
      substatcount: substatTotals[key],
      rollcount: levelingCount[substatToLevelingKeys[key]],
    }));



    const addedSubstatDistribution = levelingData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('added_')) {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});

    const totalAdded = levelingData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('added_') && item.main_stat !== addedToMainStatKey[key]) {
          acc = (acc || 0) + item[key];
        }
      });
      return acc;
    }, 0);
    console.log(totalAdded);

    const addedSubstatData = Object.keys(addedSubstatDistribution).map(key => ({
      substat: addedToMainStatKey[key],
      percentage: (addedSubstatDistribution[key] / totalAdded) * 100,
      count: addedSubstatDistribution[key],
    }));

    return (
      
        <LevelingChartTable
          chartType="bar"
          levelingChartData = {prepareLevelingChartData(substatDistribution, 'substat', ['appearancePercentage', 'rollPercentage'])}
          levelingTableData={substatDistribution}
          addedChartData={prepareChartData(addedSubstatData, 'substat', 'percentage')}
          addedTableData={addedSubstatData}
        />
      
    );
  };

  const renderLevelingSpecific = () => {
    const handleTypeSelection = (type) => {
      setSelectedType(type);
      setSelectedMainStat(null); // Reset main stat selection when type changes
    };
  
    const handleMainStatSelection = (mainStat) => {
      setSelectedMainStat(mainStat);
    };
  
    const substatKeyToMainStat = {};
    const levelingSubstatKeyToMainStat = {};
    const substatToLevelingKeys = {};
    const addedToMainStatKey = {};
    
    keysConfig.forEach(mapping => {
      const [subKey, rollKey, addedKey, value] = mapping;
      if (subKey) substatKeyToMainStat[subKey] = value;
      if (rollKey) levelingSubstatKeyToMainStat[rollKey] = value;
      if (subKey && rollKey) substatToLevelingKeys[subKey] = rollKey;
      if (addedKey) addedToMainStatKey[addedKey] = value;
    });
  
    const filteredLevelingData = levelingData.filter(item => item.type === selectedType && item.main_stat === selectedMainStat);
  
    const substatTotals = filteredLevelingData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('sub_')) {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});
  
    const totalSubstatCounts = Object.keys(substatKeyToMainStat).reduce((acc, key) => {
      acc[key] = filteredLevelingData.reduce((sum, item) => {
        return sum + item.substatCount;
      }, 0);
      return acc;
    }, {});
  
    const levelingCount = filteredLevelingData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('roll_')) {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});
  
    const totalLevelingCount = Object.keys(levelingSubstatKeyToMainStat).reduce((acc, key) => {
      acc[key] = filteredLevelingData.reduce((sum, item) => {
        return sum + item.TotalRoll;
      }, 0);
      return acc;
    }, {});
  
    const substatDistribution = Object.keys(substatTotals).map(key => ({
      substat: substatKeyToMainStat[key],
      appearancePercentage: (substatTotals[key] / totalSubstatCounts[key]) * 100,
      rollPercentage: (levelingCount[substatToLevelingKeys[key]] / totalLevelingCount[substatToLevelingKeys[key]]) * 100,
      substatcount: substatTotals[key],
      rollcount: levelingCount[substatToLevelingKeys[key]],
    }));
  
    const addedSubstatDistribution = filteredLevelingData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('added_')) {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});
  
    const totalAdded = filteredLevelingData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('added_') && item.main_stat !== addedToMainStatKey[key]) {
          acc = (acc || 0) + item[key];
        }
      });
      return acc;
    }, 0);
  
    const addedSubstatData = Object.keys(addedSubstatDistribution).map(key => ({
      substat: addedToMainStatKey[key],
      percentage: (addedSubstatDistribution[key] / totalAdded) * 100,
      count: addedSubstatDistribution[key],
    }));
  
    return (
      <>
        <div className={styles.button_container}>
          {levelingData.map(item => item.type).filter((value, index, self) => self.indexOf(value) === index).map(type => (
            <button
              key={type}
              className={`${styles.button} ${selectedType === type ? styles.active : ''}`}
              onClick={() => handleTypeSelection(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {selectedType && (
          <div className={styles.button_container}>
            {levelingData.filter(item => item.type === selectedType).map(item => item.main_stat).filter((value, index, self) => self.indexOf(value) === index).map(mainStat => (
              <button
                key={mainStat}
                className={`${styles.button} ${selectedMainStat === mainStat ? styles.active : ''}`}
                onClick={() => handleMainStatSelection(mainStat)}
              >
                {mainStat}
              </button>
            ))}
          </div>
        )}
        {selectedType && selectedMainStat && (
          <>
          <LevelingChartTable
            chartType="pie"
            levelingChartData = {prepareLevelingChartData(substatDistribution, 'substat', ['appearancePercentage', 'rollPercentage'])}
            levelingTableData={substatDistribution}
            addedChartData={prepareChartData(addedSubstatData, 'substat', 'percentage')}
            addedTableData={addedSubstatData}
          />
          </>
        )}
      </>
    );
  };

  const renderSubstatOverall = () => {
    const substatKeyToMainStat = {};

    
    keysConfig.forEach(mapping => {
      // eslint-disable-next-line
      const [subKey, rollKey, addedKey, value] = mapping;
      if (subKey) substatKeyToMainStat[subKey] = value;
    });

    const substatTotals = substatData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key.startsWith('sub_') && item.main_stat !== substatKeyToMainStat[key]) {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});

    const totalSubstatCounts = Object.keys(substatKeyToMainStat).reduce((acc, key) => {
      acc[key] = substatData.reduce((sum, item) => {
        if (item.main_stat !== substatKeyToMainStat[key]) {
          return sum + item.ArtifactCount;
        }
        return sum;
      }, 0);
      return acc;
    }, {});

    const substatDistribution = Object.keys(substatTotals).map(key => ({
      substat: substatKeyToMainStat[key],
      percentage: (substatTotals[key] / totalSubstatCounts[key]) * 100,
      count: substatTotals[key],
    }));

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

  const renderSubstatSpecific = () => {

    const substatKeyToMainStat = {};

    
    keysConfig.forEach(mapping => {
      // eslint-disable-next-line
      const [subKey, rollKey, addedKey, value] = mapping;
      if (subKey) substatKeyToMainStat[subKey] = value;
    });


    const handleTypeSelection = (type) => {
      setSelectedType(type);
      setSelectedMainStat(null); // Reset selectedMainStat when changing the selectedType
    };

    const data = substatData.find(item => item.type === selectedType && item.main_stat === selectedMainStat);
    const substatDistribution = data ? Object.keys(data).filter(key => key.startsWith('sub_')).map(key => ({
      substat: substatKeyToMainStat[key],
      percentage: (data[key] / data.substatCount) * 100,
      count: data[key],
    })) : [];

    return (
      <div className={styles.substat_content_container}>
        <div className={styles.button_container}>
          {typeData.map(item => (
            <button
              key={item[0]}
              className={`${styles.button} ${selectedType === item[0] ? styles.active : ''}`}
              onClick={() => handleTypeSelection(item[0])}
            >
              {item[0]}
            </button>
          ))}
        </div>
        {selectedType && (
          <div className={styles.button_container}>
            {mainStatData.filter(item => item[0] === selectedType).map(item => (
              <button
                key={item[1]}
                className={`${styles.button} ${selectedMainStat === item[1] ? styles.active : ''}`}
                onClick={() => setSelectedMainStat(item[1])}
              >
                {item[1]}
              </button>
            ))}
          </div>
        )}
        {selectedType && selectedMainStat && (
          <ChartTable
            chartType="pie"
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



  const renderContent = () => {
    if (selectedCategory === 'Main Stat') {
      const data = selectedChart === 'Types'
        ? typeData.map(item => ({ substat: item[0], percentage: item[1], count: item[2] }))
        : mainStatData.filter(item => item[0] === selectedChart).map(item => ({ substat: item[1], percentage: item[2], count: item[3] }));

      return (
        <>
          <div className={styles.button_container}>
            <button className={`${styles.button} ${selectedChart === 'Types' ? styles.active : ''}`} onClick={() => setSelectedChart('Types')}>Slots</button>
            <button className={`${styles.button} ${selectedChart === '4' ? styles.active : ''}`} onClick={() => setSelectedChart('4')}>4</button>
            <button className={`${styles.button} ${selectedChart === '5' ? styles.active : ''}`} onClick={() => setSelectedChart('5')}>5</button>
            <button className={`${styles.button} ${selectedChart === '6' ? styles.active : ''}`} onClick={() => setSelectedChart('6')}>6</button>
          </div>
          <ChartTable
            chartType="pie"
            chartData={prepareChartData(data, 'substat', 'percentage')}
            tableData={data}
            chartTitle={selectedChart === 'Types' ? 'Type Distribution' : `Slot ${selectedChart} Main Stat Distribution`}
            tableTitle={selectedChart === 'Types' ? 'Type Counts' : `Slot ${selectedChart} Main Stat Counts`}
            tableFirstField={selectedChart === 'Types' ? 'Type' : 'Main Stat'}
          />
        </>
      );
    } else if (selectedCategory === 'Substats') {
      return (
        <>
          <div className={styles.button_container}>
            <button className={`${styles.button} ${selectedSubstatChart === 'Overall' ? styles.active : ''}`} onClick={() => setSelectedSubstatChart('Overall')}>Overall</button>
            <button className={`${styles.button} ${selectedSubstatChart === 'Specific' ? styles.active : ''}`} onClick={() => setSelectedSubstatChart('Specific')}>Specific</button>
          </div>
          {selectedSubstatChart === 'Overall' && renderSubstatOverall()}
          {selectedSubstatChart === 'Specific' && renderSubstatSpecific()}
        </>
      );
    } else if (selectedCategory === 'Leveling') {
      return (
        <>
          <div className={styles.button_container}>
            <button className={`${styles.button} ${selectedLevelingChart === 'Overall' ? styles.active : ''}`} onClick={() => setSelectedLevelingChart('Overall')}>Overall</button>
            <button className={`${styles.button} ${selectedLevelingChart === 'Specific' ? styles.active : ''}`} onClick={() => setSelectedLevelingChart('Specific')}>Specific</button>
          </div>
          {selectedLevelingChart === 'Overall' && renderLevelingOverall()}
          {selectedLevelingChart === 'Specific' && renderLevelingSpecific()}
        </>
      );
    }

  };

  return (
    <div className={styles.statistics_page}>
      <h1>Artifact Statistics</h1>
      <div className={styles.button_container}>
        <button className={`${styles.button} ${selectedCategory === 'Main Stat' ? styles.active : ''}`} onClick={() => setSelectedCategory('Main Stat')}>Main Stat</button>
        <button className={`${styles.button} ${selectedCategory === 'Substats' ? styles.active : ''}`} onClick={() => setSelectedCategory('Substats')}>Substats</button>
        <button className={`${styles.button} ${selectedCategory === 'Leveling' ? styles.active : ''}`} onClick={() => setSelectedCategory('Leveling')}>Leveling</button>
      </div>
      <div className={styles.select_container}>
      <Select
        value={availableSets.find(option => option.value === selectedSet)}
        onChange={(selectedOption) => setSelectedSet(selectedOption ? selectedOption.value : null)}
        options={availableSets.map(set => ({ value: set, label: set }))}
        placeholder="Select or type to search Set"
        isClearable
        classNamePrefix="select"
      />
      </div>
      {renderContent()}
    </div>
  );
};

export default StatisticsPage;