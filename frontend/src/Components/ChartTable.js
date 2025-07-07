import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '../Styles/Components/ChartTable.module.css';

const ChartTable = ({ chartType, chartData, tableData, chartTitle, tableTitle, tableFirstField, isLoading = false }) => {
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading chart data...</p>
        </div>
      );
    }

    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h3>No Data Available</h3>
          <p>No chart data to display</p>
        </div>
      );
    }

    if (chartType === 'pie') {
      return (
        <div className={styles.pieChart}>
          <Pie 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                      size: 12,
                      weight: '500'
                    }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(103, 126, 234, 0.5)',
                  borderWidth: 1,
                  cornerRadius: 8,
                  displayColors: true
                }
              }
            }}
          />
        </div>
      );
    } else if (chartType === 'bar') {
      return (
        <div className={styles.barChart}>
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(103, 126, 234, 0.5)',
                  borderWidth: 1,
                  cornerRadius: 8
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(103, 126, 234, 0.1)'
                  },
                  ticks: {
                    color: '#6c757d',
                    font: {
                      size: 11
                    }
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: '#6c757d',
                    font: {
                      size: 11
                    }
                  }
                }
              }
            }}
          />
        </div>
      );
    }
  };

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading table data...</p>
        </div>
      );
    }

    if (!tableData || tableData.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>No Data Available</h3>
          <p>No table data to display</p>
        </div>
      );
    }

    const totalPercentage = tableData.reduce((sum, item) => sum + (item.percentage || 0), 0);
    const totalCount = tableData.reduce((sum, item) => sum + (item.count || 0), 0);

    return (
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>{tableFirstField || 'Item'}</th>
              <th>Percentage</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={item.substat || item.name || index}>
                <td>{item.substat || item.name || item.label}</td>
                <td>{(item.percentage || 0).toFixed(2)}%</td>
                <td>{item.count || 0}</td>
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
    <div className={styles.chartTableContainer}>
      <div className={styles.chartContainer}>
        <h2>{chartTitle || 'Chart'}</h2>
        {renderChart()}
      </div>
      <div className={styles.tableContainer}>
        <h2>{tableTitle || 'Data Table'}</h2>
        {renderTable()}
      </div>
    </div>
  );
};

export default ChartTable;
