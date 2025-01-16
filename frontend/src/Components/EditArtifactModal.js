import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import styles from '../Styles/Components/EditArtifactModal.module.css'; // Import the CSS file
import { apiConfig, artifactConfig } from '../config/config';

const EditArtifactModal = ({ artifact, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    artifactSet: { value: artifact.set, label: artifact.set },
    type: { value: artifact.type, label: artifact.type },
    mainStat: { value: artifact.main_stat, label: artifact.main_stat },
    numberOfSubstats: artifact.number_of_substats,
    substats: [
      artifact.atk_percent ? '%ATK' : null,
      artifact.hp_percent ? '%HP' : null,
      artifact.def_percent ? '%DEF' : null,
      artifact.atk ? 'ATK' : null,
      artifact.hp ? 'HP' : null,
      artifact.defense ? 'DEF' : null,
      artifact.pen ? 'PEN' : null,
      artifact.ap ? 'AP' : null,
      artifact.crit_rate ? 'Crit Rate' : null,
      artifact.crit_dmg ? 'Crit DMG' : null,
    ].filter(Boolean),
    score: artifact.score,
    source: artifact.where_got_it,
  });

  const artifactTypes = artifactConfig.artifactTypes;
  const mainStatsOptions = artifactConfig.mainStatsOptions;
  const allSubstats = artifactConfig.allSubstats;
  const scores = artifactConfig.scores;
  const sources = artifactConfig.sources;
  const artifactSets = artifactConfig.artifactSets;

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [field]: selectedOption,
      };

      if (field === 'type') {
        updatedFormData.mainStat = null;
        updatedFormData.substats = [];
        updatedFormData.numberOfSubstats = '';
      }

      if (field === 'mainStat') {
        updatedFormData.substats = prev.substats.filter((substat) => substat !== selectedOption.value);
      }

      return updatedFormData;
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
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

  const handleSave = async () => {
    const payload = {
      id: artifact.id,
      set: formData.artifactSet.value,
      type: formData.type.value,
      main_stat: formData.mainStat.value,
      number_of_substats: formData.numberOfSubstats,
      atk_percent: formData.substats.includes('%ATK') ? 1 : 0,
      hp_percent: formData.substats.includes('%HP') ? 1 : 0,
      def_percent: formData.substats.includes('%DEF') ? 1 : 0,
      atk: formData.substats.includes('ATK') ? 1 : 0,
      hp: formData.substats.includes('HP') ? 1 : 0,
      defense: formData.substats.includes('DEF') ? 1 : 0,
      pen: formData.substats.includes('PEN') ? 1 : 0,
      ap: formData.substats.includes('AP') ? 1 : 0,
      crit_rate: formData.substats.includes('Crit Rate') ? 1 : 0,
      crit_dmg: formData.substats.includes('Crit DMG') ? 1 : 0,
      where_got_it: formData.source,
      score: formData.score,
    };

    try {
      await axios.put(`${apiConfig.apiUrl}/genshinartifacts/${artifact.id}/`, payload);
      onUpdateSuccess(); // Call the callback function
      onClose();
    } catch (error) {
      console.error('Error updating artifact:', error);
    }
  };

  // Check if the save button should be disabled
  const isSaveDisabled = !(
    formData.artifactSet &&
    formData.type &&
    formData.mainStat &&
    formData.numberOfSubstats &&
    formData.substats.length === parseInt(formData.numberOfSubstats, 10) &&
    formData.score &&
    formData.source
  );

  // Filter substats based on the selected main stat
  const filteredSubstats = allSubstats.filter((substat) => substat !== formData.mainStat?.value);

  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <h2>Edit Artifact</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Drive Disc Set:</label>
            <Select
              options={artifactSets.map((set) => ({ value: set, label: set }))}
              value={formData.artifactSet}
              onChange={(selected) => handleSelectChange(selected, 'artifactSet')}
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
              onChange={(selected) => handleSelectChange(selected, 'type')}
              placeholder="Select or type to search"
              className="react-select"
              isClearable
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Main Stat:</label>
            <Select
              options={formData.type ? mainStatsOptions[formData.type.value] : []}
              value={formData.mainStat}
              onChange={(selected) => handleSelectChange(selected, 'mainStat')}
              placeholder={formData.type ? "Select or type to search" : "Select Artifact Type first"}
              isDisabled={!formData.type}
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

export default EditArtifactModal;
