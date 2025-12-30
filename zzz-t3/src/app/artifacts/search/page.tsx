"use client";

import React, { useState } from "react";
import { api, type RouterInputs } from "~/trpc/react";
import { SearchForm } from "./SearchForm";
import { ArtifactRow } from "../recent_list/ArtifactRow";

type SearchFilters = Omit<RouterInputs["artifact"]["search"], "page" | "limit">;

export default function SearchPage() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = api.artifact.search.useQuery(
    { ...(searchFilters ?? {}), page, limit },
    {
      enabled: !!searchFilters, // Only run query when filters are set
      staleTime: 0,
    },
  );

  const handleSearch = (filters: SearchFilters | null) => {
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

  return (
    <div className="container mx-auto min-h-screen p-8 pt-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Search Artifacts</h1>
        <p className="mt-2 text-gray-400">
          Find artifacts by set, type, stats, and more
        </p>
      </div>

      <SearchForm onSearch={handleSearch} isLoading={isLoading && hasSearched} />

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
                    <th className="p-3">Type</th>
                    <th className="p-3">Main Stat</th>
                    <th className="p-3 text-center">Subs</th>
                    <th className="p-3 text-center">%ATK</th>
                    <th className="p-3 text-center">%HP</th>
                    <th className="p-3 text-center">%DEF</th>
                    <th className="p-3 text-center">ATK</th>
                    <th className="p-3 text-center">HP</th>
                    <th className="p-3 text-center">DEF</th>
                    <th className="p-3 text-center">ER</th>
                    <th className="p-3 text-center">EM</th>
                    <th className="p-3 text-center">Crit Rate</th>
                    <th className="p-3 text-center">Crit DMG</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={17}
                        className="p-8 text-center text-gray-400"
                      >
                        Searching...
                      </td>
                    </tr>
                  ) : data?.artifacts && data.artifacts.length > 0 ? (
                    data.artifacts.map((artifact) => (
                      <ArtifactRow
                        key={artifact.id}
                        artifact={artifact}
                        onRefresh={refetch}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={17}
                        className="p-8 text-center text-gray-400"
                      >
                        No artifacts found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  // Logic to show window of pages around current page
                  let p = page;
                  if (data.totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= data.totalPages - 2)
                    p = data.totalPages - 4 + i;
                  else p = page - 2 + i;

                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-yellow-600 text-white"
                          : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.totalPages}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
