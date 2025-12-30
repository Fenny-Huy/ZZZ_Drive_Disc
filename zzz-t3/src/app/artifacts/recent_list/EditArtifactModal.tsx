"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Select, { type StylesConfig, type SingleValue } from "react-select";
import { api } from "~/trpc/react";
import { artifactConfig } from "~/lib/constants";
import { type RouterOutputs } from "~/trpc/react";

type Artifact = RouterOutputs["artifact"]["getAll"]["artifacts"][number];

interface EditArtifactModalProps {
  artifact: Artifact;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

interface Option {
  value: string | null;
  label: string | null;
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

export function EditArtifactModal({
  artifact,
  onClose,
  onUpdateSuccess,
}: EditArtifactModalProps) {
  const utils = api.useUtils();
  const updateArtifact = api.artifact.update.useMutation({
    onSuccess: async () => {
      await utils.artifact.getAll.invalidate();
      onUpdateSuccess();
      onClose();
    },
  });

  // Helper to reconstruct substats array from artifact fields
  const getInitialSubstats = () => {
    const substats = [];
    if (artifact.percentATK) substats.push("%ATK");
    if (artifact.percentHP) substats.push("%HP");
    if (artifact.percentDEF) substats.push("%DEF");
    if (artifact.atk) substats.push("ATK");
    if (artifact.hp) substats.push("HP");
    if (artifact.def) substats.push("DEF");
    if (artifact.pen) substats.push("PEN");
    if (artifact.ap) substats.push("AP");
    if (artifact.critRate) substats.push("Crit Rate");
    if (artifact.critDMG) substats.push("Crit DMG");
    return substats;
  };

  const [formData, setFormData] = useState<{
    artifactSet: { value: string | null; label: string | null } | null;
    type: { value: string | null; label: string | null } | null;
    mainStat: { value: string | null; label: string | null } | null;
    numberOfSubstats: string;
    substats: string[];
    score: string;
    source: string;
  }>({
    artifactSet: { value: artifact.set, label: artifact.set },
    type: { value: artifact.type, label: artifact.type },
    mainStat: { value: artifact.mainStat, label: artifact.mainStat },
    numberOfSubstats: artifact.numberOfSubstat?.toString() ?? "3",
    substats: getInitialSubstats(),
    score: artifact.score ?? "",
    source: artifact.whereGotIt ?? "",
  });

  const handleSelectChange = (selectedOption: SingleValue<Option>, field: string) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [field]: selectedOption,
      };

      if (field === "type") {
        updatedFormData.mainStat = null;
        updatedFormData.substats = [];
        updatedFormData.numberOfSubstats = "";
      }

      if (field === "mainStat") {
        updatedFormData.substats = prev.substats.filter(
          (substat) => substat !== selectedOption?.value,
        );
      }

      return updatedFormData;
    });
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

  const handleSave = () => {
    if (!formData.artifactSet?.value || !formData.type?.value || !formData.mainStat?.value) return;

    updateArtifact.mutate({
      id: artifact.id,
      set: formData.artifactSet.value,
      type: formData.type.value,
      mainStat: formData.mainStat.value,
      numberOfSubstats: parseInt(formData.numberOfSubstats),
      substats: formData.substats,
      score: formData.score,
      source: formData.source,
    });
  };

  const isSaveDisabled = !(
    formData.artifactSet &&
    formData.type &&
    formData.mainStat &&
    formData.numberOfSubstats &&
    formData.substats.length === parseInt(formData.numberOfSubstats, 10) &&
    formData.score &&
    formData.source
  );

  const filteredSubstats = artifactConfig.allSubstats.filter(
    (substat) => substat !== formData.mainStat?.value,
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-slate-900 p-6 shadow-2xl border border-slate-700">
        <h2 className="mb-6 text-2xl font-bold text-white">Edit Artifact</h2>
        
        <div className="space-y-4">
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
            />
          </div>

          {/* Main Stat */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Main Stat
            </label>
            <Select
              options={
                formData.type?.value
                  ? artifactConfig.mainStatsOptions[formData.type.value] ?? []
                  : []
              }
              value={formData.mainStat}
              onChange={(val) => handleSelectChange(val, "mainStat")}
              isDisabled={!formData.type}
              styles={customStyles}
              placeholder="Select Main Stat..."
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
              <option value="">Select Number</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          {/* Substats */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Substats
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredSubstats.map((substat) => (
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

          {/* Score & Source */}
          <div className="grid grid-cols-2 gap-4">
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
                <option value="">Select Score</option>
                {artifactConfig.scores.map((score) => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </div>
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
                <option value="">Select Source</option>
                {artifactConfig.sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaveDisabled || updateArtifact.isPending}
              className="rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateArtifact.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
