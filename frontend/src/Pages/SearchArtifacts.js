// src/Pages/SearchArtifacts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArtifactSearchForm from '../Components/ArtifactSearchForm';
import ArtifactListingForm from '../Components/ArtifactListingForm';
import ReactPaginate from 'react-paginate';
import { apiConfig, artifactConfig } from '../config/config';
import styles from '../Styles/Pages/SearchArtifacts.module.css';

// Fixed items per page for search results
const ITEMS_PER_PAGE = 15;

const SearchArtifacts = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formData, setFormData] = useState({
    artifactSet: null,
    type: null,
    mainStat: null,
    substats: [],
    numberOfSubstats: "",
    score: null,
    source: null
  });
  const [artifacts, setArtifacts] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleDataRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Pagination effect
  useEffect(() => {
    const endOffset = itemOffset + ITEMS_PER_PAGE;
    setCurrentItems(artifacts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(artifacts.length / ITEMS_PER_PAGE));
  }, [artifacts, itemOffset]);

  // Reset pagination when search results change
  useEffect(() => {
    setItemOffset(0);
    setCurrentPage(0);
  }, [artifacts]);

  // Re-fetch artifacts when modal actions complete
  useEffect(() => {
    if (hasSearched && refreshTrigger > 0) {
      // Re-run the last search to get updated data
      const lastSearchData = sessionStorage.getItem('lastSearchData');
      if (lastSearchData) {
        const payload = JSON.parse(lastSearchData);
        performSearch(payload);
      }
    }
  }, [refreshTrigger, hasSearched]);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    const payload = {
      set: formData.artifactSet?.value || null,
      type: formData.type?.value || null,
      main_stat: formData.mainStat?.value || null,
      number_of_substats: formData.numberOfSubstats || null,
      atk_percent: formData.substats.includes("%ATK") ? 1 : null,
      hp_percent: formData.substats.includes("%HP") ? 1 : null,
      def_percent: formData.substats.includes("%DEF") ? 1 : null,
      atk: formData.substats.includes("ATK") ? 1 : null,
      hp: formData.substats.includes("HP") ? 1 : null,
      defense: formData.substats.includes("DEF") ? 1 : null,
      pen: formData.substats.includes("PEN") ? 1 : null,
      ap: formData.substats.includes("AP") ? 1 : null,
      crit_rate: formData.substats.includes("Crit Rate") ? 1 : null,
      crit_dmg: formData.substats.includes("Crit DMG") ? 1 : null,
      where_got_it: formData.source,
      score: formData.score,
    };

    // Store search data for refresh after edits
    sessionStorage.setItem('lastSearchData', JSON.stringify(payload));
    setHasSearched(true);
    
    await performSearch(payload);
  };

  const performSearch = async (payload) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiConfig.apiUrl}/search_artifacts/`, {
        params: payload
      });
      setArtifacts(response.data);
    } catch (error) {
      console.error('Error searching artifacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE) % artifacts.length;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
  };

  return (
    <div className={styles.search_artifacts_container}>
      <div className={styles.page_header}>
        <h1 className={styles.page_title}>Search Artifacts</h1>
        <p className={styles.page_subtitle}>
          Find artifacts by set, type, stats, and more
        </p>
      </div>
      
      <div className={styles.search_section}>
        <div className={styles.search_form_container}>
          <ArtifactSearchForm
            formData={formData}
            handleSubmit={handleSearch}
            artifactTypes={artifactTypes}
            mainStatsOptions={mainStatsOptions}
            filteredSubstats={filteredSubstats}
            scores={scores}
            sources={sources}
            artifactSets={artifactSets}
            handleSelectChange={handleSelectChange}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
          />
        </div>
      </div>

      {hasSearched && (
        <div className={styles.results_section}>
          <div className={styles.results_header}>
            <div className={styles.results_stats}>
              <div className={styles.stat_item}>
                <span className={styles.stat_number}>{artifacts.length}</span>
                <span className={styles.stat_label}>Total Results</span>
              </div>
              <div className={styles.stat_item}>
                <span className={styles.stat_number}>{currentItems.length}</span>
                <span className={styles.stat_label}>Showing</span>
              </div>
              {pageCount > 1 && (
                <div className={styles.stat_item}>
                  <span className={styles.stat_number}>{pageCount}</span>
                  <span className={styles.stat_label}>Pages</span>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loading_container}>
              <div className={styles.loading_spinner}></div>
              <p className={styles.loading_text}>Searching artifacts...</p>
            </div>
          ) : artifacts.length > 0 ? (
            <div className={styles.table_container}>
              <div className={styles.table_wrapper}>
                <table className={styles.artifact_search_table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Set</th>
                      <th>Type</th>
                      <th>Main Stat</th>
                      <th className={styles.center_checkbox}>Subs</th>
                      <th className={styles.center_checkbox}>⚔️ %ATK</th>
                      <th className={styles.center_checkbox}>❤️ %HP</th>
                      <th className={styles.center_checkbox}>🛡️ %DEF</th>
                      <th className={styles.center_checkbox}>⚡ ATK</th>
                      <th className={styles.center_checkbox}>💚 HP</th>
                      <th className={styles.center_checkbox}>🔰 DEF</th>
                      <th className={styles.center_checkbox}>🔋 PEN</th>
                      <th className={styles.center_checkbox}>🔮 A.Prof</th>
                      <th className={styles.center_checkbox}>🎯 Crit Rate</th>
                      <th className={styles.center_checkbox}>💥 Crit DMG</th>
                      <th>Source</th>
                      <th>Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((artifact, index) => (
                      <ArtifactListingForm 
                        key={artifact.id} 
                        artifact={artifact} 
                        onDataRefresh={handleDataRefresh} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              
              {pageCount > 1 && (
                <div className={styles.pagination_container}>
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next →"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    pageCount={pageCount}
                    previousLabel="← Previous"
                    pageClassName={styles.page_item}
                    pageLinkClassName={styles.page_link}
                    previousClassName={styles.page_item}
                    previousLinkClassName={styles.page_link}
                    nextClassName={styles.page_item}
                    nextLinkClassName={styles.page_link}
                    breakClassName={styles.page_item}
                    breakLinkClassName={styles.page_link}
                    containerClassName={styles.pagination}
                    activeClassName={styles.active}
                    disabledClassName={styles.disabled}
                    forcePage={currentPage}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.no_results}>
              <div className={styles.no_results_icon}>🔍</div>
              <h3 className={styles.no_results_title}>No artifacts found</h3>
              <p className={styles.no_results_text}>
                Try adjusting your search criteria or clearing some filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchArtifacts;