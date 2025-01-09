// src/Components/ArtifactListingForm.js
import React, { useState, useEffect } from 'react';
import EditArtifactModal from './EditArtifactModal';
import AddArtifactLevelingModal from './AddArtifactLevelingModal';
import axios from 'axios';
import { apiConfig } from '../config/config';
import '../Styles/ArtifactListingForm.css';

const ArtifactListingForm = ({ artifact, onEditModalChange }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLevelingModalOpen, setIsLevelingModalOpen] = useState(false);
  const [artifactData, setArtifactData] = useState(null);
  const [artifactLevelingData, setArtifactLevelingData] = useState(null);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  useEffect(() => {

    onEditModalChange(isEditModalOpen);

  }, [isEditModalOpen, onEditModalChange]);

  const renderCheckbox = (value) => (
    <input type="checkbox" checked={value === 1} readOnly />
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
      <tr className="artifact-row">
        <td>{artifact.id}</td>
        <td>{artifact.set}</td>
        <td>{artifact.type}</td>
        <td>{artifact.main_stat}</td>
        <td>{artifact.number_of_substats}</td>
        <td>{renderCheckbox(artifact.atk_percent)}</td>
        <td>{renderCheckbox(artifact.hp_percent)}</td>
        <td>{renderCheckbox(artifact.def_percent)}</td>
        <td>{renderCheckbox(artifact.atk)}</td>
        <td>{renderCheckbox(artifact.hp)}</td>
        <td>{renderCheckbox(artifact.defense)}</td>
        <td>{renderCheckbox(artifact.pen)}</td>
        <td>{renderCheckbox(artifact.ap)}</td>
        <td>{renderCheckbox(artifact.crit_rate)}</td>
        <td>{renderCheckbox(artifact.crit_dmg)}</td>
        <td>{artifact.where_got_it}</td>
        <td>{artifact.score}</td>
        <td>
          <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
          <button onClick={openLevelingModal}>Add Leveling</button>
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
      {notification && <div className="notification">{notificationMessage}</div>}
    </>
  );
};

export default ArtifactListingForm;