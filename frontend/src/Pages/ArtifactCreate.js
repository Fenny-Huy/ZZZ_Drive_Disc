import React, { useState } from "react";

import axios from "axios";
import ArtifactCreateForm from '../Components/ArtifactCreateForm';
import { apiConfig, artifactConfig } from '../config/config';
import '../Styles/Pages.css';


const ArtifactCreate = () => {

      const initialFormData = {
        type: null, // Track selected artifact type
        mainStat: null, // Track selected main stat
        substats: [],
        numberOfSubstats: "",
        score: "",
        source: "",
        artifactSet: null, // Track selected artifact set
      };


      const [formData, setFormData] = useState(initialFormData);
    
      const artifactTypes = artifactConfig.artifactTypes;
    
      const mainStatsOptions = artifactConfig.mainStatsOptions;
    
      const allSubstats = artifactConfig.allSubstats;
      const filteredSubstats = allSubstats.filter((substat) => substat !== formData.mainStat?.value);
    
      const scores = artifactConfig.scores;
      const sources = artifactConfig.sources;
    
      const artifactSets = artifactConfig.artifactSets;
    
      const handleSelectChange = (selectedOption, field) => {
        setFormData((prev) => ({
          ...prev,
          [field]: selectedOption,
          ...(field === "type" && { mainStat: null, substats: [], numberOfSubstats: "" }),
          ...(field === "mainStat" && { substats: [] }),
        }));
      };
    
      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (type === "checkbox") {
          setFormData((prev) => ({
            ...prev,
            substats: checked
              ? [...prev.substats, value]
              : prev.substats.filter((substat) => substat !== value),
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      };
    
      
    
    
      const isSubmitDisabled = () => {
        const { type, mainStat, numberOfSubstats, substats, score, source, artifactSet } = formData;
        return (
          !type ||
          !mainStat ||
          !numberOfSubstats ||
          !score ||
          !source ||
          !artifactSet ||
          substats.length !== parseInt(numberOfSubstats, 10)
        );
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
          id: 1,
          set: formData.artifactSet.value,
          type: formData.type.value,
          main_stat: formData.mainStat.value,
          number_of_substats: parseInt(formData.numberOfSubstats, 10),
          atk_percent: formData.substats.includes("%ATK") ? 1 : 0,
          hp_percent: formData.substats.includes("%HP") ? 1 : 0,
          def_percent: formData.substats.includes("%DEF") ? 1 : 0,
          atk: formData.substats.includes("ATK") ? 1 : 0,
          hp: formData.substats.includes("HP") ? 1 : 0,
          defense: formData.substats.includes("DEF") ? 1 : 0,
          pen: formData.substats.includes("PEN") ? 1 : 0,
          ap: formData.substats.includes("AP") ? 1 : 0,
          crit_rate: formData.substats.includes("Crit Rate") ? 1 : 0,
          crit_dmg: formData.substats.includes("Crit DMG") ? 1 : 0,
          where_got_it: formData.source,
          score: formData.score,
        };
    
        try {
          const response = await axios.post(`${apiConfig.apiUrl}/genshinartifacts/`, payload);
          alert(response.data.message);
          setFormData(initialFormData); // Reset form data
        } catch (error) {
          console.error("Error creating artifact:", error);
          alert("Failed to create artifact. Check console for details.");
        }
      };

      return (
        <div className="artifact-create">
        
          <div className="artifact-create-container">
            <h1>Create Drive Disc</h1>
            <ArtifactCreateForm formData={formData} handleSubmit={handleSubmit} artifactTypes={artifactTypes} mainStatsOptions={mainStatsOptions} filteredSubstats={filteredSubstats} scores={scores} sources={sources} artifactSets={artifactSets} handleSelectChange={handleSelectChange} handleInputChange={handleInputChange} isSubmitDisabled={isSubmitDisabled} />
          </div>

        </div>
      );


};

export default ArtifactCreate;