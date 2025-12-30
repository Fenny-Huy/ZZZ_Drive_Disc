"use client";

import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  type ChartData
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface TableRow {
  substat: string;
  count: number;
  percentage: number;
}

interface ChartTableProps {
  chartType: 'pie' | 'bar';
  chartData: ChartData<'pie' | 'bar', number[], string> | null | undefined;
  tableData: TableRow[] | null | undefined;
  chartTitle: string;
  tableTitle: string;
  tableFirstField: string;
  isLoading?: boolean;
}

export const ChartTable: React.FC<ChartTableProps> = ({
  chartType,
  chartData,
  tableData,
  chartTitle,
  tableTitle,
  tableFirstField,
  isLoading = false,
}) => {
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-xl bg-slate-800/50 text-gray-400">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-yellow-500"></div>
          <p>Loading chart data...</p>
        </div>
      );
    }

    if (!chartData?.labels?.length) {
      return (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-xl bg-slate-800/50 text-gray-400">
          <h3 className="text-lg font-medium text-white">No Data Available</h3>
          <p>No chart data to display</p>
        </div>
      );
    }

    if (chartType === 'pie') {
      return (
        <div className="relative h-[400px] w-full rounded-xl bg-slate-800/50 p-6">
          <Pie 
            data={chartData as ChartData<'pie', number[], string>} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    color: '#9ca3af', // text-gray-400
                    font: {
                      size: 12,
                      weight: 500
                    }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(103, 126, 234, 0.5)',
                  borderWidth: 1,
                  cornerRadius: 8,
                  displayColors: true,
                  padding: 12
                }
              }
            }}
          />
        </div>
      );
    } else if (chartType === 'bar') {
      return (
        <div className="relative h-[400px] w-full rounded-xl bg-slate-800/50 p-6">
          <Bar 
            data={chartData as ChartData<'bar', number[], string>}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(103, 126, 234, 0.5)',
                  borderWidth: 1,
                  cornerRadius: 8,
                  padding: 12
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(103, 126, 234, 0.1)'
                  },
                  ticks: {
                    color: '#9ca3af',
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
                    color: '#9ca3af',
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

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Chart Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-white">{chartTitle}</h3>
        {renderChart()}
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-white">{tableTitle}</h3>
        <div className="overflow-hidden rounded-xl bg-slate-800 shadow-lg border border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-xs uppercase text-gray-400">
                <tr>
                  <th className="p-4 font-semibold tracking-wider">{tableFirstField}</th>
                  <th className="p-4 text-right font-semibold tracking-wider">Count</th>
                  <th className="p-4 text-right font-semibold tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">
                      Loading data...
                    </td>
                  </tr>
                ) : !tableData || tableData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">
                      No data available
                    </td>
                  </tr>
                ) : (
                  tableData
                    .sort((a, b) => b.count - a.count)
                    .map((row, index) => (
                      <tr 
                        key={index}
                        className="transition-colors hover:bg-slate-700/30"
                      >
                        <td className="p-4 font-medium text-white">
                          {row.substat}
                        </td>
                        <td className="p-4 text-right text-gray-300 tabular-nums">
                          {row.count.toLocaleString()}
                        </td>
                        <td className="p-4 text-right font-medium text-yellow-500 tabular-nums">
                          {row.percentage.toFixed(2)}%
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
