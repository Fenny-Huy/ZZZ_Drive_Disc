// src/Components/EditArtifactLevelingModal.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { apiConfig } from '../config/config';
import styles from '../Styles/Components/EditArtifactLevelingModal.module.css'; // Import the CSS file

const EditArtifactLevelingModal = ({ artifact, artifactLeveling, onClose, onUpdateSuccess }) => {
  // Substat icons mapping
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
  
  const [formData, setFormData] = useState({
    L_HP: 0,
    L_ATK: 0,
    L_DEF: 0,
    L_HP_per: 0,
    L_ATK_per: 0,
    L_DEF_per: 0,
    L_AP: 0,
    L_PEN: 0,
    L_CritRate: 0,
    L_CritDMG: 0,
    addedSubstat: 'None',
  });

  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');


  useEffect(() => {
    if (artifactLeveling) {
      setFormData(artifactLeveling);
    }
  }, [artifactLeveling]);

  useEffect(() => {
    validateForm();
    // eslint-disable-next-line
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Math.max(0, parseInt(value, 10) || 0); // Prevent negative numbers
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleIncrement = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name] + 1,
    }));
  };

  const handleDecrement = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Math.max(0, prev[name] - 1),
    }));
  };

  const validateForm = () => {
    const totalValue = Object.keys(formData).reduce((sum, key) => {
      if (key.startsWith('L_')) {
        return sum + formData[key];
      }
      return sum;
    }, 0);

    const maxTotalValue = artifact.number_of_substats === 3 ? 4 : 5;
    const isValid = totalValue <= maxTotalValue;
    setIsSaveDisabled(!isValid);
    
    if (!isValid) {
      setValidationMessage(`Total levels (${totalValue}) cannot exceed ${maxTotalValue} for ${artifact.number_of_substats === 3 ? '3' : '4'} substat artifacts.`);
    } else {
      setValidationMessage('');
    }
  };

  const handleSave = async () => {
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);

    const payload = {
      id: artifact.id,
      ...formData,
    };

    try {
      await axios.post(`${apiConfig.apiUrl}/artifactleveling/`, payload);
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating artifact leveling:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormDataKey = (substat) => {
    switch (substat) {
      case '%HP':
        return 'L_HP_per';
      case '%ATK':
        return 'L_ATK_per';
      case '%DEF':
        return 'L_DEF_per';
      case 'Crit Rate':
        return 'L_CritRate';
      case 'Crit DMG':
        return 'L_CritDMG';
      default:
        return `L_${substat}`;
    }
  };

  const initialSubstats = [
    artifact.atk_percent && '%ATK',
    artifact.hp_percent && '%HP',
    artifact.def_percent && '%DEF',
    artifact.atk && 'ATK',
    artifact.hp && 'HP',
    artifact.defense && 'DEF',
    artifact.pen && 'PEN',
    artifact.ap && 'AP',
    artifact.crit_rate && 'Crit Rate',
    artifact.crit_dmg && 'Crit DMG',
    artifact.addedSubstat !== 'None' && artifact.addedSubstat,
  ].filter(Boolean);

  const getTotalLevels = () => {
    return Object.keys(formData).reduce((sum, key) => {
      if (key.startsWith('L_')) {
        return sum + formData[key];
      }
      return sum;
    }, 0);
  };

  const getMaxTotalLevels = () => {
    return artifact.number_of_substats === 3 ? 4 : 5;
  };

  // Modal content
  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Artifact Leveling</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.artifactInfo}>
          <div className={styles.artifactBadge}>
            <span className={styles.artifactId}>ID: {artifact.id}</span>
            <span className={styles.artifactSet}>{artifact.set}</span>
            <span className={styles.artifactType}>{artifact.type}</span>
          </div>
          <div className={styles.artifactMainStat}>
            <span className={styles.mainStatLabel}>Main Stat:</span>
            <span className={styles.mainStatValue}>{artifact.main_stat}</span>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Total Levels Used:</span>
            <span className={styles.progressValue}>{getTotalLevels()}/{getMaxTotalLevels()}</span>
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ width: `${Math.min((getTotalLevels() / getMaxTotalLevels()) * 100, 100)}%` }}
            />
          </div>
        </div>

        {validationMessage && (
          <div className={styles.validationMessage}>
            ⚠️ {validationMessage}
          </div>
        )}

        <form className={styles.substatGrid}>
          {initialSubstats.map((substat) => (
            <div className={styles.substatRow} key={substat}>
              <div className={styles.substatLabel}>
                <span className={styles.substatIcon}>{substatIcons[substat]}</span>
                <span className={styles.substatName}>{substat}</span>
              </div>
              <div className={styles.substatControls}>
                <button
                  type="button"
                  className={styles.decrementButton}
                  onClick={() => handleDecrement(getFormDataKey(substat))}
                  disabled={formData[getFormDataKey(substat)] === 0}
                >
                  −
                </button>
                <input
                  type="number"
                  name={getFormDataKey(substat)}
                  value={formData[getFormDataKey(substat)]}
                  onChange={handleInputChange}
                  className={styles.substatInput}
                  min="0"
                  max="5"
                />
                <button
                  type="button"
                  className={styles.incrementButton}
                  onClick={() => handleIncrement(getFormDataKey(substat))}
                  disabled={getTotalLevels() >= getMaxTotalLevels()}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </form>

        <div className={styles.modalActions}>
          <button 
            type="button" 
            className={`${styles.saveButton} ${isSaveDisabled ? styles.disabled : ''}`}
            onClick={handleSave} 
            disabled={isSaveDisabled || isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={onClose} 
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default EditArtifactLevelingModal;