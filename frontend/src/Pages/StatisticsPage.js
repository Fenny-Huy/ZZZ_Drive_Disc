import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ChartTable from '../Components/ChartTable'; // Import the new component
import 'chart.js/auto';
import '../Styles/Pages.css';
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


  const [setData, setSetData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [setSourceComboData, setSetSourceComboData] = useState([]);
  const [isSetSelected, setIsSetSelected] = useState(false);
  const [isSourceSelected, setIsSourceSelected] = useState(false);

  const [isSpecificSelected, setIsSpecificSelected] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedSet, setSelectedSet] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/statistics/mainstat`);
        
        setTypeData(response.data.type_percentages);
        setMainStatData(response.data.main_stat_percentages);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const fetchSubstatStatistics = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/statistics/substats`);
        
        setSubstatData(response.data);
      } catch (error) {
        console.error('Error fetching substat statistics:', error);
      }
    };

    fetchSubstatStatistics();
  }, []);

  useEffect(() => {
    const fetchLevelingStatistics = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/statistics/leveling`);
        setLevelingData(response.data);
      } catch (error) {
        console.error('Error fetching leveling statistics:', error);
      }
    };

    fetchLevelingStatistics();
  }, []);

  useEffect(() => {
    setSelectedMainStat(null);
    setSelectedType(null);
  }, [selectedCategory]);




  useEffect(() => {
    const fetchSetData = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/set/set`);
        setSetData(response.data);
      } catch (error) {
        console.error('Error fetching set data:', error);
      }
    };
  
    fetchSetData();
  }, []);
  
  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/set/where`);
        setSourceData(response.data);
      } catch (error) {
        console.error('Error fetching source data:', error);
      }
    };
  
    fetchSourceData();
  }, []);
  
  useEffect(() => {
    const fetchSetSourceComboData = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/set/set_where`);
        setSetSourceComboData(response.data);
      } catch (error) {
        console.error('Error fetching set and source data:', error);
      }
    };
  
    fetchSetSourceComboData();
  }, []);

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
        <div className="button-container">
          {levelingData.map(item => item.type).filter((value, index, self) => self.indexOf(value) === index).map(type => (
            <button
              key={type}
              className={selectedType === type ? 'active' : ''}
              onClick={() => handleTypeSelection(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {selectedType && (
          <div className="button-container">
            {levelingData.filter(item => item.type === selectedType).map(item => item.main_stat).filter((value, index, self) => self.indexOf(value) === index).map(mainStat => (
              <button
                key={mainStat}
                className={selectedMainStat === mainStat ? 'active' : ''}
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
      <div className="substat-content-container">
        <div className="button-container">
          {typeData.map(item => (
            <button
              key={item[0]}
              className={selectedType === item[0] ? 'active' : ''}
              onClick={() => handleTypeSelection(item[0])}
            >
              {item[0]}
            </button>
          ))}
        </div>
        {selectedType && (
          <div className="button-container">
            {mainStatData.filter(item => item[0] === selectedType).map(item => (
              <button
                key={item[1]}
                className={selectedMainStat === item[1] ? 'active' : ''}
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



  const renderSetSourceContent = () => {
    const combineCap = 4; //records with value under this cap will be combined into 'Other'
    const prepareTableSetData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        substat: item.set,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const prepareChartSetData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      const processedData = data.map(item => ({
        label: item.set,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    
      const other = {
        label: 'Other',
        percentage: 0,
        count: 0,
      };
    
      const filteredData = processedData.filter(item => {
        if (item.percentage < combineCap) {
          other.percentage += item.percentage;
          other.count += item.count;
          return false;
        }
        return true;
      });
    
      if (other.count > 0) {
        filteredData.push(other);
      }
    
      return filteredData;
    };
    
    const prepareSourceData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        label: item.where,
        substat: item.where,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const prepareSetSpecificData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        label: item.set,
        substat: item.set,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const prepareSourceSpecificData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        label: item.where,
        substat: item.where,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };
    
    const prepareTableSetSourceComboData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        substat: `${item.set} - ${item.where}`,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const prepareChartSetSourceComboData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      const processedData = data.map(item => ({
        label: `${item.set} - ${item.where}`,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    
      const other = {
        label: 'Other',
        substat: 'Other',
        percentage: 0,
        count: 0,
      };
    
      const filteredData = processedData.filter(item => {
        if (item.percentage < combineCap) {
          other.percentage += item.percentage;
          other.count += item.count;
          return false;
        }
        return true;
      });
    
      if (other.count > 0) {
        filteredData.push(other);
      }
    
      return filteredData;
    };


    
    const renderDropdown = () => {
      if (isSpecificSelected) {
        if (isSetSelected) {
          const sources = [...new Set(setSourceComboData.map(item => item.where))].map(source => ({
            value: source,
            label: source,
          }));
          return (
            <div className="select-container">
              <Select
                value={sources.find(option => option.value === selectedSource)}
                onChange={(selectedOption) => setSelectedSource(selectedOption ? selectedOption.value : '')}
                options={sources}
                placeholder="Select or type to search Source"
                isClearable
                classNamePrefix="select"
              />
            </div>
          );
        } else if (isSourceSelected) {
          const sets = [...new Set(setSourceComboData.map(item => item.set))].map(set => ({
            value: set,
            label: set,
          }));
          return (
            <div className="select-container">
              <Select
                value={sets.find(option => option.value === selectedSet)}
                onChange={(selectedOption) => setSelectedSet(selectedOption ? selectedOption.value : '')}
                options={sets}
                placeholder="Select or type to search Set"
                isClearable
                classNamePrefix="select"
              />
            </div>
          );
        }
      }
      return null;
    };



    let chartdata = [];
    let tabledata = [];
    let title = '';

    if (isSpecificSelected) {
      if (isSetSelected && selectedSource) {
        chartdata = prepareSetSpecificData(setSourceComboData.filter(item => item.where === selectedSource));
        tabledata = prepareSetSpecificData(setSourceComboData.filter(item => item.where === selectedSource));
        title = `Set Distribution for Source: ${selectedSource}`;
      } else if (isSourceSelected && selectedSet) {
        chartdata = prepareSourceSpecificData(setSourceComboData.filter(item => item.set === selectedSet));
        tabledata = prepareSourceSpecificData(setSourceComboData.filter(item => item.set === selectedSet));
        title = `Source Distribution for Set: ${selectedSet}`;
      }
    } else
    {
      if (isSetSelected && isSourceSelected) {
        tabledata = prepareTableSetSourceComboData(setSourceComboData);
        chartdata = prepareChartSetSourceComboData(setSourceComboData);
        title = 'Set and Source Distribution';
      } else if (isSetSelected) {
        chartdata = prepareChartSetData(setData);
        tabledata = prepareTableSetData(setData);
        title = 'Set Distribution';
      } else if (isSourceSelected) {
        chartdata = prepareSourceData(sourceData);
        tabledata = prepareSourceData(sourceData);
        title = 'Source Distribution';
      }
    }
    
    

  
    return (
      <>
        {renderDropdown()}
        {(isSetSelected || isSourceSelected) && (
          <ChartTable
            chartType="pie"
            chartData={prepareChartData(chartdata, 'label', 'percentage')}
            tableData={tabledata}
            chartTitle={title}
            tableTitle={title}
            tableFirstField="Label"
          />
        )}
      </>
    );
  };


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
    setSelectedSource('');
    setSelectedSet('');
  };

  const renderContent = () => {
    if (selectedCategory === 'Main Stat') {
      const data = selectedChart === 'Types'
        ? typeData.map(item => ({ substat: item[0], percentage: item[1], count: item[2] }))
        : mainStatData.filter(item => item[0] === selectedChart).map(item => ({ substat: item[1], percentage: item[2], count: item[3] }));

      return (
        <>
          <div className="button-container">
            <button className={selectedChart === 'Types' ? 'active' : ''} onClick={() => setSelectedChart('Types')}>Types</button>
            <button className={selectedChart === '4' ? 'active' : ''} onClick={() => setSelectedChart('4')}>4</button>
            <button className={selectedChart === '5' ? 'active' : ''} onClick={() => setSelectedChart('5')}>5</button>
            <button className={selectedChart === '6' ? 'active' : ''} onClick={() => setSelectedChart('6')}>6</button>
          </div>
          <ChartTable
            chartType="pie"
            chartData={prepareChartData(data, 'substat', 'percentage')}
            tableData={data}
            chartTitle={selectedChart === 'Types' ? 'Type Distribution' : `${selectedChart} Main Stat Distribution`}
            tableTitle={selectedChart === 'Types' ? 'Type Counts' : `${selectedChart} Main Stat Counts`}
            tableFirstField={selectedChart === 'Types' ? 'Type' : 'Main Stat'}
          />
        </>
      );
    } else if (selectedCategory === 'Substats') {
      return (
        <>
          <div className="button-container">
            <button className={selectedSubstatChart === 'Overall' ? 'active' : ''} onClick={() => setSelectedSubstatChart('Overall')}>Overall</button>
            <button className={selectedSubstatChart === 'Specific' ? 'active' : ''} onClick={() => setSelectedSubstatChart('Specific')}>Specific</button>
          </div>
          {selectedSubstatChart === 'Overall' && renderSubstatOverall()}
          {selectedSubstatChart === 'Specific' && renderSubstatSpecific()}
        </>
      );
    } else if (selectedCategory === 'Leveling') {
      return (
        <>
          <div className="button-container">
            <button className={selectedLevelingChart === 'Overall' ? 'active' : ''} onClick={() => setSelectedLevelingChart('Overall')}>Overall</button>
            <button className={selectedLevelingChart === 'Specific' ? 'active' : ''} onClick={() => setSelectedLevelingChart('Specific')}>Specific</button>
          </div>
          {selectedLevelingChart === 'Overall' && renderLevelingOverall()}
          {selectedLevelingChart === 'Specific' && renderLevelingSpecific()}
        </>
      );
    } else if (selectedCategory === 'Set/Source') {
      return (
        <>
          <div className="button-container">
          <button className={isSetSelected ? 'active' : ''} onClick={handleSetSelection}>Set</button>
          <button className={isSourceSelected ? 'active' : ''} onClick={handleSourceSelection}>Source</button>
          <button className={isSpecificSelected ? 'active' : ''} onClick={handleSpecificSelection}>Specific</button>
          </div>
          {renderSetSourceContent()}
        </>
      );
    }

  };

  return (
    <div className="statistics-page">
      <h1>Artifact Statistics</h1>
      <div className="button-container">
        <button className={selectedCategory === 'Main Stat' ? 'active' : ''} onClick={() => setSelectedCategory('Main Stat')}>Main Stat</button>
        <button className={selectedCategory === 'Substats' ? 'active' : ''} onClick={() => setSelectedCategory('Substats')}>Substats</button>
        <button className={selectedCategory === 'Leveling' ? 'active' : ''} onClick={() => setSelectedCategory('Leveling')}>Leveling</button>
        <button className={selectedCategory === 'Set/Source' ? 'active' : ''} onClick={() => setSelectedCategory('Set/Source')}>Set/Source</button>
      </div>
      {renderContent()}
    </div>
  );
};

export default StatisticsPage;