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
      {/* Controls */}
      <div className="flex flex-col gap-6 rounded-xl bg-slate-900 p-6 shadow-lg border border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'Set/Source', label: 'Set/Source' },
            { id: 'Score', label: 'Score' },
            { id: 'Leveling Invest', label: 'Leveling Invest' },
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
              <span>{tab.label}</span>
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
