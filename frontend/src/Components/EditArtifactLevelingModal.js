// src/Components/EditArtifactLevelingModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiConfig } from '../config/config';
import styles from '../Styles/Components/EditArtifactLevelingModal.module.css'; // Import the CSS file

const EditArtifactLevelingModal = ({ artifact, artifactLeveling, onClose, onUpdateSuccess }) => {
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

  const handleSave = async () => {
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

  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <h2>Edit Artifact Leveling</h2>
        <form className={styles.form}>
          {initialSubstats.map((substat) => (
            <div className={styles.inputGroup} key={substat}>
              <label className={styles.label}>{substat}:</label>
              <input
                type="number"
                name={getFormDataKey(substat)}
                value={formData[getFormDataKey(substat)]}
                onChange={handleInputChange}
                className={styles.input}
                min="0"
              />
            </div>
          ))}
          <div className={styles.modal_actions}>
            <button type="button" className={styles.button} onClick={handleSave} disabled={isSaveDisabled}>
              Save
            </button>
            <button type="button" className={styles.button} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArtifactLevelingModal;