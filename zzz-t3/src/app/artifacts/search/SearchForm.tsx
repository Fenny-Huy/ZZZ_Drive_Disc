"use client";

import React, { useState, useEffect } from "react";
import Select, { type StylesConfig, type SingleValue } from "react-select";
import { artifactConfig } from "~/lib/constants";
import { type RouterInputs } from "~/trpc/react";

type SearchFilters = Omit<RouterInputs["artifact"]["search"], "page" | "limit">;

interface SearchFormProps {
  onSearch: (filters: SearchFilters | null) => void;
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

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<{
    artifactSet: { value: string; label: string } | null;
    type: { value: string; label: string } | null;
    mainStat: { value: string; label: string } | null;
    numberOfSubstats: string;
    substats: string[];
    score: string;
    source: string;
  }>({
    artifactSet: null,
    type: null,
    mainStat: null,
    numberOfSubstats: "",
    substats: [],
    score: "",
    source: "",
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
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        substats: checked
          ? [...prev.substats, value]
          : prev.substats.filter((substat) => substat !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      artifactSet: null,
      type: null,
      mainStat: null,
      numberOfSubstats: "",
      substats: [],
      score: "",
      source: "",
    });
    onSearch(null); // Clear results
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      set: formData.artifactSet?.value ?? null,
      type: formData.type?.value ?? null,
      mainStat: formData.mainStat?.value ?? null,
      numberOfSubstats: formData.numberOfSubstats
        ? parseInt(formData.numberOfSubstats)
        : null,
      substats: formData.substats,
      score: formData.score !== "" ? formData.score : null,
      source: formData.source !== "" ? formData.source : null,
    });
  };

  const isSearchDisabled = !(
    formData.artifactSet !== null ||
    formData.type !== null ||
    formData.mainStat !== null ||
    formData.numberOfSubstats !== "" ||
    formData.substats.length > 0 ||
    formData.score !== "" ||
    formData.source !== ""
  );

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
            options={artifactConfig.artifactSets.map((set) => ({
              value: set,
              label: set,
            }))}
            value={formData.artifactSet}
            onChange={(val) => handleSelectChange(val, "artifactSet")}
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
            options={artifactConfig.artifactTypes}
            value={formData.type}
            onChange={(val) => handleSelectChange(val, "type")}
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
            options={allMainStats}
            value={formData.mainStat}
            onChange={(val) => handleSelectChange(val, "mainStat")}
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
          <select
            name="score"
            value={formData.score}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="">Any</option>
            {artifactConfig.scores.map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Source
          </label>
          <select
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="">Any</option>
            {artifactConfig.sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Substats */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Substats (Includes)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {artifactConfig.allSubstats.map((substat) => (
            <label
              key={substat}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-all ${
                formData.substats.includes(substat)
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                  : "border-slate-700 bg-slate-800 text-gray-400 hover:border-slate-600"
              }`}
            >
              <input
                type="checkbox"
                name="substats"
                value={substat}
                checked={formData.substats.includes(substat)}
                onChange={handleInputChange}
                className="hidden"
              />
              <span className="text-sm font-medium">{substat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-600 px-6 py-2.5 font-medium text-gray-300 hover:bg-slate-800 hover:text-white"
        >
          Clear Filters
        </button>
        <button
          type="submit"
          disabled={isLoading || isSearchDisabled}
          className="rounded-lg bg-yellow-600 px-8 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-yellow-500 hover:shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Search Artifacts"}
        </button>
      </div>
    </form>
  );
}
