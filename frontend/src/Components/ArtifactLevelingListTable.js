// src/Components/ArtifactLevelingListTable.js

import React, { useEffect, useState } from 'react';
import '../Styles/ArtifactLevelingListTable.css'; // Import the CSS file
import ReactPaginate from 'react-paginate';

const ArtifactLevelingListTable = ({ artifacts, onEdit }) => {
  const getSubstatKey = (substat) => {
    switch (substat) {
      case '%HP':
        return 'L_HP_per';
      case '%ATK':
        return 'L_ATK_per';
      case '%DEF':
        return 'L_DEF_per';
      case 'Crit Rate':
        return 'L_CritRate';
      case 'Crit DMG':
        return 'L_CritDMG';
      default:
        return `L_${substat}`;
    }
  };

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 11;

  // Invoke when user click to request another page.

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

  const renderSubstatCell = (artifact, substat) => {
    const substatKey = getSubstatKey(substat);
    const initialSubstats = [
      artifact.atk_percent && '%ATK',
      artifact.hp_percent && '%HP',
      artifact.def_percent && '%DEF',
      artifact.atk && 'ATK',
      artifact.hp && 'HP',
      artifact.defense && 'DEF',
      artifact.er && 'ER',
      artifact.em && 'EM',
      artifact.crit_rate && 'Crit Rate',
      artifact.crit_dmg && 'Crit DMG',
      artifact.addedSubstat,
    ].filter(Boolean);

    if (initialSubstats.includes(substat)) {
      return artifact[substatKey];
    } else {
      return <span className="unavailable-substat">X</span>;
    }
  };

  return (
    <>

    
    <table className="artifact-listing-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Set</th>
          <th>Type</th>
          <th>Main Stat</th>
          <th>Initial Substats</th>
          <th>Added</th>
          <th>HP</th>
          <th>ATK</th>
          <th>DEF</th>
          <th>%HP</th>
          <th>%ATK</th>
          <th>%DEF</th>
          <th>EM</th>
          <th>ER</th>
          <th>C.Rate</th>
          <th>C.DMG</th>
          <th>Source</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((artifact) => (
          <tr key={artifact.id}>
            <td>{artifact.id}</td>
            <td>{artifact.set}</td>
            <td>{artifact.type}</td>
            <td>{artifact.main_stat}</td>
            <td>
              {[
                artifact.atk_percent && '%ATK',
                artifact.hp_percent && '%HP',
                artifact.def_percent && '%DEF',
                artifact.atk && 'ATK',
                artifact.hp && 'HP',
                artifact.defense && 'DEF',
                artifact.er && 'ER',
                artifact.em && 'EM',
                artifact.crit_rate && 'Crit Rate',
                artifact.crit_dmg && 'Crit DMG',
              ]
                .filter(Boolean)
                .join(', ')}
            </td>
            <td>{artifact.addedSubstat}</td>
            <td>{renderSubstatCell(artifact, 'HP')}</td>
            <td>{renderSubstatCell(artifact, 'ATK')}</td>
            <td>{renderSubstatCell(artifact, 'DEF')}</td>
            <td>{renderSubstatCell(artifact, '%HP')}</td>
            <td>{renderSubstatCell(artifact, '%ATK')}</td>
            <td>{renderSubstatCell(artifact, '%DEF')}</td>
            <td>{renderSubstatCell(artifact, 'EM')}</td>
            <td>{renderSubstatCell(artifact, 'ER')}</td>
            <td>{renderSubstatCell(artifact, 'Crit Rate')}</td>
            <td>{renderSubstatCell(artifact, 'Crit DMG')}</td>
            <td>{artifact.where_got_it}</td>
            <td>{artifact.score}</td>
            <td>
              <button onClick={() => onEdit(artifact)}>Edit</button>
            </td>
          </tr>
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
    
    </>
  );
};

export default ArtifactLevelingListTable;