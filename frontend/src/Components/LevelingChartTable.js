import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../Styles/Components/LevelingChartTable.module.css';

const LevelingChartTable = ({ chartType, levelingChartData, levelingTableData, addedChartData, addedTableData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    } : {}
  };

  const renderLevelingChart = () => {
    if (!levelingChartData || !levelingTableData || levelingTableData.length === 0) {
      return (
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h2>Leveling Substat Distribution</h2>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <h3>No Data Available</h3>
            <p>No leveling data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h2>Leveling Substat Distribution</h2>
        </div>
        <div className={styles.chartWrapper}>
          <Bar data={levelingChartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  const renderLevelingTable = () => {
    if (!levelingTableData || levelingTableData.length === 0) {
      return (
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2>Leveling Substat Counts</h2>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No Data Available</h3>
            <p>No leveling data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2>Leveling Substat Counts</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>⚡ Substat</th>
                <th>👁️ Appearance %</th>
                <th>🎲 Roll %</th>
                <th>📊 Substat Count</th>
                <th>🔄 Roll Count</th>
              </tr>
            </thead>
            <tbody>
              {levelingTableData.map(item => (
                <tr key={item.substat}>
                  <td className={styles.substatCell}>{item.substat}</td>
                  <td>{item.appearancePercentage.toFixed(2)}%</td>
                  <td>{item.rollPercentage.toFixed(2)}%</td>
                  <td>{item.substatcount}</td>
                  <td>{item.rollcount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td><strong>Total</strong></td>
                <td><strong>{levelingTableData.reduce((sum, item) => sum + item.appearancePercentage, 0).toFixed(2)}%</strong></td>
                <td><strong>{levelingTableData.reduce((sum, item) => sum + item.rollPercentage, 0).toFixed(2)}%</strong></td>
                <td><strong>{levelingTableData.reduce((sum, item) => sum + item.substatcount, 0)}</strong></td>
                <td><strong>{levelingTableData.reduce((sum, item) => sum + item.rollcount, 0)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderAddedChart = () => {
    if (!addedChartData || !addedTableData || addedTableData.length === 0) {
      return (
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h2>Added Substat Distribution</h2>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <h3>No Data Available</h3>
            <p>No added substat data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h2>Added Substat Distribution</h2>
        </div>
        <div className={styles.chartWrapper}>
          {chartType === 'pie' ? (
            <Pie data={addedChartData} options={chartOptions} />
          ) : (
            <Bar data={addedChartData} options={chartOptions} />
          )}
        </div>
      </div>
    );
  };

  const renderAddedTable = () => {
    if (!addedTableData || addedTableData.length === 0) {
      return (
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2>Added Substat Counts</h2>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No Data Available</h3>
            <p>No added substat data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2>Added Substat Counts</h2>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>⚡ Substat</th>
                <th>📊 Percentage</th>
                <th>🔢 Count</th>
              </tr>
            </thead>
            <tbody>
              {addedTableData.map(item => (
                <tr key={item.substat}>
                  <td className={styles.substatCell}>{item.substat}</td>
                  <td>{item.percentage.toFixed(2)}%</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td><strong>Total</strong></td>
                <td><strong>{addedTableData.reduce((sum, item) => sum + item.percentage, 0).toFixed(2)}%</strong></td>
                <td><strong>{addedTableData.reduce((sum, item) => sum + item.count, 0)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.levelingChartTableContainer}>
      <div className={styles.chartTableSection}>
        <div className={styles.chartTableRow}>
          {renderLevelingChart()}
          {renderLevelingTable()}
        </div>
      </div>
      <div className={styles.chartTableSection}>
        <div className={styles.chartTableRow}>
          {renderAddedChart()}
          {renderAddedTable()}
        </div>
      </div>
    </div>
  );
};

export default LevelingChartTable;
