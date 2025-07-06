// src/Components/ArtifactLevelingListTable.js

import React, { useEffect, useState } from 'react';
import styles from '../Styles/Components/ArtifactLevelingListTable.module.css'; // Import the CSS file
import ReactPaginate from 'react-paginate';

const ArtifactLevelingListTable = ({ artifacts, onEdit }) => {
  // Substat icons mapping
  const substatIcons = {
    '%ATK': '⚔️',
    '%HP': '❤️',
    '%DEF': '🛡️',
    'ATK': '⚡',
    'HP': '💊',
    'DEF': '🏰',
    'PEN': '🔋',
    'AP': '🧪',
    'Crit Rate': '🎯',
    'Crit DMG': '💥'
  };


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
  

  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Invoke when user click to request another page.

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(artifacts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(artifacts.length / itemsPerPage));
  }, [artifacts, itemOffset, itemsPerPage]);


  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % artifacts.length;
    setItemOffset(newOffset);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setItemOffset(0); // Reset to first page
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
      artifact.pen && 'PEN',
      artifact.ap && 'AP',
      artifact.crit_rate && 'Crit Rate',
      artifact.crit_dmg && 'Crit DMG',
      artifact.addedSubstat,
    ].filter(Boolean);

    if (initialSubstats.includes(substat)) {
      const value = artifact[substatKey] || 0;
      return value;
    } else {
      return <span className={styles.unavailableSubstat}>—</span>;
    }
  };

  const formatInitialSubstats = (artifact) => {
    const substats = [
      artifact.atk_percent && '%ATK',
      artifact.hp_percent && '%HP',
      artifact.def_percent && '%DEF',
      artifact.atk && 'ATK',
      artifact.hp && 'HP',
      artifact.defense && 'DEF',
      artifact.pen && 'PEN',
      artifact.ap && 'AP',
      artifact.crit_rate && 'Crit Rate',
      artifact.crit_dmg && 'Crit DMG',
    ].filter(Boolean);

    return substats.map(substat => `${substatIcons[substat]} ${substat}`).join(', ');
  };

  if (artifacts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <h3>No Artifacts Found</h3>
        <p>No artifacts with leveling data are available.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.tableControls}>
          <div className={styles.itemsPerPageContainer}>
            <label htmlFor="itemsPerPage" className={styles.itemsPerPageLabel}>
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className={styles.itemsPerPageSelect}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.artifactLevelingTable}>
          <thead>
            <tr>
              <th className={styles.idColumn}>🆔 ID</th>
              <th className={styles.setColumn}>🎯 Set</th>
              <th className={styles.typeColumn}>⭐ Type</th>
              <th className={styles.mainStatColumn}>🏆 Main Stat</th>
              <th className={styles.substatColumn}>📊 Initial Substats</th>
              <th className={styles.addedColumn}>➕ Added</th>
              <th className={styles.levelColumn}>💊 HP</th>
              <th className={styles.levelColumn}>⚡ ATK</th>
              <th className={styles.levelColumn}>🏰 DEF</th>
              <th className={styles.levelColumn}>❤️ %HP</th>
              <th className={styles.levelColumn}>⚔️ %ATK</th>
              <th className={styles.levelColumn}>🛡️ %DEF</th>
              <th className={styles.levelColumn}>🧪 AP</th>
              <th className={styles.levelColumn}>🔋 PEN</th>
              <th className={styles.levelColumn}>🎯 C.Rate</th>
              <th className={styles.levelColumn}>💥 C.DMG</th>
              <th className={styles.sourceColumn}>📍 Source</th>
              <th className={styles.scoreColumn}>⭐ Score</th>
              <th className={styles.actionColumn}>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((artifact) => (
              <tr key={artifact.id} className={styles.artifactRow}>
                <td className={styles.idCell}>{artifact.id}</td>
                <td className={styles.setCell}>{artifact.set}</td>
                <td className={styles.typeCell}>{artifact.type}</td>
                <td className={styles.mainStatCell}>{artifact.main_stat}</td>
                <td className={styles.substatCell}>
                  {formatInitialSubstats(artifact)}
                </td>
                <td className={styles.addedCell}>
                  {artifact.addedSubstat !== 'None' ? (
                    `${substatIcons[artifact.addedSubstat]} ${artifact.addedSubstat}`
                  ) : (
                    '—'
                  )}
                </td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, 'HP')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, 'ATK')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, 'DEF')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, '%HP')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, '%ATK')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, '%DEF')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, 'AP')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, 'PEN')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, 'Crit Rate')}</td>
                <td className={styles.levelCell}>{renderSubstatCell(artifact, 'Crit DMG')}</td>
                <td className={styles.sourceCell}>{artifact.where_got_it}</td>
                <td className={styles.scoreCell}>{artifact.score}</td>
                <td className={styles.actionCell}>
                  <button 
                    className={styles.editButton}
                    onClick={() => onEdit(artifact)}
                    title="Edit Artifact Leveling"
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationContainer}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next ›"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="‹ Previous"
          pageClassName={styles.pageItem}
          pageLinkClassName={styles.pageLink}
          previousClassName={styles.pageItem}
          previousLinkClassName={styles.pageLink}
          nextClassName={styles.pageItem}
          nextLinkClassName={styles.pageLink}
          breakClassName={styles.pageItem}
          breakLinkClassName={styles.pageLink}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
        />
      </div>
    </div>
  );
};

export default ArtifactLevelingListTable;