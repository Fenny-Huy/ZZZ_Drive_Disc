'use client';

import React, { useState } from 'react';
import SetSourceSection from './SetSourceSection';
import ScoreSection from './ScoreSection';
import LevelingInvestmentSection from './LevelingInvestmentSection';

interface SubStatisticsContentProps {
  setData: any[];
  sourceData: any[];
  setSourceComboData: any[];
  scoreData: any[];
  scoreSetData: any[];
  scoreSourceData: any[];
  scoreSetSourceData: any[];
  levelingInvestmentData: any[];
}

type Tab = 'Set/Source' | 'Score' | 'Leveling Invest';

const SubStatisticsContent: React.FC<SubStatisticsContentProps> = ({
  setData,
  sourceData,
  setSourceComboData,
  scoreData,
  scoreSetData,
  scoreSourceData,
  scoreSetSourceData,
  levelingInvestmentData,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Set/Source');
  const [showGuide, setShowGuide] = useState(false);


  const renderContent = () => {
    switch (activeTab) {
      case 'Set/Source':
        return (
          <SetSourceSection
            setData={setData}
            sourceData={sourceData}
            setSourceComboData={setSourceComboData}
          />
        );
      case 'Score':
        return (
          <ScoreSection
            scoreData={scoreData}
            scoreSetData={scoreSetData}
            scoreSourceData={scoreSourceData}
            scoreSetSourceData={scoreSetSourceData}
          />
        );
      case 'Leveling Invest':
        return (
          <LevelingInvestmentSection 
            levelingInvestmentData={levelingInvestmentData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Guide Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 rounded-lg bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-blue-600/30 hover:text-blue-300 border border-blue-600/30"
        >
          <span>{showGuide ? 'Hide Guide' : 'Show Guide'}</span>
        </button>
      </div>

      {/* Guide Section */}
      {showGuide && (
        <div className="rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 border border-blue-800/50 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-semibold text-white">
            How to Use Analytics
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
              <h4 className="mb-2 font-semibold text-yellow-400">Set/Source</h4>
              <p className="text-sm text-gray-300">
                Analyze drive disc set and source counts and distributions. Click <strong>Set</strong>, <strong>Source</strong>, or both to view data. Use <strong>Specific</strong> for filtered views for a specific set.
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
              <h4 className="mb-2 font-semibold text-yellow-400">Score</h4>
              <p className="text-sm text-gray-300">
                View drive disc score distributions. Toggle <strong>Set</strong> or <strong>Source</strong> to analyze scores. Select both to view the overall score distribution. Use <strong>Specific</strong> to drill down by set and/or source.
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
              <h4 className="mb-2 font-semibold text-yellow-400">Leveling Invest</h4>
              <p className="text-sm text-gray-300">
                Track which drive disc sets you invested in leveling the most. Select <strong>Type</strong> to view by drive disc slot, or <strong>Set</strong> to analyze by drive disc set.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-green-900/20 p-3 border border-green-700/30">
            <p className="text-sm text-green-300">
              💡 <strong>Tip:</strong> Click multiple filter buttons to combine views and get more detailed insights!
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-6 rounded-xl bg-slate-900 p-6 shadow-lg border border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'Set/Source' },
            { id: 'Score' },
            { id: 'Leveling Invest' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/20'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{tab.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default SubStatisticsContent;
