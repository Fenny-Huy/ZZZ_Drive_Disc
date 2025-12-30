"use client";

import React, { useState, useEffect } from "react";
import Select, { type StylesConfig, type SingleValue } from "react-select";
import { artifactConfig } from "~/lib/constants";
import { type RouterInputs } from "~/trpc/react";

type LevelingSearchFilters = Omit<RouterInputs["leveling"]["search"], "page" | "limit">;

interface LevelingSearchFormProps {
  onSearch: (filters: LevelingSearchFilters | null) => void;
  isLoading: boolean;
}

interface Option {
  value: string;
  label: string;
}

const customStyles: StylesConfig<Option, false> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#1f2937", // bg-gray-800
    borderColor: "#374151", // border-gray-700
    color: "white",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1f2937",
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#374151" : "#1f2937",
    color: "white",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
};

type LevelingKey = "lHP" | "lATK" | "lDEF" | "lPercentHP" | "lPercentATK" | "lPercentDEF" | "lEM" | "lER" | "lCritRate" | "lCritDMG";

export function LevelingSearchForm({ onSearch, isLoading }: LevelingSearchFormProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedSubstats, setSelectedSubstats] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    artifactSet: { value: string; label: string } | null;
    type: { value: string; label: string } | null;
    mainStat: { value: string; label: string } | null;
    numberOfSubstats: string;
    score: { value: string; label: string } | null;
    source: { value: string; label: string } | null;
    // Leveling stats
    lHP: string;
    lATK: string;
    lDEF: string;
    lPercentHP: string;
    lPercentATK: string;
    lPercentDEF: string;
    lEM: string;
    lER: string;
    lCritRate: string;
    lCritDMG: string;
  }>({
    artifactSet: null,
    type: null,
    mainStat: null,
    numberOfSubstats: "",
    score: null,
    source: null,
    lHP: "",
    lATK: "",
    lDEF: "",
    lPercentHP: "",
    lPercentATK: "",
    lPercentDEF: "",
    lEM: "",
    lER: "",
    lCritRate: "",
    lCritDMG: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSelectChange = (selectedOption: SingleValue<Option>, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getLevelingKey = (substat: string): LevelingKey => {
    switch (substat) {
      case "HP": return "lHP";
      case "ATK": return "lATK";
      case "DEF": return "lDEF";
      case "%HP": return "lPercentHP";
      case "%ATK": return "lPercentATK";
      case "%DEF": return "lPercentDEF";
      case "EM": return "lEM";
      case "ER": return "lER";
      case "Crit Rate": return "lCritRate";
      case "Crit DMG": return "lCritDMG";
      default: return "lHP";
    }
  };

  const handleSubstatToggle = (substat: string) => {
    setSelectedSubstats((prev) => {
      if (prev.includes(substat)) {
        // Remove it and clear the value
        const newState = prev.filter((s) => s !== substat);
        const key = getLevelingKey(substat);
        setFormData((f) => ({ ...f, [key]: "" }));
        return newState;
      } else {
        return [...prev, substat];
      }
    });
  };

  const handleReset = () => {
    setFormData({
      artifactSet: null,
      type: null,
      mainStat: null,
      numberOfSubstats: "",
      score: null,
      source: null,
      lHP: "",
      lATK: "",
      lDEF: "",
      lPercentHP: "",
      lPercentATK: "",
      lPercentDEF: "",
      lEM: "",
      lER: "",
      lCritRate: "",
      lCritDMG: "",
    });
    setSelectedSubstats([]);
    onSearch(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = {
      set: formData.artifactSet?.value ?? null,
      type: formData.type?.value ?? null,
      mainStat: formData.mainStat?.value ?? null,
      numberOfSubstats: formData.numberOfSubstats
        ? parseInt(formData.numberOfSubstats)
        : null,
      score: formData.score?.value ?? null,
      source: formData.source?.value ?? null,
      substats: selectedSubstats.length > 0 ? selectedSubstats : undefined,
      
      lHP: formData.lHP ? parseInt(formData.lHP) : null,
      lATK: formData.lATK ? parseInt(formData.lATK) : null,
      lDEF: formData.lDEF ? parseInt(formData.lDEF) : null,
      lPercentHP: formData.lPercentHP ? parseInt(formData.lPercentHP) : null,
      lPercentATK: formData.lPercentATK ? parseInt(formData.lPercentATK) : null,
      lPercentDEF: formData.lPercentDEF ? parseInt(formData.lPercentDEF) : null,
      lEM: formData.lEM ? parseInt(formData.lEM) : null,
      lER: formData.lER ? parseInt(formData.lER) : null,
      lCritRate: formData.lCritRate ? parseInt(formData.lCritRate) : null,
      lCritDMG: formData.lCritDMG ? parseInt(formData.lCritDMG) : null,
    };
    onSearch(filters);
  };

  const isFormEmpty =
    !formData.artifactSet &&
    !formData.type &&
    !formData.mainStat &&
    !formData.numberOfSubstats &&
    !formData.score &&
    !formData.source &&
    !formData.lHP &&
    !formData.lATK &&
    !formData.lDEF &&
    !formData.lPercentHP &&
    !formData.lPercentATK &&
    !formData.lPercentDEF &&
    !formData.lEM &&
    !formData.lER &&
    !formData.lCritRate &&
    !formData.lCritDMG &&
    selectedSubstats.length === 0;

  // Flatten main stats options for search (allow any main stat)
  const allMainStats = Array.from(
    new Set(
      Object.values(artifactConfig.mainStatsOptions)
        .flat()
        .map((opt) => opt.value),
    ),
  ).map((val) => ({ value: val, label: val }));

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl bg-slate-900 p-6 shadow-lg border border-slate-800"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Artifact Set */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Artifact Set
          </label>
          <Select
            instanceId="artifact-set-select"
            options={artifactConfig.artifactSets.map((set) => ({
              value: set,
              label: set,
            }))}
            value={formData.artifactSet}
            onChange={(option) => handleSelectChange(option, "artifactSet")}
            styles={customStyles}
            placeholder="Select Set..."
            isClearable
          />
        </div>

        {/* Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Type
          </label>
          <Select
            instanceId="type-select"
            options={artifactConfig.artifactTypes}
            value={formData.type}
            onChange={(option) => handleSelectChange(option, "type")}
            styles={customStyles}
            placeholder="Select Type..."
            isClearable
          />
        </div>

        {/* Main Stat */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Main Stat
          </label>
          <Select
            instanceId="main-stat-select"
            options={allMainStats}
            value={formData.mainStat}
            onChange={(option) => handleSelectChange(option, "mainStat")}
            styles={customStyles}
            placeholder="Select Main Stat..."
            isClearable
          />
        </div>

        {/* Number of Substats */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Number of Substats
          </label>
          <select
            name="numberOfSubstats"
            value={formData.numberOfSubstats}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="">Any</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        {/* Score */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Score
          </label>
          <Select
            instanceId="score-select"
            options={artifactConfig.scores.map((score) => ({
              value: score,
              label: score,
            }))}
            value={formData.score}
            onChange={(option) => handleSelectChange(option, "score")}
            styles={customStyles}
            placeholder="Select Score..."
            isClearable
          />
        </div>

        {/* Source */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Source
          </label>
          <Select
            instanceId="source-select"
            options={artifactConfig.sources.map((source) => ({
              value: source,
              label: source,
            }))}
            value={formData.source}
            onChange={(option) => handleSelectChange(option, "source")}
            styles={customStyles}
            placeholder="Select Source..."
            isClearable
          />
        </div>
      </div>

      {/* Leveling Stats Section */}
      <div className="mt-8 border-t border-slate-800 pt-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Leveling Stats (Exact Match)</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {artifactConfig.allSubstats.map((substat) => {
            const key = getLevelingKey(substat);
            const isSelected = selectedSubstats.includes(substat);
            
            return (
              <div 
                key={substat} 
                className={`relative flex flex-col gap-2 rounded-lg p-3 border border-slate-700/50 transition-colors cursor-pointer ${
                  isSelected ? 'bg-slate-800 border-slate-600' : 'bg-slate-800/50 hover:bg-slate-800'
                }`}
                onClick={() => handleSubstatToggle(substat)}
              >
                {isSelected && formData[key] !== "" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, [key]: "" }));
                    }}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-900/30 text-xs text-red-400 hover:bg-red-900/50"
                    title="Clear value"
                  >
                    ×
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`checkbox-${substat}`}
                    checked={isSelected}
                    onChange={() => handleSubstatToggle(substat)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-yellow-600 focus:ring-yellow-500 focus:ring-offset-slate-900"
                  />
                  <label 
                    htmlFor={`checkbox-${substat}`}
                    className={`text-sm font-medium cursor-pointer ${isSelected ? 'text-white' : 'text-gray-400'}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {substat}
                  </label>
                </div>
                
                {isSelected && (
                  <div 
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const current = formData[key];
                        if (current === "") {
                          setFormData((prev) => ({ ...prev, [key]: "0" }));
                        } else {
                          const num = parseInt(current);
                          if (num > 0) {
                            setFormData((prev) => ({ ...prev, [key]: (num - 1).toString() }));
                          }
                        }
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded bg-slate-700 text-white hover:bg-slate-600"
                    >
                      −
                    </button>
                    
                    <div className="flex-1 text-center text-sm font-medium text-white">
                      {formData[key] === "" ? (
                        <span className="text-gray-500">Any</span>
                      ) : (
                        formData[key]
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = formData[key];
                        if (current === "") {
                          setFormData((prev) => ({ ...prev, [key]: "0" }));
                        } else {
                          const num = parseInt(current);
                          if (num < 5) {
                            setFormData((prev) => ({ ...prev, [key]: (num + 1).toString() }));
                          }
                        }
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded bg-slate-700 text-white hover:bg-slate-600"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isLoading || isFormEmpty}
          className="rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
