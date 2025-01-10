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
        <Link to="/artifactcreate">Create Drive Disc</Link>
        <Link to="/artifact-list">Drive Disc List</Link>
        <Link to="/search-artifacts">Search Drive Discs</Link>
        <Link to="/leveling-list">Drive Disc Leveling List</Link>
        <Link to="/statistics">Statistics</Link>
      </div>
    </header>
  );
};

export default Header;