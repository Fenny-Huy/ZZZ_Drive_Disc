import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArtifactListingForm from '../Components/ArtifactListingForm';
import ReactPaginate from 'react-paginate';
import { apiConfig } from '../config/config';
import styles from '../Styles/Pages/ArtifactListing.module.css';

// Items per page options - modify this array to change available options
const ITEMS_PER_PAGE_OPTIONS = [12, 18, 24, 36, 50];

const ArtifactListing = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [artifacts, setArtifacts] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(18);
  const [currentPage, setCurrentPage] = useState(0);

  const handleDataRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setItemOffset(0);
    setCurrentPage(0);
  };


  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const response = await axios.get(`${apiConfig.apiUrl}/genshinartifacts/`); // Adjust the URL as needed
        setArtifacts(response.data);
      } catch (error) {
        console.error('Error fetching artifacts:', error);
      }
    };
    fetchArtifacts();
  }, [refreshTrigger]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(artifacts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(artifacts.length / itemsPerPage));
  }, [artifacts, itemOffset, itemsPerPage]);
  
  


  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % artifacts.length;
    setItemOffset(newOffset);
    setCurrentPage(event.selected);
  };
  

  return (
    <div className={styles.artifact_listing_container}>
      <div className={styles.page_header}>
        <h1 className={styles.page_title}>Drive Discs Collection</h1>
        <p className={styles.page_subtitle}>
          Manage and view your complete drive discs inventory
        </p>
        <div className={styles.stats_bar}>
          <div className={styles.stat_item}>
            <span className={styles.stat_number}>{artifacts.length}</span>
            <span className={styles.stat_label}>Total Drive Discs</span>
          </div>
          <div className={styles.stat_item}>
            <span className={styles.stat_number}>{currentItems.length}</span>
            <span className={styles.stat_label}>Showing</span>
          </div>
          <div className={styles.stat_item}>
            <span className={styles.stat_number}>{pageCount}</span>
            <span className={styles.stat_label}>Pages</span>
          </div>
        </div>
        
        <div className={styles.controls_bar}>
          <div className={styles.items_per_page}>
            <label className={styles.control_label}>Items per page:</label>
            <select 
              value={itemsPerPage} 
              onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
              className={styles.control_select}
            >
              {ITEMS_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className={styles.table_container}>
        <div className={styles.table_wrapper}>
          <table className={styles.artifact_listing_table}>
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
                <th className={styles.center_checkbox}>🔮 AP</th>
                <th className={styles.center_checkbox}>🎯 Crit Rate</th>
                <th className={styles.center_checkbox}>💥 Crit DMG</th>
                <th>Source</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((artifact, index) => (
                <ArtifactListingForm key={artifact.id} artifact={artifact} onDataRefresh={handleDataRefresh} />
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
    </div>
  );
};




export default ArtifactListing;