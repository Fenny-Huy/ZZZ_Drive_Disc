
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

interface LevelingChartTableProps {
  chartType?: 'bar' | 'pie';
  levelingChartData: any;
  levelingTableData: any[];
  addedChartData: any;
  addedTableData: any[];
}

const LevelingChartTable: React.FC<LevelingChartTableProps> = ({
  chartType = 'bar',
  levelingChartData,
  levelingTableData,
  addedChartData,
  addedTableData,
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
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

  const renderLevelingChart = () => {
    if (!levelingChartData || !levelingTableData || levelingTableData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-slate-800 h-[400px]">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">Leveling Substat Distribution</h2>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <h3 className="text-lg font-semibold mb-2 text-white">No Data Available</h3>
            <p>No leveling data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-6 bg-slate-800/50 rounded-xl border border-slate-800 min-h-[500px]">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">Leveling Substat Distribution</h2>
        </div>
        <div className="flex-1 relative min-h-0">
          <Bar data={levelingChartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  const renderLevelingTable = () => {
    if (!levelingTableData || levelingTableData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-slate-800 h-[400px]">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">Leveling Substat Counts</h2>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <h3 className="text-lg font-semibold mb-2 text-white">No Data Available</h3>
            <p>No leveling data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-6 bg-slate-800/50 rounded-xl border border-slate-800 min-h-[500px]">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">Leveling Substat Counts</h2>
        </div>
        <div className="flex-1">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-900/50 sticky top-0">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Substat</th>
                <th className="px-4 py-3 text-right">Appearance %</th>
                <th className="px-4 py-3 text-right">Roll %</th>
                <th className="px-4 py-3 text-right">Count</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Roll Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {levelingTableData.map((item) => (
                <tr key={item.substat} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{item.substat}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.appearancePercentage.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.rollPercentage.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.substatcount}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.rollcount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900/50 font-semibold text-white">
              <tr>
                <td className="px-4 py-3 rounded-bl-lg">Total</td>
                <td className="px-4 py-3 text-right tabular-nums">{levelingTableData.reduce((sum, item) => sum + item.appearancePercentage, 0).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right tabular-nums">{levelingTableData.reduce((sum, item) => sum + item.rollPercentage, 0).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right tabular-nums">{levelingTableData.reduce((sum, item) => sum + item.substatcount, 0)}</td>
                <td className="px-4 py-3 rounded-br-lg text-right tabular-nums">{levelingTableData.reduce((sum, item) => sum + item.rollcount, 0)}</td>
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
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-slate-800 h-[400px]">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">Added Substat Distribution</h2>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <h3 className="text-lg font-semibold mb-2 text-white">No Data Available</h3>
            <p>No added substat data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-6 bg-slate-800/50 rounded-xl border border-slate-800 min-h-[500px]">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">Added Substat Distribution</h2>
        </div>
        <div className="flex-1 relative min-h-0 flex justify-center">
          {chartType === 'pie' ? (
            <div className="w-3/4 h-full">
              <Pie data={addedChartData} options={chartOptions} />
            </div>
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
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-slate-800 h-[400px]">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">Added Substat Counts</h2>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <h3 className="text-lg font-semibold mb-2 text-white">No Data Available</h3>
            <p>No added substat data to display for the selected filters.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-6 bg-slate-800/50 rounded-xl border border-slate-800 min-h-[500px]">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">Added Substat Counts</h2>
        </div>
        <div className="flex-1">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-900/50 sticky top-0">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Substat</th>
                <th className="px-4 py-3 text-right">Percentage</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {addedTableData.map((item) => (
                <tr key={item.substat} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{item.substat}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.percentage.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.count}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900/50 font-semibold text-white">
              <tr>
                <td className="px-4 py-3 rounded-bl-lg">Total</td>
                <td className="px-4 py-3 text-right tabular-nums">{addedTableData.reduce((sum, item) => sum + item.percentage, 0).toFixed(2)}%</td>
                <td className="px-4 py-3 rounded-br-lg text-right tabular-nums">{addedTableData.reduce((sum, item) => sum + item.count, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderLevelingChart()}
        {renderLevelingTable()}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderAddedChart()}
        {renderAddedTable()}
      </div>
    </div>
  );
};

export default LevelingChartTable;
