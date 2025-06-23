// src/Components/ArtifactCreateForm.js
import React from 'react';
import Select from "react-select"; // Import React-Select
import styles from "../Styles/Components/ArtifactCreateForm.module.css";

const ArtifactCreateForm = ({ formData, handleSubmit, artifactTypes, mainStatsOptions, filteredSubstats, scores, sources, artifactSets, handleSelectChange, handleInputChange, isSubmitDisabled, isLoading }) => {
  return (
    <div className='artifact-create-form'>
      <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Drive Disc Set:</label>
            <Select
              options={artifactSets.map((set) => ({ value: set, label: set }))}
              value={formData.artifactSet}
              onChange={(selected) => handleSelectChange(selected, "artifactSet")}
              placeholder="Select or type to search"
              className="react-select"
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
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Main Stat:</label>
            <Select
              options={formData.type ? mainStatsOptions[formData.type.value] : []}
              value={formData.mainStat}
              onChange={(selected) => handleSelectChange(selected, "mainStat")}
              placeholder={formData.type ? "Select or type to search" : "Select Drive Disc Slot first"}
              isDisabled={!formData.type}
              className="react-select"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Number of Substats:</label>
            <select
              name="numberOfSubstats"
              value={formData.numberOfSubstats}
              onChange={handleInputChange}
              className={styles.select}
              disabled={!formData.mainStat}
            >
              <option value="">Select Number</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Substats:</label>
            <div>
              {filteredSubstats.map((substat) => (
                <label key={substat} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="substats"
                    value={substat}
                    checked={formData.substats.includes(substat)}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                    disabled={!formData.numberOfSubstats}
                  />
                  {substat}
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
            <label className={styles.label}>Where Get It:</label>
            <select name="source" value={formData.source} onChange={handleInputChange} className={styles.select}>
              <option value="">Select Source</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" disabled={isSubmitDisabled() || isLoading} className={styles.submitButton}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
      </form>
    </div>
  );
};

export default ArtifactCreateForm;