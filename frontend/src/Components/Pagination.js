// src/Components/Pagination.js
import React from 'react';

const Pagination = ({ artifactsPerPage, totalArtifacts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalArtifacts / artifactsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="!#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;