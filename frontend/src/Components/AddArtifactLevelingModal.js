// src/Components/AddArtifactLevelingModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/AddArtifactLevelingModal.css'; // Import the CSS file
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

  useEffect(() => {
    const substats = [];
    if (artifact.atk_percent) substats.push('%ATK');
    if (artifact.hp_percent) substats.push('%HP');
    if (artifact.def_percent) substats.push('%DEF');
    if (artifact.atk) substats.push('ATK');
    if (artifact.hp) substats.push('HP');
    if (artifact.defense) substats.push('DEF');
    if (artifact.pen) substats.push('PEN');
    if (artifact.em) substats.push('EM');
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
      console.error('Error adding or updating artifact leveling:', error);
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

  return (
    <div className="leveling-modal">
      <div className="leveling-modal-content">
        <h2>{isUpdating ? 'Update' : 'Add'} Artifact Leveling</h2>
        <form className="form">
          {artifact.number_of_substats === 3 && (!formData.addedSubstat || formData.addedSubstat === "None") && (
            <div className="inputGroup">
              <label className="label">Added Substat:</label>
              <select
                name="addedSubstat"
                value={formData.addedSubstat}
                onChange={handleSelectChange}
                className="select"
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
          {(initialSubstats.concat(formData.addedSubstat && formData.addedSubstat !== "None" ? formData.addedSubstat : []).filter(Boolean)).map((substat) => (
            <div className="inputGroup" key={substat}>
              <label className="label">{substat}:</label>
              <input
                type="number"
                name={getFormDataKey(substat)}
                value={formData[getFormDataKey(substat)]}
                onChange={handleInputChange}
                className="input"
                min="0"
              />
            </div>
          ))}
          <div className="actions">
            <button type="button" className="button" onClick={handleSave} disabled={isSaveDisabled}>
              Save
            </button>
            <button type="button" className="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArtifactLevelingModal;