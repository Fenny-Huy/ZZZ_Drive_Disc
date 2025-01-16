// src/Pages/SearchArtifacts.js
import React, { useState } from 'react';
import axios from 'axios';
import ArtifactSearchForm from '../Components/ArtifactSearchForm';
import ArtifactListingForm from '../Components/ArtifactListingForm';
import { apiConfig, artifactConfig } from '../config/config';
import styles from '../Styles/Pages/SearchArtifacts.module.css';

const SearchArtifacts = () => {
  
  const handleEditModalChange = () => {
    
  };
  const [formData, setFormData] = useState({
    artifactSet: null,
    type: null,
    mainStat: null,
    substats: [],
    numberOfSubstats: "",
    score: null,
    source: null
  });
  const [artifacts, setArtifacts] = useState([]);

  const artifactTypes = artifactConfig.artifactTypes;
    
  const mainStatsOptions = artifactConfig.mainStatsOptions;

  const allSubstats = artifactConfig.allSubstats;
  const filteredSubstats = allSubstats.filter((substat) => substat !== formData.mainStat?.value);

  const scores = artifactConfig.scores;
  const sources = artifactConfig.sources;

  const artifactSets = artifactConfig.artifactSets;

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption,
      
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        substats: checked
          ? [...prev.substats, value]
          : prev.substats.filter((substat) => substat !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const payload = {
      set: formData.artifactSet?.value || null,
      type: formData.type?.value || null,
      main_stat: formData.mainStat?.value || null,
      number_of_substats: formData.numberOfSubstats || null,
      atk_percent: formData.substats.includes("%ATK") ? 1 : null,
      hp_percent: formData.substats.includes("%HP") ? 1 : null,
      def_percent: formData.substats.includes("%DEF") ? 1 : null,
      atk: formData.substats.includes("ATK") ? 1 : null,
      hp: formData.substats.includes("HP") ? 1 : null,
      defense: formData.substats.includes("DEF") ? 1 : null,
      pen: formData.substats.includes("PEN") ? 1 : null,
      ap: formData.substats.includes("AP") ? 1 : null,
      crit_rate: formData.substats.includes("Crit Rate") ? 1 : null,
      crit_dmg: formData.substats.includes("Crit DMG") ? 1 : null,
      where_got_it: formData.source,
      score: formData.score,
    };

    try {
      const response = await axios.get(`${apiConfig.apiUrl}/search_artifacts/`, {
        params: payload
      });
      setArtifacts(response.data);
    } catch (error) {
      console.error('Error searching artifacts:', error);
    }
  };

  return (
    <div>
      <div className={styles.search_container}>
        <h1>Search Artifacts</h1>
        <ArtifactSearchForm
          formData={formData}
          handleSubmit={handleSearch}
          artifactTypes={artifactTypes}
          mainStatsOptions={mainStatsOptions}
          filteredSubstats={filteredSubstats}
          scores={scores}
          sources={sources}
          artifactSets={artifactSets}
          handleSelectChange={handleSelectChange}
          handleInputChange={handleInputChange}
        />
      </div>
      <table className={styles.artifact_search_table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Set</th>
            <th>Type</th>
            <th>Main Stat</th>
            <th className={styles.center_checkbox}>Numb</th>
            <th className={styles.center_checkbox}>%ATK</th>
            <th className={styles.center_checkbox}>%HP</th>
            <th className={styles.center_checkbox}>%DEF</th>
            <th className={styles.center_checkbox}>ATK</th>
            <th className={styles.center_checkbox}>HP</th>
            <th className={styles.center_checkbox}>DEF</th>
            <th className={styles.center_checkbox}>PEN</th>
            <th className={styles.center_checkbox}>A.Proficiency</th>
            <th className={styles.center_checkbox}>C.Rate</th>
            <th className={styles.center_checkbox}>C.DMG</th>
            <th>Source</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {artifacts.map((artifact, index) => (
            <ArtifactListingForm key={index} artifact={artifact} onEditModalChange={handleEditModalChange} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchArtifacts;