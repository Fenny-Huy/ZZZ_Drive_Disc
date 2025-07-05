// src/Components/ArtifactSearchForm.js
import React from 'react';
import Select from "react-select"; // Import React-Select
import styles from '../Styles/Components/ArtifactSearchForm.module.css';
import { artifactConfig } from '../config/config';

const ArtifactSearchForm = ({ formData, handleSubmit, artifactTypes, mainStatsOptions, scores, sources, artifactSets, handleSelectChange, handleInputChange, isLoading }) => {
  // Define all substats
  const allSubstats = artifactConfig.allSubstats;

  // Substat icons mapping
  const substatIcons = {
    '%ATK': '⚔️',
    '%HP': '❤️',
    '%DEF': '🛡️',
    'ATK': '⚡',
    'HP': '💚',
    'DEF': '🔰',
    'PEN': '🔋',
    'AP': '🔮',
    'Crit Rate': '🎯',
    'Crit DMG': '💥'
  };

  const isSubmitDisabled = !(
    formData.artifactSet ||
    formData.type ||
    formData.mainStat ||
    formData.numberOfSubstats ||
    formData.substats.length > 0 ||
    formData.score ||
    formData.source
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Drive Disc Set:</label>
        <Select
          options={artifactSets.map((set) => ({ value: set, label: set }))}
          value={formData.artifactSet}
          onChange={(selected) => handleSelectChange(selected, "artifactSet")}
          placeholder="Select or type to search"
          className="react-select"
          isClearable
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Drive Disc Slot:</label>
        <Select
          options={artifactTypes}
          value={formData.type}
          onChange={(selected) => handleSelectChange(selected, "type")}
          placeholder="Select or type to search"
          className="react-select"
          isClearable
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Main Stat:</label>
        <Select
          options={Array.from(new Set(Object.values(mainStatsOptions).flat().map(stat => stat.value)))
            .map(value => ({ value, label: value }))}
          value={formData.mainStat}
          onChange={(selected) => handleSelectChange(selected, "mainStat")}
          placeholder="Select or type to search"
          className="react-select"
          isClearable
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Number of Substats:</label>
        <select
          name="numberOfSubstats"
          value={formData.numberOfSubstats}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">Select Number</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Substats:</label>
        <div className={styles.substats_grid}>
          {allSubstats.map((substat) => (
            <label key={substat} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="substats"
                value={substat}
                checked={formData.substats.includes(substat)}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              <span className={styles.checkbox_text}>
                <span className={styles.substat_icon}>{substatIcons[substat]}</span>
                {substat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Score:</label>
        <select name="score" value={formData.score} onChange={handleInputChange} className={styles.select}>
          <option value="">Select Score</option>
          {scores.map((score) => (
            <option key={score} value={score}>
              {score}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Where Got It:</label>
        <select name="source" value={formData.source} onChange={handleInputChange} className={styles.select}>
          <option value="">Select Source</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={styles.submitButton} disabled={isSubmitDisabled || isLoading}>
        {isLoading ? (
          <>
            <div className={styles.button_spinner}></div>
            Searching...
          </>
        ) : (
          <>
            <span className={styles.button_icon}>🔍</span>
            Search Artifacts
          </>
        )}
      </button>
    </form>
  );
};

export default ArtifactSearchForm;
