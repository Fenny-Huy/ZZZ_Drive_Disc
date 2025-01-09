// src/Components/ArtifactSearchForm.js
import React from 'react';
import Select from "react-select"; // Import React-Select
import '../Styles/ArtifactSearchForm.css';
import { artifactConfig } from '../config/config';


const ArtifactSearchForm = ({ formData, handleSubmit, artifactTypes, mainStatsOptions, scores, sources, artifactSets, handleSelectChange, handleInputChange }) => {
  // Define all substats
  const allSubstats = artifactConfig.allSubstats;



  const isSubmitDisabled = !(
    formData.artifactSet ||
    formData.type ||
    formData.mainStat ||
    formData.numberOfSubstats ||
    formData.substats.length > 0 ||
    formData.score ||
    formData.source
  );

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="inputGroup">
        <label className="label">Artifact Set:</label>
        <Select
          options={artifactSets.map((set) => ({ value: set, label: set }))}
          value={formData.artifactSet}
          onChange={(selected) => handleSelectChange(selected, "artifactSet")}
          placeholder="Select or type to search"
          className="react-select"
          isClearable
        />
      </div>

      <div className="inputGroup">
        <label className="label">Artifact Type:</label>
        <Select
          options={artifactTypes}
          value={formData.type}
          onChange={(selected) => handleSelectChange(selected, "type")}
          placeholder="Select or type to search"
          className="react-select"
          isClearable
        />
      </div>

      <div className="inputGroup">
        <label className="label">Main Stat:</label>
        <Select
          options={Object.values(mainStatsOptions).flat()}
          value={formData.mainStat}
          onChange={(selected) => handleSelectChange(selected, "mainStat")}
          placeholder="Select or type to search"
          className="react-select"
          isClearable
        />
      </div>

      <div className="inputGroup">
        <label className="label">Number of Substats:</label>
        <select
          name="numberOfSubstats"
          value={formData.numberOfSubstats}
          onChange={handleInputChange}
          className="select"
        >
          <option value="">Select Number</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      <div className="inputGroup">
        <label className="label">Substats:</label>
        <div>
          {allSubstats.map((substat) => (
            <label key={substat} className="checkboxLabel">
              <input
                type="checkbox"
                name="substats"
                value={substat}
                checked={formData.substats.includes(substat)}
                onChange={handleInputChange}
                className="checkbox"
              />
              {substat}
            </label>
          ))}
        </div>
      </div>

      <div className="inputGroup">
        <label className="label">Score:</label>
        <select name="score" value={formData.score} onChange={handleInputChange} className="select">
          <option value="">Select Score</option>
          {scores.map((score) => (
            <option key={score} value={score}>
              {score}
            </option>
          ))}
        </select>
      </div>

      <div className="inputGroup">
        <label className="label">Where Got It:</label>
        <select name="source" value={formData.source} onChange={handleInputChange} className="select">
          <option value="">Select Source</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="submitButton" disabled={isSubmitDisabled}>
        Search
      </button>
    </form>
  );
};

export default ArtifactSearchForm;