"use client";

import React, { useState } from "react";
import { api, type RouterInputs, type RouterOutputs } from "~/trpc/react";
import { LevelingSearchForm } from "./LevelingSearchForm";
import { LevelArtifactModal } from "~/app/artifacts/recent_list/LevelArtifactModal";

type LevelingSearchFilters = Omit<RouterInputs["leveling"]["search"], "page" | "limit">;
type SearchResult = RouterOutputs["leveling"]["search"]["results"][number];
// Flatten the type to match what the UI expects (merging artifact and leveling properties)
type Artifact = SearchResult["artifact"] & { leveling: SearchResult["leveling"] };

export default function LevelingSearchPage() {
  const [searchFilters, setSearchFilters] = useState<LevelingSearchFilters | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const limit = 10;

  const { data, isLoading, refetch } = api.leveling.search.useQuery(
    { ...(searchFilters ?? {}), page, limit },
    {
      enabled: !!searchFilters,
      staleTime: 0,
    },
  );

  const handleSearch = (filters: LevelingSearchFilters | null) => {
    if (filters === null) {
      setSearchFilters(null);
      setHasSearched(false);
    } else {
      setSearchFilters(filters);
      setPage(1);
      setHasSearched(true);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderLevelValue = (value: number | null | undefined, isSubstatPresent: boolean) => {
    if (!isSubstatPresent) {
      return <span className="text-gray-600">—</span>;
    }
    return <span className="text-white font-medium">{value ?? 0}</span>;
  };

  // Helper to check if a substat is present on the artifact
  const isSubstatPresent = (artifact: SearchResult["artifact"], substat: string) => {
    switch (substat) {
      case "%ATK": return artifact.percentATK === 1;
      case "%HP": return artifact.percentHP === 1;
      case "%DEF": return artifact.percentDEF === 1;
      case "ATK": return artifact.atk === 1;
      case "HP": return artifact.hp === 1;
      case "DEF": return artifact.def === 1;
      case "PEN": return artifact.pen === 1;
      case "AP": return artifact.ap === 1;
      case "Crit Rate": return artifact.critRate === 1;
      case "Crit DMG": return artifact.critDMG === 1;
      default: return false;
    }
  };

  return (
    <div className="container mx-auto min-h-screen p-8 pt-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Search Leveling</h1>
        <p className="mt-2 text-gray-400">
          Find drive disc leveling records by stats and rolls
        </p>
      </div>

      <LevelingSearchForm onSearch={handleSearch} isLoading={isLoading && hasSearched} />

      {hasSearched && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900 p-6 shadow-lg border border-slate-800">
            <div>
              <div className="text-2xl font-bold text-white">
                {data?.totalCount ?? 0}
              </div>
              <div className="text-sm text-gray-400">Results Found</div>
            </div>
            <div className="text-sm text-gray-400">
              Page {page} of {data?.totalPages ?? 1}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl bg-slate-900 shadow-lg border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="p-3">Set</th>
                    <th className="p-3">Slot</th>
                    <th className="p-3">Main Stat</th>
                    <th className="p-3 text-center">Added</th>
                    <th className="p-3 text-center">HP</th>
                    <th className="p-3 text-center">ATK</th>
                    <th className="p-3 text-center">DEF</th>
                    <th className="p-3 text-center">%HP</th>
                    <th className="p-3 text-center">%ATK</th>
                    <th className="p-3 text-center">%DEF</th>
                    <th className="p-3 text-center">AP</th>
                    <th className="p-3 text-center">PEN</th>
                    <th className="p-3 text-center">C.Rate</th>
                    <th className="p-3 text-center">C.DMG</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={16}
                        className="p-8 text-center text-gray-400"
                      >
                        Searching...
                      </td>
                    </tr>
                  ) : data?.results && data.results.length > 0 ? (
                    data.results.map(({ artifact, leveling }) => (
                      <tr
                        key={artifact.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-3 font-medium text-white">{artifact.set}</td>
                        <td className="p-3 text-gray-300">{artifact.type}</td>
                        <td className="p-3 text-yellow-500 font-medium">{artifact.mainStat}</td>
                        <td className="p-3 text-center text-gray-300">
                          {leveling.addedSubstat !== "None" ? leveling.addedSubstat : "—"}
                        </td>
                        
                        {/* Leveling Values */}
                        <td className="p-3 text-center">{renderLevelValue(leveling.lHP, isSubstatPresent(artifact, "HP") || leveling.addedSubstat === "HP")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lATK, isSubstatPresent(artifact, "ATK") || leveling.addedSubstat === "ATK")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lDEF, isSubstatPresent(artifact, "DEF") || leveling.addedSubstat === "DEF")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lPercentHP, isSubstatPresent(artifact, "%HP") || leveling.addedSubstat === "%HP")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lPercentATK, isSubstatPresent(artifact, "%ATK") || leveling.addedSubstat === "%ATK")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lPercentDEF, isSubstatPresent(artifact, "%DEF") || leveling.addedSubstat === "%DEF")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lAP, isSubstatPresent(artifact, "AP") || leveling.addedSubstat === "AP")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lPEN, isSubstatPresent(artifact, "PEN") || leveling.addedSubstat === "PEN")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lCritRate, isSubstatPresent(artifact, "Crit Rate") || leveling.addedSubstat === "Crit Rate")}</td>
                        <td className="p-3 text-center">{renderLevelValue(leveling.lCritDMG, isSubstatPresent(artifact, "Crit DMG") || leveling.addedSubstat === "Crit DMG")}</td>

                        <td className="p-3 text-gray-300">{artifact.score}</td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedArtifact({ ...artifact, leveling })}
                            className="cursor-pointer rounded bg-yellow-600/20 px-3 py-1 text-xs font-medium text-yellow-500 hover:bg-yellow-600/30 transition-colors border border-yellow-600/30"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={16}
                        className="p-8 text-center text-gray-400"
                      >
                        No leveling records found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data?.totalPages && data.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-gray-400">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.totalPages}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {selectedArtifact && (
        <LevelArtifactModal
          artifact={selectedArtifact}
          onClose={() => setSelectedArtifact(null)}
          onUpdateSuccess={() => {
            void refetch();
          }}
        />
      )}
    </div>
  );
}
