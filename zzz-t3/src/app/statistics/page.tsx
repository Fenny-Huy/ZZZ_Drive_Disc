"use client";

import React, { useState } from 'react';
import Select, { type CSSObjectWithLabel } from 'react-select';
import { api } from "~/trpc/react";
import { MainStatSection } from './_components/MainStatSection';
import { SubstatSection } from './_components/SubstatSection';
import { LevelingSection } from './_components/LevelingSection';

const customStyles = {
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: "#1f2937", // bg-gray-800
    borderColor: "#374151", // border-gray-700
    color: "white",
    minHeight: "42px",
  }),
  menu: (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: "#1f2937",
    zIndex: 9999,
  }),
  option: (provided: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#374151" : "#1f2937",
    color: "white",
  }),
  singleValue: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "white",
  }),
  input: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "#9ca3af",
  }),
};

export default function StatisticsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Main Stat');
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  
  // Main Stat State
  const [selectedMainStatChart, setSelectedMainStatChart] = useState('Types');

  // Substat State
  const [selectedSubstatChart, setSelectedSubstatChart] = useState('Overall');

  // Data Fetching
  const { data: availableSets } = api.statistics.getAvailableSets.useQuery();
  
  const { data: mainStatData, isLoading: isLoadingMainStats } = api.statistics.getMainStats.useQuery(
    { set: selectedSet },
    { enabled: selectedCategory === 'Main Stat' }
  );

  const { data: substatData, isLoading: isLoadingSubstats } = api.statistics.getSubstats.useQuery(
    { set: selectedSet },
    { enabled: selectedCategory === 'Substats' }
  );

  // We also need mainStatData for the "Specific" tab in Substats section to populate dropdowns
  // So we should fetch it if we are in Substats section too
  const { data: mainStatDataForSubstats } = api.statistics.getMainStats.useQuery(
    { set: selectedSet },
    { enabled: selectedCategory === 'Substats' }
  );

  const { data: levelingData, isLoading: isLoadingLeveling } = api.statistics.getLevelingStats.useQuery(
    { set: selectedSet },
    { enabled: selectedCategory === 'Leveling' }
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Main Stat':
        return (
          <MainStatSection
            selectedChart={selectedMainStatChart}
            setSelectedChart={setSelectedMainStatChart}
            typeData={mainStatData?.typePercentages ?? []}
            mainStatData={mainStatData?.mainStatPercentages ?? []}
            isLoading={isLoadingMainStats}
          />
        );
      case 'Substats':
        return (
          <SubstatSection
            selectedSubstatChart={selectedSubstatChart}
            setSelectedSubstatChart={setSelectedSubstatChart}
            substatData={substatData ?? []}
            typeData={mainStatDataForSubstats?.typePercentages ?? []}
            mainStatData={mainStatDataForSubstats?.mainStatPercentages ?? []}
            isLoading={isLoadingSubstats}
          />
        );
      case 'Leveling':
        return (
          <LevelingSection
            levelingData={levelingData ?? []}
            isLoading={isLoadingLeveling}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 pt-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Artifact Statistics</h1>
          <p className="text-lg text-gray-400">Explore comprehensive data insights and patterns</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 rounded-xl bg-slate-900 p-6 shadow-lg border border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'Main Stat' },
              { id: 'Substats' },
              { id: 'Leveling' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/20'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                
                <span>{category.id}</span>
              </button>
            ))}
          </div>

          {/* Set Filter */}
          <div className="w-full lg:w-80">
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Filter by Artifact Set
            </label>
            <Select
              instanceId="set-select"
              options={availableSets?.map((set) => ({ value: set, label: set })) ?? []}
              value={selectedSet ? { value: selectedSet, label: selectedSet } : null}
              onChange={(option) => setSelectedSet(option?.value ?? null)}
              styles={customStyles}
              placeholder="All Sets"
              isClearable
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
