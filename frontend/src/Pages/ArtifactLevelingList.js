// src/Pages/ArtifactLevelingList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArtifactLevelingListTable from '../Components/ArtifactLevelingListTable';
import EditArtifactLevelingModal from '../Components/EditArtifactLevelingModal';
import { apiConfig } from '../config/config';
import '../Styles/Pages.css';


const ArtifactLevelingList = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/artifactlevelinglist/`);
        setArtifacts(response.data);
      } catch (error) {
        console.error('Error fetching artifacts:', error);
      }
    };

    fetchArtifacts();
  }, [isEditModalOpen]);

  const handleEdit = (artifact) => {
    setSelectedArtifact(artifact);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    // Optionally, you can refetch the data to update the list
    // fetchArtifacts();
  };

  return (
    <div className="artifact-leveling-list">
      <h1>Artifact Leveling List</h1>
      <ArtifactLevelingListTable artifacts={artifacts} onEdit={handleEdit} />
      {isEditModalOpen && selectedArtifact && (
        <EditArtifactLevelingModal
          artifact={selectedArtifact}
          artifactLeveling={selectedArtifact}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ArtifactLevelingList;