// src/Pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Pages.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to Genshin Artifacts</h1>
      <p>This application allows you to create and list artifacts for Genshin Impact.</p>
      <div>
        <Link to="/artifactcreate" className="button">Create Artifact</Link>
        <Link to="/artifact-list" className="button">Artifact List</Link>
        <Link to="/search-artifacts" className="button">Search Artifacts</Link>
        <Link to="/leveling-list" className="button">Artifact Leveling List</Link>
        <Link to="/statistics" className="button">Statistics</Link>
      </div>
    </div>
  );
};

export default HomePage;