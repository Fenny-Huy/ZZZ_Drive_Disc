// src/Components/ArtifactCreateForm.js
import React from 'react';
import Select from "react-select"; // Import React-Select
import styles from "../Styles/Components/ArtifactCreateForm.module.css";

const ArtifactCreateForm = ({ formData, handleSubmit, artifactTypes, mainStatsOptions, filteredSubstats, scores, sources, artifactSets, handleSelectChange, handleInputChange, isSubmitDisabled, isLoading }) => {
  
  // Substat icons/symbols mapping
  const substatIcons = {
    '%ATK': '⚔️',
    '%HP': '❤️',
    '%DEF': '🛡️',
    'ATK': '⚡',
    'HP': '💊',
    'DEF': '🏰',
    'PEN': '🔋',
    'AP': '🧪',
    'Crit Rate': '🎯',
    'Crit DMG': '💥'
  };

  // Calculate form completion progress
  const getFormProgress = () => {
    const steps = [
      { name: 'Artifact Set', completed: !!formData.artifactSet },
      { name: 'Artifact Type', completed: !!formData.type },
      { name: 'Main Stat', completed: !!formData.mainStat },
      { name: 'Number of Substats', completed: !!formData.numberOfSubstats },
      { name: 'Substats Selection', completed: formData.numberOfSubstats && formData.substats.length === parseInt(formData.numberOfSubstats, 10) },
      { name: 'Score', completed: !!formData.score },
      { name: 'Source', completed: !!formData.source }
    ];
    
    const completed = steps.filter(step => step.completed).length;
    const total = steps.length;
    const percentage = (completed / total) * 100;
    
    return { steps, completed, total, percentage };
  };

  const progress = getFormProgress();

  // Get substat selection feedback
  const getSubstatFeedback = () => {
    if (!formData.numberOfSubstats) return null;
    
    const requiredCount = parseInt(formData.numberOfSubstats, 10);
    const selectedCount = formData.substats.length;
    
    if (selectedCount === requiredCount) {
      return { type: 'success', message: `Perfect! You've selected ${selectedCount} substats.` };
    } else if (selectedCount > requiredCount) {
      return { type: 'warning', message: `Too many substats selected. You need ${requiredCount} but have ${selectedCount}.` };
    } else if (selectedCount > 0) {
      return { type: 'info', message: `Select ${requiredCount - selectedCount} more substat${requiredCount - selectedCount > 1 ? 's' : ''}.` };
    }
    
    return { type: 'info', message: `Select ${requiredCount} substats to continue.` };
  };

  const substatFeedback = getSubstatFeedback();

  return (
    <div className='artifact-create-form'>
      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <h3 className={styles.progressTitle}>Form Progress</h3>
          <span className={styles.progressText}>{progress.completed}/{progress.total} completed</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
        <div className={styles.progressDots}>
          {progress.steps.map((step, index) => (
            <div 
              key={index} 
              className={`${styles.progressDot} ${step.completed ? styles.completed : ''}`}
              title={step.name}
            >
              {step.completed && <span className={styles.checkmark}>✓</span>}
            </div>
          ))}
        </div>
      </div>

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
            <label className={styles.label}>Drive Disc Type:</label>
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
              placeholder={formData.type ? "Select or type to search" : "Select Drive Disc Type first"}
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
            <div className={styles.checkboxContainer}>
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
                  <span className={styles.substatIcon}>{substatIcons[substat] || '⭐'}</span>
                  <span className={styles.substatName}>{substat}</span>
                </label>
              ))}
            </div>
            {substatFeedback && (
              <div className={`${styles.substatFeedback} ${styles[substatFeedback.type]}`}>
                {substatFeedback.message}
              </div>
            )}
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