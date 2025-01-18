// src/Pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Pages/HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homepage_container}>
      <h1>Welcome to Zenless Zone Zero Drive Discs</h1>
      <p>This application allows you to create and list drive discs for Zenless Zone Zero.</p>
      <div>
        <Link to="/artifactcreate" className={styles.button}>Create Drive Disc</Link>
        <Link to="/artifact-list" className={styles.button}>Drive Disc List</Link>
        <Link to="/search-artifacts" className={styles.button}>Search Drive Discs</Link>
        <Link to="/leveling-list" className={styles.button}>Drive Discs Leveling List</Link>
        <Link to="/statistics" className={styles.button}>Statistics</Link>
        <Link to="/substatistics" className={styles.button}>Substatistics</Link>
      </div>
    </div>
  );
};

export default HomePage;