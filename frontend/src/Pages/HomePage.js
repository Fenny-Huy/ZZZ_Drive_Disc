// src/Pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Pages.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to ZZZ Drive Discs</h1>
      <p>This application allows you to create and list drive discs for Zenless Zone Zero.</p>
      <div>
        <Link to="/artifactcreate" className="button">Create Drive Disc</Link>
        <Link to="/artifact-list" className="button">Drive Disc List</Link>
        <Link to="/search-artifacts" className="button">Search Drive Discs</Link>
        <Link to="/leveling-list" className="button">Drive Disc Leveling List</Link>
        <Link to="/statistics" className="button">Statistics</Link>
      </div>
    </div>
  );
};

export default HomePage;