import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../Styles/Components/ChartTable.module.css'; // Import the CSS file for the component

const ChartTable = ({ chartType, chartData, tableData, chartTitle, tableTitle, tableFirstField }) => {
  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <div className={styles.chart_container}>
          <h2>{chartTitle}</h2>
          <div className={styles.pie_chart}>
            <Pie data={chartData} />
          </div>
        </div>
      );
    } else if (chartType === 'bar') {
      return (
        <div className={styles.chart_container}>
          <h2>{chartTitle}</h2>
          <div className={styles.bar_chart}>
            <Bar data={chartData} />
          </div>
        </div>
      );
    }
  };

  const renderTable = () => {
    const totalPercentage = tableData.reduce((sum, item) => sum + item.percentage, 0);
    const totalCount = tableData.reduce((sum, item) => sum + item.count, 0);

    return (
      <div className={styles.table_container}>
        <h2>{tableTitle}</h2>
        <table>
          <thead>
            <tr>
              <th>{tableFirstField}</th>
              <th>Percentage</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(item => (
              <tr key={item.substat}>
                <td>{item.substat}</td>
                <td>{item.percentage.toFixed(2)}%</td>
                <td>{item.count}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{totalPercentage.toFixed(2)}%</strong></td>
              <td><strong>{totalCount}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.chart_table_container}>
      {renderChart()}
      {renderTable()}
    </div>
  );
};

export default ChartTable;
