import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../Styles/Components/LevelingChartTable.module.css';

const LevelingChartTable = ({ chartType, levelingChartData, levelingTableData, addedChartData, addedTableData }) => {
  const renderLevelingChart = () => {
    return (
      <div className={styles.chart_container}>
        <h2>Leveling Substat Distribution</h2>
        <div className={styles.bar_chart}>
          <Bar data={levelingChartData} />
        </div>
      </div>
    );
  };

  const renderLevelingTable = () => {
    return (
      <div className={styles.table_container}>
        <h2>Leveling Substat Counts</h2>
        <table>
          <thead>
            <tr>
              <th>Substat</th>
              <th>Appearance Percentage</th>
              <th>Roll Percentage</th>
              <th>Substat Count</th>
              <th>Roll Count</th>
            </tr>
          </thead>
          <tbody>
            {levelingTableData.map(item => (
              <tr key={item.substat}>
                <td>{item.substat}</td>
                <td>{item.appearancePercentage.toFixed(2)}%</td>
                <td>{item.rollPercentage.toFixed(2)}%</td>
                <td>{item.substatcount}</td>
                <td>{item.rollcount}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{levelingTableData.reduce((sum, item) => sum + item.appearancePercentage, 0).toFixed(2)}%</strong></td>
              <td><strong>{levelingTableData.reduce((sum, item) => sum + item.rollPercentage, 0).toFixed(2)}%</strong></td>
              <td><strong>{levelingTableData.reduce((sum, item) => sum + item.substatcount, 0)}</strong></td>
              <td><strong>{levelingTableData.reduce((sum, item) => sum + item.rollcount, 0)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderAddedChart = () => {
    if (chartType === 'pie') {
      return (
        <div className={styles.chart_container}>
          <h2>Added Substat Distribution</h2>
          <div className={styles.pie_chart}>
            <Pie data={addedChartData} />
          </div>
        </div>
      );
    } else if (chartType === 'bar') {
      return (
        <div className={styles.chart_container}>
          <h2>Added Substat Distribution</h2>
          <div className={styles.bar_chart}>
            <Bar data={addedChartData} />
          </div>
        </div>
      );
    }
  };

  const renderAddedTable = () => {
    return (
      <div className={styles.table_container}>
        <h2>Added Substat Counts</h2>
        <table>
          <thead>
            <tr>
              <th>Substat</th>
              <th>Percentage</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {addedTableData.map(item => (
              <tr key={item.substat}>
                <td>{item.substat}</td>
                <td>{item.percentage.toFixed(2)}%</td>
                <td>{item.count}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{addedTableData.reduce((sum, item) => sum + item.percentage, 0).toFixed(2)}%</strong></td>
              <td><strong>{addedTableData.reduce((sum, item) => sum + item.count, 0)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className={styles.substat_chart_table_container}>
        {renderLevelingChart()}
        {renderLevelingTable()}
      </div>
      <div className={styles.substat_chart_table_container}>
        {renderAddedChart()}
        {renderAddedTable()}
      </div>
    </>
  );
};

export default LevelingChartTable;
