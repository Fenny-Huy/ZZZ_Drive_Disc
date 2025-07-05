// src/Components/ArtifactListingForm.js
import React, { useState, useEffect } from 'react';
import EditArtifactModal from './EditArtifactModal';
import AddArtifactLevelingModal from './AddArtifactLevelingModal';
import axios from 'axios';
import { apiConfig } from '../config/config';
import styles from '../Styles/Components/ArtifactListingForm.module.css';

const ArtifactListingForm = ({ artifact, onEditModalChange }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLevelingModalOpen, setIsLevelingModalOpen] = useState(false);
  const [artifactData, setArtifactData] = useState(null);
  const [artifactLevelingData, setArtifactLevelingData] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const [artifactLevelingIds, setArtifactLevelingIds] = useState([]);
  
  useEffect(() => {

    onEditModalChange(isEditModalOpen);

  }, [isEditModalOpen, onEditModalChange]);

  useEffect(() => {
    const fetchArtifactLevelingIds = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/artifactlevelingids`);
        setArtifactLevelingIds(response.data);
      } catch (error) {
        console.error("Error fetching artifact leveling IDs:", error);
      }
    };
  
    fetchArtifactLevelingIds();
  }, [isLevelingModalOpen]);

  const isArtifactInLeveling = artifactLevelingIds.includes(artifact.id);

  const renderCheckbox = (value) => (
    <div className={styles.checkbox_container}>
      <span className={`${styles.checkbox_icon} ${value === 1 ? styles.checked : ''}`}>
        {value === 1 ? '✓' : ''}
      </span>
    </div>
  );

  const handleUpdateSuccess = (message) => {
    setNotification(true);
    setNotificationMessage(message);
    setTimeout(() => setNotification(false), 2000); // Hide notification after 3 seconds
  };

  const openLevelingModal = async () => {
    try {
      const artifactResponse = await axios.get(`${apiConfig.apiUrl}/artifact/${artifact.id}`);
      setArtifactData(artifactResponse.data);
      const levelingResponse = await axios.get(`${apiConfig.apiUrl}/artifactleveling/${artifact.id}`);
      setArtifactLevelingData(levelingResponse.data);
      setIsLevelingModalOpen(true);
    } catch (error) {
      console.error('Error fetching artifact data:', error);
    }
  };

  return (
    <>
      <tr className={styles.artifact_row}>
        <td>{artifact.id}</td>
        <td>{artifact.set}</td>
        <td>{artifact.type}</td>
        <td>{artifact.main_stat}</td>
        <td className={styles.center_checkbox}>{artifact.number_of_substats}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.atk_percent)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.hp_percent)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.def_percent)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.atk)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.hp)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.defense)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.pen)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.ap)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.crit_rate)}</td>
        <td className={styles.center_checkbox}>{renderCheckbox(artifact.crit_dmg)}</td>
        <td>{artifact.where_got_it}</td>
        <td>{artifact.score}</td>
        <td className={styles.actions_cell}>
          <div className={styles.action_buttons}>
            {isArtifactInLeveling ? (
              <button className={styles.change_button} onClick={openLevelingModal}>
                <span className={styles.button_icon}>🔄</span>
                Change
              </button>
            ) : (
              <>
                <button className={styles.edit_button} onClick={() => setIsEditModalOpen(true)}>
                  <span className={styles.button_icon}>✏️</span>
                  Edit
                </button>
                <button className={styles.add_button} onClick={openLevelingModal}>
                  <span className={styles.button_icon}>➕</span>
                  Level
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      {isEditModalOpen && (
        <EditArtifactModal
          artifact={artifact}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={() => handleUpdateSuccess('Artifact updated successfully!')}
        />
      )}
      {isLevelingModalOpen && artifactData && (
        <AddArtifactLevelingModal
          artifact={artifactData}
          artifactLeveling={artifactLevelingData}
          onClose={() => setIsLevelingModalOpen(false)}
          onUpdateSuccess={() => handleUpdateSuccess('Artifact leveling added or updated successfully!')}
        />
      )}
      {notification && <div className={styles.notification}>{notificationMessage}</div>}
    </>
  );
};

export default ArtifactListingForm;