"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { api } from "~/trpc/react";
import { artifactConfig } from "~/lib/constants";
import { type RouterOutputs } from "~/trpc/react";

type Artifact = RouterOutputs["artifact"]["getAll"]["artifacts"][number];

interface LevelArtifactModalProps {
  artifact: Artifact;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

interface LevelingFormData {
  lHP: number;
  lATK: number;
  lDEF: number;
  lPercentHP: number;
  lPercentATK: number;
  lPercentDEF: number;
  lAP: number;
  lPEN: number;
  lCritRate: number;
  lCritDMG: number;
  addedSubstat: string;
}

export function LevelArtifactModal({
  artifact,
  onClose,
  onUpdateSuccess,
}: LevelArtifactModalProps) {
  const utils = api.useUtils();
  const updateLeveling = api.leveling.updateLeveling.useMutation({
    onSuccess: async () => {
      await utils.artifact.getAll.invalidate();
      onUpdateSuccess();
      onClose();
    },
  });

  const [formData, setFormData] = useState<LevelingFormData>({
    lHP: artifact.leveling?.lHP ?? 0,
    lATK: artifact.leveling?.lATK ?? 0,
    lDEF: artifact.leveling?.lDEF ?? 0,
    lPercentHP: artifact.leveling?.lPercentHP ?? 0,
    lPercentATK: artifact.leveling?.lPercentATK ?? 0,
    lPercentDEF: artifact.leveling?.lPercentDEF ?? 0,
    lAP: artifact.leveling?.lAP ?? 0,
    lPEN: artifact.leveling?.lPEN ?? 0,
    lCritRate: artifact.leveling?.lCritRate ?? 0,
    lCritDMG: artifact.leveling?.lCritDMG ?? 0,
    addedSubstat: artifact.leveling?.addedSubstat ?? "None",
  });

  const [initialSubstats, setInitialSubstats] = useState<string[]>([]);
  const [availableSubstats, setAvailableSubstats] = useState<string[]>([]);

  useEffect(() => {
    const substats: string[] = [];
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
    setInitialSubstats(substats);

    const available = artifactConfig.allSubstats.filter(
      (substat) => !substats.includes(substat) && substat !== artifact.mainStat,
    );
    setAvailableSubstats(available);
  }, [artifact]);

  const handleIncrement = (field: keyof LevelingFormData) => {
    if (field === "addedSubstat") return;
    const current = formData[field];
    if (current < 5) {
      setFormData((prev) => ({ ...prev, [field]: current + 1 }));
    }
  };

  const handleDecrement = (field: keyof LevelingFormData) => {
    if (field === "addedSubstat") return;
    const current = formData[field];
    if (current > 0) {
      setFormData((prev) => ({ ...prev, [field]: current - 1 }));
    }
  };

  const getFormDataKey = (substat: string): Exclude<keyof LevelingFormData, "addedSubstat"> => {
    switch (substat) {
      case "%HP": return "lPercentHP";
      case "%ATK": return "lPercentATK";
      case "%DEF": return "lPercentDEF";
      case "Crit Rate": return "lCritRate";
      case "Crit DMG": return "lCritDMG";
      case "ATK": return "lATK";
      case "HP": return "lHP";
      case "DEF": return "lDEF";
      case "PEN": return "lPEN";
      case "AP": return "lAP";
      default: return "lHP"; // Should not happen
    }
  };

  const getTotalLevels = () => {
    return Object.entries(formData).reduce((sum, [key, value]) => {
      if (key !== "addedSubstat" && typeof value === "number") {
        return sum + value;
      }
      return sum;
    }, 0);
  };

  const maxLevels = artifact.numberOfSubstat === 3 ? 4 : 5;
  const totalLevels = getTotalLevels();

  const getValidationMessage = () => {
    if (totalLevels === 0) {
      return { type: "info", message: "Enter the leveling values for your substats" };
    } else if (totalLevels > maxLevels) {
      return { type: "error", message: `Total levels exceed maximum (${totalLevels}/${maxLevels})` };
    } else if (totalLevels === maxLevels) {
      return { type: "success", message: `Perfect! All ${maxLevels} levels allocated` };
    } else {
      return { type: "warning", message: `${maxLevels - totalLevels} levels remaining to allocate` };
    }
  };

  const validation = getValidationMessage();

  const handleSave = () => {
    updateLeveling.mutate({
      id: artifact.id,
      ...formData,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-slate-900 p-6 shadow-2xl border border-slate-700">
        <h2 className="mb-4 text-2xl font-bold text-white">Artifact Leveling</h2>
        
        <div className="mb-6 flex gap-2">
          <span className="rounded bg-slate-800 px-2 py-1 text-sm text-gray-300 border border-slate-700">{artifact.set}</span>
          <span className="rounded bg-slate-800 px-2 py-1 text-sm text-gray-300 border border-slate-700">{artifact.type}</span>
          <span className="rounded bg-yellow-900/30 px-2 py-1 text-sm text-yellow-500 border border-yellow-900/50">{artifact.mainStat}</span>
        </div>

        <div className="space-y-6">
          {artifact.numberOfSubstat === 3 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Added Substat (at +4)
              </label>
              <select
                value={formData.addedSubstat}
                onChange={(e) => {
                  const newSubstat = e.target.value;
                  setFormData((prev) => {
                    const newState = { ...prev, addedSubstat: newSubstat };
                    if (prev.addedSubstat !== "None") {
                      const oldKey = getFormDataKey(prev.addedSubstat);
                      newState[oldKey] = 0;
                    }
                    return newState;
                  });
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-white focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="None">Select Substat</option>
                {availableSubstats.map((substat) => (
                  <option key={substat} value={substat}>
                    {substat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-4">
            {[...initialSubstats, ...(formData.addedSubstat !== "None" ? [formData.addedSubstat] : [])].map((substat) => {
              const key = getFormDataKey(substat);
              return (
                <div key={substat} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3 border border-slate-700/50">
                  <span className="font-medium text-gray-300">{substat}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrement(key)}
                      disabled={formData[key] <= 0}
                      className="flex h-8 w-8 items-center justify-center rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-lg font-bold text-white">{formData[key]}</span>
                    <button
                      onClick={() => handleIncrement(key)}
                      disabled={formData[key] >= 5}
                      className="flex h-8 w-8 items-center justify-center rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`rounded-lg p-3 text-center text-sm font-medium ${
            validation.type === 'error' ? 'bg-red-900/20 text-red-400 border border-red-900/50' :
            validation.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' :
            validation.type === 'warning' ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/50' :
            'bg-blue-900/20 text-blue-400 border border-blue-900/50'
          }`}>
            {validation.message}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={totalLevels > maxLevels || updateLeveling.isPending}
              className="rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLeveling.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
