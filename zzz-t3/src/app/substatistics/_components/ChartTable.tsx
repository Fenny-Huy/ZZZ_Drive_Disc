import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartTableProps {
  chartType?: 'bar' | 'pie';
  chartData: any;
  tableData: any[];
  chartTitle: string;
  tableTitle: string;
  tableFirstField?: string;
}

const ChartTable: React.FC<ChartTableProps> = ({
  chartType = 'bar',
  chartData,
  tableData,
  chartTitle,
  tableTitle,
  tableFirstField = 'Substat',
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: (chartType === 'pie' ? 'right' : 'bottom') as 'right' | 'bottom',
        labels: {
          padding: 20,
          color: '#9ca3af', // text-gray-400
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
        }
      },
    } : {},
  };

  const renderChart = () => {
    if (!chartData || !tableData || tableData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-slate-800 h-[400px]">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">{chartTitle}</h2>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <h3 className="text-lg font-semibold mb-2 text-white">No Data Available</h3>
            <p>No data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-6 bg-slate-800/50 rounded-xl border border-slate-800 min-h-[500px]">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">{chartTitle}</h2>
        </div>
        <div className="relative min-h-0 h-96 w-full">
          {chartType === 'pie' ? (
            <div className="w-full h-full mx-auto">
              <Pie data={chartData} options={chartOptions} />
            </div>
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (!tableData || tableData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-slate-800 h-[400px]">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">{tableTitle}</h2>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <h3 className="text-lg font-semibold mb-2 text-white">No Data Available</h3>
            <p>No data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-6 bg-slate-800/50 rounded-xl border border-slate-800 min-h-[500px]">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">{tableTitle}</h2>
        </div>
        <div className="flex-1">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-900/50 sticky top-0">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">{tableFirstField}</th>
                <th className="px-4 py-3 text-right">Percentage</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {tableData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{item.substat}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.percentage.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.count}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900/50 font-semibold text-white">
              <tr>
                <td className="px-4 py-3 rounded-bl-lg">Total</td>
                <td className="px-4 py-3 text-right tabular-nums">{tableData.reduce((sum, item) => sum + item.percentage, 0).toFixed(2)}%</td>
                <td className="px-4 py-3 rounded-br-lg text-right tabular-nums">{tableData.reduce((sum, item) => sum + item.count, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {renderChart()}
      {renderTable()}
    </div>
  );
};

export default ChartTable;
