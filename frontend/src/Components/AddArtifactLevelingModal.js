// src/Components/AddArtifactLevelingModal.js
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import styles from '../Styles/Components/AddArtifactLevelingModal.module.css'; // Import the CSS file
import { apiConfig, artifactConfig } from '../config/config';

const AddArtifactLevelingModal = ({ artifact, artifactLeveling, onClose, onUpdateSuccess }) => {
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

  const [availableSubstats, setAvailableSubstats] = useState([]);
  const [initialSubstats, setInitialSubstats] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const substats = [];
    if (artifact.atk_percent) substats.push('%ATK');
    if (artifact.hp_percent) substats.push('%HP');
    if (artifact.def_percent) substats.push('%DEF');
    if (artifact.atk) substats.push('ATK');
    if (artifact.hp) substats.push('HP');
    if (artifact.defense) substats.push('DEF');
    if (artifact.pen) substats.push('PEN');
    if (artifact.ap) substats.push('AP');
    if (artifact.crit_rate) substats.push('Crit Rate');
    if (artifact.crit_dmg) substats.push('Crit DMG');
    setInitialSubstats(substats);

    const allSubstats = artifactConfig.allSubstats;
    const available = allSubstats.filter(substat => !substats.includes(substat) && substat !== artifact.main_stat);
    setAvailableSubstats(available);

    if (artifactLeveling) {
      setFormData(artifactLeveling);
      setIsUpdating(true);
    }
  }, [artifact, artifactLeveling]);

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

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateForm();
  };

  const validateForm = () => {
    const totalValue = Object.keys(formData).reduce((sum, key) => {
      if (key.startsWith('L_')) {
        return sum + formData[key];
      }
      return sum;
    }, 0);

    const maxTotalValue = artifact.number_of_substats === 3 ? 4 : 5;
    setIsSaveDisabled(totalValue > maxTotalValue);
  };

  const getValidationMessage = () => {
    const totalValue = Object.keys(formData).reduce((sum, key) => {
      if (key.startsWith('L_')) {
        return sum + formData[key];
      }
      return sum;
    }, 0);

    const maxTotalValue = artifact.number_of_substats === 3 ? 4 : 5;
    
    if (totalValue === 0) {
      return { type: 'info', message: 'Enter the leveling values for your substats' };
    } else if (totalValue > maxTotalValue) {
      return { type: 'error', message: `Total levels exceed maximum (${totalValue}/${maxTotalValue})` };
    } else if (totalValue === maxTotalValue) {
      return { type: 'success', message: `Perfect! All ${maxTotalValue} levels allocated` };
    } else {
      return { type: 'warning', message: `${maxTotalValue - totalValue} levels remaining to allocate` };
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
      console.error('Error adding or updating artifact leveling:', error);
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

  return createPortal(
    <div className={styles.leveling_modal}>
      <div className={styles.leveling_modal_content}>
        <h2>{isUpdating ? 'Update' : 'Add'} Artifact Leveling</h2>

        <div className={styles.artifact_info}>
          <span className={styles.artifact_badge}>{artifact.set}</span>
          <span className={styles.artifact_badge}>{artifact.type}</span>
          <span className={styles.artifact_badge}>{artifact.main_stat}</span>
        </div>

        <form className={styles.form}>
          {artifact.number_of_substats === 3 && (!formData.addedSubstat || formData.addedSubstat === "None") && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Added Substat:</label>
              <select
                name="addedSubstat"
                value={formData.addedSubstat}
                onChange={handleSelectChange}
                className={styles.select}
              >
                <option value="">Select Substat</option>
                {availableSubstats.map((substat) => (
                  <option key={substat} value={substat}>
                    {substat}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.substat_grid}>
            {(initialSubstats.concat(formData.addedSubstat && formData.addedSubstat !== "None" ? formData.addedSubstat : []).filter(Boolean)).map((substat) => (
              <div className={styles.inputGroup} key={substat}>
                <label className={styles.label}>{substat}:</label>
                <input
                  type="number"
                  name={getFormDataKey(substat)}
                  value={formData[getFormDataKey(substat)]}
                  onChange={handleInputChange}
                  className={styles.input}
                  min="0"
                  max="5"
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          {/* Validation Message */}
          <div className={`${styles.validation_message} ${styles[getValidationMessage().type]}`}>
            {getValidationMessage().message}
          </div>


          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={handleSave} disabled={isSaveDisabled || isLoading}>
              {isLoading ? "Loading..." : "Save"}
            </button>
            <button type="button" className={styles.button} onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddArtifactLevelingModal;