// src/Pages/ArtifactLevelingList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArtifactLevelingListTable from '../Components/ArtifactLevelingListTable';
import EditArtifactLevelingModal from '../Components/EditArtifactLevelingModal';
import { apiConfig } from '../config/config';
import styles from '../Styles/Pages/ArtifactLevelingList.module.css';


const ArtifactLevelingList = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiConfig.apiUrl}/artifactlevelinglist/`);
        setArtifacts(response.data);
      } catch (error) {
        console.error('Error fetching artifacts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtifacts();
  }, []);

  const handleEdit = (artifact) => {
    setSelectedArtifact(artifact);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = async () => {
    setIsEditModalOpen(false);
    // Refresh the artifacts data without affecting pagination
    try {
      const response = await axios.get(`${apiConfig.apiUrl}/artifactlevelinglist/`);
      setArtifacts(response.data);
    } catch (error) {
      console.error('Error refreshing artifacts:', error);
    }
  };

  const getStats = () => {
    const totalArtifacts = artifacts.length;
    
    // Get most appeared set
    const setCount = {};
    artifacts.forEach(artifact => {
      setCount[artifact.set] = (setCount[artifact.set] || 0) + 1;
    });
    const mostAppearedSet = Object.keys(setCount).reduce((a, b) => 
      setCount[a] > setCount[b] ? a : b, 'None'
    );
    
    // Get most appeared type
    const typeCount = {};
    artifacts.forEach(artifact => {
      typeCount[artifact.type] = (typeCount[artifact.type] || 0) + 1;
    });
    const mostAppearedType = Object.keys(typeCount).reduce((a, b) => 
      typeCount[a] > typeCount[b] ? a : b, 'None'
    );
    
    return { 
      totalArtifacts, 
      mostAppearedSet: totalArtifacts > 0 ? mostAppearedSet : 'None', 
      mostAppearedType: totalArtifacts > 0 ? mostAppearedType : 'None' 
    };
  };

  const stats = getStats();

  return (
    <div className={styles.artifactLevelingList}>
      <h1 className={styles.pageTitle}>Drive Disc Leveling List</h1>
      <p className={styles.pageSubtitle}>
        Manage and track your drive disc leveling progress
      </p>
      
      <div className={styles.contentContainer}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalArtifacts}</div>
            <div className={styles.statLabel}>Total Drive Discs</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.mostAppearedSet}</div>
            <div className={styles.statLabel}>Most Appeared Set</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.mostAppearedType}</div>
            <div className={styles.statLabel}>Most Appeared Slot</div>
          </div>
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem', color: '#667eea' }}>
            Loading artifacts...
          </div>
        ) : (
          <ArtifactLevelingListTable artifacts={artifacts} onEdit={handleEdit} />
        )}
      </div>
      
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