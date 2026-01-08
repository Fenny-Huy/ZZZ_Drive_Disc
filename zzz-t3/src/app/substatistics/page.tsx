"use client";

import { api } from "~/trpc/react";
import SubStatisticsContent from "./_components/SubStatisticsContent";

export default function SubStatisticsPage() {
  // Data Fetching with loading states
  const { data: setData, isLoading: isLoadingSet } = api.substatistics.getSetData.useQuery();
  const { data: sourceData, isLoading: isLoadingSource } = api.substatistics.getSourceData.useQuery();
  const { data: setSourceComboData, isLoading: isLoadingSetSourceCombo } = api.substatistics.getSetSourceComboData.useQuery();
  
  const { data: scoreData, isLoading: isLoadingScore } = api.substatistics.getScoreData.useQuery();
  const { data: scoreSetData, isLoading: isLoadingScoreSet } = api.substatistics.getScoreSetData.useQuery();
  const { data: scoreSourceData, isLoading: isLoadingScoreSource } = api.substatistics.getScoreSourceData.useQuery();
  const { data: scoreSetSourceData, isLoading: isLoadingScoreSetSource } = api.substatistics.getScoreSetSourceData.useQuery();

  const { data: levelingInvestmentData, isLoading: isLoadingLevelingInvestment } = api.substatistics.getLevelingInvestmentData.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white">
      <div className="container flex flex-col gap-8 px-4 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Analytics
          </h1>
          <p className="text-lg text-gray-400">
            Detailed breakdown of drive disc sets, sources, scores, and leveling investments.
          </p>
        </div>

        <SubStatisticsContent
          setData={setData ?? []}
          sourceData={sourceData ?? []}
          setSourceComboData={setSourceComboData ?? []}
          scoreData={scoreData ?? []}
          scoreSetData={scoreSetData ?? []}
          scoreSourceData={scoreSourceData ?? []}
          scoreSetSourceData={scoreSetSourceData ?? []}
          levelingInvestmentData={levelingInvestmentData ?? []}
          isLoadingSet={isLoadingSet}
          isLoadingSource={isLoadingSource}
          isLoadingSetSourceCombo={isLoadingSetSourceCombo}
          isLoadingScore={isLoadingScore}
          isLoadingScoreSet={isLoadingScoreSet}
          isLoadingScoreSource={isLoadingScoreSource}
          isLoadingScoreSetSource={isLoadingScoreSetSource}
          isLoadingLevelingInvestment={isLoadingLevelingInvestment}
        />
      </div>
    </main>
  );
}
