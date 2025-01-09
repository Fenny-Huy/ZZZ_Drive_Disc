// src/Pages/ArtifactList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArtifactListingForm from '../Components/ArtifactListingForm';
import ReactPaginate from 'react-paginate';
import { apiConfig } from '../config/config';
import '../Styles/Pages.css';



const ArtifactListing = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [artifacts, setArtifacts] = useState([]);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;

  // Invoke when user click to request another page.
  
  const handleEditModalChange = (isOpen) => {
    setIsEditModalOpen(isOpen);
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
  }, [isEditModalOpen]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(artifacts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(artifacts.length / itemsPerPage));
  }, [artifacts, itemOffset, itemsPerPage]);
  
  


  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % artifacts.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };
  

  return (
    <div>
      <h1>Artifact List</h1>
      <table className="artifact-listing-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Set</th>
            <th>Type</th>
            <th>Main Stat</th>
            <th>Subs Numb</th>
            <th>%ATK</th>
            <th>%HP</th>
            <th>%DEF</th>
            <th>ATK</th>
            <th>HP</th>
            <th>DEF</th>
            <th>PEN</th>
            <th>AP</th>
            <th>Crit Rate</th>
            <th>Crit DMG</th>
            <th>Source</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((artifact, index) => (
            <ArtifactListingForm key={index} artifact={artifact} onEditModalChange={handleEditModalChange} />
          ))}
        </tbody>
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        
      />
    </div>
  );
};




export default ArtifactListing;