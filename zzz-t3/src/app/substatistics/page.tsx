import { api } from "~/trpc/server";
import { HydrateClient } from "~/trpc/server";
import SubStatisticsContent from "./_components/SubStatisticsContent";

export default async function SubStatisticsPage() {
  const setData = await api.substatistics.getSetData();
  const sourceData = await api.substatistics.getSourceData();
  const setSourceComboData = await api.substatistics.getSetSourceComboData();
  
  const scoreData = await api.substatistics.getScoreData();
  const scoreSetData = await api.substatistics.getScoreSetData();
  const scoreSourceData = await api.substatistics.getScoreSourceData();
  const scoreSetSourceData = await api.substatistics.getScoreSetSourceData();

  const levelingInvestmentData = await api.substatistics.getLevelingInvestmentData();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white">
        <div className="container flex flex-col gap-8 px-4 py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Analytics
            </h1>
            <p className="text-lg text-gray-400">
              Detailed breakdown of artifact sets, sources, scores, and leveling investments.
            </p>
          </div>

          <SubStatisticsContent
            setData={setData}
            sourceData={sourceData}
            setSourceComboData={setSourceComboData}
            scoreData={scoreData}
            scoreSetData={scoreSetData}
            scoreSourceData={scoreSourceData}
            scoreSetSourceData={scoreSetSourceData}
            levelingInvestmentData={levelingInvestmentData}
          />
        </div>
      </main>
    </HydrateClient>
  );
}
