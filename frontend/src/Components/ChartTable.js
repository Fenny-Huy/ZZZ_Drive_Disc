import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../Styles/ChartTable.css'; // Import the CSS file for the component

const ChartTable = ({ chartType, chartData, tableData, chartTitle, tableTitle, tableFirstField }) => {
  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <div className="chart-container">
          <h2>{chartTitle}</h2>
          <div className="pie-chart">
            <Pie data={chartData} />
          </div>
        </div>
      );
    } else if (chartType === 'bar') {
      return (
        <div className="chart-container">
          <h2>{chartTitle}</h2>
          <div className="bar-chart">
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
      <div className="table-container">
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
    <div className="chart-table-container">
      {renderChart()}
      {renderTable()}
    </div>
  );
};

export default ChartTable;