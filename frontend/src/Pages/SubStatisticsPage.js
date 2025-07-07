import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiConfig } from '../config/config';
import SetSourceSection from '../Components/StatisticsSections/SetSourceSection';
import ScoreSection from '../Components/StatisticsSections/ScoreSection';
import LevelingInvestmentSection from '../Components/StatisticsSections/LevelingInvestmentSection';
import styles from '../Styles/Pages/SubStatisticsPage.module.css';



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
          <SetSourceSection
            setData={setData}
            sourceData={sourceData}
            setSourceComboData={setSourceComboData}
            isSetSelected={isSetSelected}
            isSourceSelected={isSourceSelected}
            isSpecificSelected={isSpecificSelected}
            selectedSource={selectedSource}
            selectedSet={selectedSet}
            setSelectedSource={setSelectedSource}
            setSelectedSet={setSelectedSet}
          />
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
          <ScoreSection
            scoreData={scoreData}
            scoreSetData={scoreSetData}
            scoreSourceData={scoreSourceData}
            scoreSetSourceData={scoreSetSourceData}
            isSetSelected={isSetSelected}
            isSourceSelected={isSourceSelected}
            isSpecificSelected={isSpecificSelected}
            selectedSource={selectedSource}
            selectedSet={selectedSet}
            setSelectedSource={setSelectedSource}
            setSelectedSet={setSelectedSet}
          />
        </>
      );
    } else if (selectedCategory === 'Leveling Invest') {
      return (
        <LevelingInvestmentSection
          levelingInvestmentData={levelingInvestmentData}
          isTypeSelected={isTypeSelected}
          isSetLevelingSelected={isSetLevelingSelected}
          selectedType={selectedType}
          selectedLevelingSet={selectedLevelingSet}
          setIsTypeSelected={setIsTypeSelected}
          setIsSetLevelingSelected={setIsSetLevelingSelected}
          setSelectedType={setSelectedType}
          setSelectedLevelingSet={setSelectedLevelingSet}
        />
      );
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