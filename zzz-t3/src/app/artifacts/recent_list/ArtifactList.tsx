"use client";

import React from "react";
import { api } from "~/trpc/react";
import { ArtifactRow } from "./ArtifactRow";

export function ArtifactList() {
  const { data, isLoading, refetch } = api.artifact.getAll.useQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-white">
        Loading drive discs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between rounded-xl bg-slate-900 p-6 shadow-lg border border-slate-800">
        <div>
          <div className="text-2xl font-bold text-white">{data?.totalCount ?? 0}</div>
          <div className="text-sm text-gray-400">Total Drive Discs</div>
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
                <th className="p-3 text-center">PEN</th>
                <th className="p-3 text-center">AP</th>
                <th className="p-3 text-center">Crit Rate</th>
                <th className="p-3 text-center">Crit DMG</th>
                <th className="p-3">Source</th>
                <th className="p-3">Score</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data?.artifacts.map((artifact) => (
                <ArtifactRow
                  key={artifact.id}
                  artifact={artifact}
                  onRefresh={refetch}
                />
              ))}
              {data?.artifacts.length === 0 && (
                <tr>
                  <td colSpan={17} className="p-8 text-center text-gray-400">
                    No drive discs found. Start by adding some!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
