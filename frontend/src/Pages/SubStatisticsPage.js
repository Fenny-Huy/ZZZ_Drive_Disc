import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ChartTable from '../Components/ChartTable'; // Import the new component
import 'chart.js/auto';
import styles from '../Styles/Pages/SubStatisticsPage.module.css';
import { apiConfig } from '../config/config';



const SubStatisticsPage = () => {

  const [selectedCategory, setSelectedCategory] = useState('Set/Source');

  const [setData, setSetData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [setSourceComboData, setSetSourceComboData] = useState([]);
  const [isSetSelected, setIsSetSelected] = useState(false);
  const [isSourceSelected, setIsSourceSelected] = useState(false);

  const [isSpecificSelected, setIsSpecificSelected] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedSet, setSelectedSet] = useState('');


  const [scoreData, setScoreData] = useState([]);
  const [scoreSetData, setScoreSetData] = useState([]);
  const [scoreSourceData, setScoreSourceData] = useState([]);
  const [scoreSetSourceData, setScoreSetSourceData] = useState([]);

  // Leveling investment states
  const [levelingInvestmentData, setLevelingInvestmentData] = useState([]);
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [isSetLevelingSelected, setIsSetLevelingSelected] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevelingSet, setSelectedLevelingSet] = useState('');


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

  useEffect(() => {
    setIsSetSelected(false);
    setIsSourceSelected(false);
    setIsSpecificSelected(false);
    setIsTypeSelected(false);
    setIsSetLevelingSelected(false);
    setSelectedType('');
    setSelectedLevelingSet('');
  }, [selectedCategory]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/score/`);
        setScoreData(response.data);
      } catch (error) {
        console.error('Error fetching set data:', error);
      }
    };
  
    fetchData();

  },[]);

  useEffect(() => {
    const fetchSetData = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/score/set`);
        setScoreSetData(response.data);
      } catch (error) {
        console.error('Error fetching set data:', error);
      }
    };
    fetchSetData();
  }, []);

  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/score/where`);
        setScoreSourceData(response.data);
      } catch (error) {
        console.error('Error fetching source data:', error);
      }
    };

    fetchSourceData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/score/set_where`);
        setScoreSetSourceData(response.data);
      } catch (error) {
        console.error('Error fetching set and source data:', error);
      }
    };
    fetchData();
  }, []);
  
        
  useEffect(() => {
    const fetchLevelingInvestmentData = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/statistics/levelinginvestment`);
        setLevelingInvestmentData(response.data);
      } catch (error) {
        console.error('Error fetching leveling investment data:', error);
      }
    };
    fetchLevelingInvestmentData();
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

  const renderSetSourceContent = () => {
    const combineCap = 3.5; //records with value under this cap will be combined into 'Other'
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

    const prepareChartSetSpecificData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      const processedData = data.map(item => ({
        label: item.set,
        substat: item.set,
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
      }
      );

      if (other.count > 0) {
        filteredData.push(other);
      }

      return filteredData;

    };

    const prepareTableSetSpecificData = (data) => {
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
            <div className={styles.select_container}>
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
            <div className={styles.select_container}>
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
        chartdata = prepareChartSetSpecificData(setSourceComboData.filter(item => item.where === selectedSource));
        tabledata = prepareTableSetSpecificData(setSourceComboData.filter(item => item.where === selectedSource));
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

  const renderScoreContent = () => {
    const combineCap = 4;
    const prepareTableScoreData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        substat: item.score,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const prepareChartScoreData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        label: item.score,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));

    };

    const prepareTableScoreSetData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        substat: `${item.set} - ${item.score}`,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const prepareChartScoreSetData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      const processedData = data.map(item => ({
        label: `${item.set} - ${item.score}`,
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

    const prepareTableScoreSourceData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        substat: `${item.where} - ${item.score}`,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const prepareChartScoreSourceData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      const processedData = data.map(item => ({
        label: `${item.where} - ${item.score}`,
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

    const prepareScoreSetSpecificData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        label: item.score,
        substat: item.score,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const prepareScoreSourceSpecificData = (data) => {
      const total = data.reduce((sum, item) => sum + item.count, 0);
      return data.map(item => ({
        label: item.score,
        substat: item.score,
        percentage: (item.count / total) * 100,
        count: item.count,
      }));
    };

    const separateDataOfScoreSet = (data, string) => {
      if (string) {
        const filteredData = data.filter(item => item.where === string);
        const aggregatedData = filteredData.reduce((acc, item) => {
          const existing = acc.find(i => i.score === item.score);
          if (existing) {
            existing.count += item.count;
          } else {
            acc.push({ score: item.score, count: item.count });
          }
          return acc;
        }, []);
        return aggregatedData;
      }
      return [];
    };

    const separateDataOfScoreSource = (data, string) => {
      if (string) {
        const filteredData = data.filter(item => item.set === string);
        const aggregatedData = filteredData.reduce((acc, item) => {
          const existing = acc.find(i => i.score === item.score);
          if (existing) {
            existing.count += item.count;
          } else {
            acc.push({ score: item.score, count: item.count });
          }
          return acc;
        }, []);
        return aggregatedData;
      }
      return [];
    };


    const renderDropdown = () => {
      if (isSpecificSelected) {
        if (isSetSelected && !isSourceSelected) {
          const sources = [...new Set(scoreSourceData.map(item => item.where))].map(source => ({
            value: source,
            label: source,
          }));
          return (
            <div className={styles.select_container}>
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
        } else if (isSourceSelected && !isSetSelected) {
          const sets = [...new Set(scoreSetData.map(item => item.set))].map(set => ({
            value: set,
            label: set,
          }));
          return (
            <div className={styles.select_container}>
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
            <div className={styles.select_container}>
              <Select
                value={sources.find(option => option.value === selectedSource)}
                onChange={(selectedOption) => setSelectedSource(selectedOption ? selectedOption.value : '')}
                options={sources}
                placeholder="Select or type to search Source"
                isClearable
                classNamePrefix="select"
              />
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
      if (isSetSelected && selectedSource && !isSourceSelected) {
        chartdata = prepareScoreSetSpecificData(separateDataOfScoreSet(scoreSetSourceData, selectedSource));
        tabledata = prepareScoreSetSpecificData(separateDataOfScoreSet(scoreSetSourceData, selectedSource));
        title = `Score for Source: ${selectedSource}`;
      } else if (isSourceSelected && selectedSet && !isSetSelected) {
        chartdata = prepareScoreSourceSpecificData(separateDataOfScoreSource(scoreSetSourceData, selectedSet));
        tabledata = prepareScoreSourceSpecificData(separateDataOfScoreSource(scoreSetSourceData, selectedSet));
        title = `Score for Set: ${selectedSet}`;
      } else if (isSetSelected && selectedSource && isSourceSelected && selectedSet) {
        chartdata = prepareScoreSetSpecificData(scoreSetSourceData.filter(item => item.where === selectedSource && item.set === selectedSet));
        tabledata = prepareScoreSetSpecificData(scoreSetSourceData.filter(item => item.where === selectedSource && item.set === selectedSet));
        title = `Score for Source: ${selectedSource} and Set: ${selectedSet}`;
      }
    } else
    {
      if (isSetSelected && isSourceSelected) {
        tabledata = prepareTableScoreData(scoreData);
        chartdata = prepareChartScoreData(scoreData);
        title = 'Score Distribution';
      } else if (isSetSelected) {
        chartdata = prepareChartScoreSetData(scoreSetData);
        tabledata = prepareTableScoreSetData(scoreSetData);
        title = 'Score and Set Distribution';
      } else if (isSourceSelected) {
        chartdata = prepareChartScoreSourceData(scoreSourceData);
        tabledata = prepareTableScoreSourceData(scoreSourceData);
        title = 'Score and Source Distribution';
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


  const renderLevelingInvestmentContent = () => {
    const getUniqueTypes = () => {
      const types = [...new Set(levelingInvestmentData.map(item => item.type))];
      return types;
    };

    const getUniqueSets = () => {
      const sets = [...new Set(levelingInvestmentData.map(item => item.set))];
      return sets.sort();
    };

    const getTypeData = (type) => {
      const filteredData = levelingInvestmentData.filter(item => item.type === type);
      const total = filteredData.reduce((sum, item) => sum + item.TotalRoll, 0);
      return filteredData.map(item => ({
        substat: item.set,
        label: item.set,
        percentage: (item.TotalRoll / total) * 100,
        count: item.TotalRoll,
        artifactCount: item.ArtifactCount
      }));
    };

    const getAllTypeData = () => {
      // Group all data by set, summing up total rolls across all types
      const groupedData = levelingInvestmentData.reduce((acc, item) => {
        const existing = acc.find(i => i.set === item.set);
        if (existing) {
          existing.TotalRoll += item.TotalRoll;
          existing.ArtifactCount += item.ArtifactCount;
        } else {
          acc.push({
            set: item.set,
            TotalRoll: item.TotalRoll,
            ArtifactCount: item.ArtifactCount
          });
        }
        return acc;
      }, []);

      const total = groupedData.reduce((sum, item) => sum + item.TotalRoll, 0);
      return groupedData.map(item => ({
        substat: item.set,
        label: item.set,
        percentage: (item.TotalRoll / total) * 100,
        count: item.TotalRoll,
        artifactCount: item.ArtifactCount
      }));
    };

    const getSetData = (set) => {
      const filteredData = levelingInvestmentData.filter(item => item.set === set);
      const total = filteredData.reduce((sum, item) => sum + item.TotalRoll, 0);
      return filteredData.map(item => ({
        substat: item.type,
        label: item.type,
        percentage: (item.TotalRoll / total) * 100,
        count: item.TotalRoll,
        artifactCount: item.ArtifactCount
      }));
    };

    const renderTypeButtons = () => {
      const types = getUniqueTypes();
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
      const sets = getUniqueSets();
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
        const allTypeData = getAllTypeData();
        chartData = allTypeData;
        tableData = allTypeData;
        title = 'All Types - Total Rolls by Set';
      } else {
        const typeData = getTypeData(selectedType);
        chartData = typeData;
        tableData = typeData;
        title = `${selectedType} - Total Rolls by Set`;
      }
    } else if (isSetLevelingSelected && selectedLevelingSet) {
      const setData = getSetData(selectedLevelingSet);
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
      </>
    );
  };
  
  
  const handleSetSelection = () => {
    if (isSpecificSelected && selectedCategory !== 'Score') {
      setIsSourceSelected(false);
    }
    setIsSetSelected(!isSetSelected);
  };
  
  const handleSourceSelection = () => {
    if (isSpecificSelected && selectedCategory !== 'Score') {
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

    if (selectedCategory === 'Set/Source') {
        return (
        <>
            <div className={styles.button_container}>
            <button className={`${styles.button} ${isSetSelected ? styles.active : ''}`} onClick={handleSetSelection}>Set</button>
            <button className={`${styles.button} ${isSourceSelected ? styles.active : ''}`} onClick={handleSourceSelection}>Source</button>
            <button className={`${styles.button} ${isSpecificSelected ? styles.active : ''}`} onClick={handleSpecificSelection}>Specific</button>
            </div>
            {renderSetSourceContent()}
        </>
        );
    } else if (selectedCategory === 'Score') {
        return (
        <>
            <div className={styles.button_container}>
            <button className={`${styles.button} ${isSetSelected ? styles.active : ''}`} onClick={handleSetSelection}>Set</button>
            <button className={`${styles.button} ${isSourceSelected ? styles.active : ''}`} onClick={handleSourceSelection}>Source</button>
            <button className={`${styles.button} ${isSpecificSelected ? styles.active : ''}`} onClick={handleSpecificSelection}>Specific</button>
            </div>
            {renderScoreContent()}
        </>
        );
    } else if (selectedCategory === 'Leveling Invest') {
        return renderLevelingInvestmentContent();
    }

  };

  return (
    <div className={styles.statistics_page}>
      <h1>Artifact Statistics</h1>
      <div className={styles.button_container}>
        <button className={`${styles.button} ${selectedCategory === 'Set/Source' ? styles.active : ''}`} onClick={() => setSelectedCategory('Set/Source')}>Set/Source</button>
        <button className={`${styles.button} ${selectedCategory === 'Score' ? styles.active : ''}`} onClick={() => setSelectedCategory('Score')}>Score</button>
        <button className={`${styles.button} ${selectedCategory === 'Leveling Invest' ? styles.active : ''}`} onClick={() => setSelectedCategory('Leveling Invest')}>Leveling Invest</button>
      </div>
      {renderContent()}
    </div>
  );



}


export default SubStatisticsPage;