// src/Components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Header.css'; // Import the CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">Home</Link>
      </div>
      <div className="header-right">
        <Link to="/artifactcreate">Create Artifact</Link>
        <Link to="/artifact-list">Artifact List</Link>
        <Link to="/search-artifacts">Search Artifacts</Link>
        <Link to="/leveling-list">Artifact Leveling List</Link>
        <Link to="/statistics">Statistics</Link>
      </div>
    </header>
  );
};

export default Header;