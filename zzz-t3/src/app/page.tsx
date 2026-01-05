import Link from "next/link";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            ZZZ <span className="text-yellow-500">Drive Discs</span> Manager
          </h1>
          
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-2xl text-gray-300 max-w-2xl">
              Welcome to the ultimate tool for managing and optimizing your Zenless Zone Zero Drive Discs. 
              Track your rolls, calculate scores, and organize your inventory efficiently.
            </p>
            
            {!session && (
              <div className="mt-8">
                <p className="mb-4 text-lg text-gray-400">Sign in to start managing your collection</p>
                <Link
                  href="/api/auth/signin"
                  className="rounded-full bg-yellow-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-yellow-500 shadow-lg shadow-yellow-500/20"
                >
                  Sign in with Discord or Google
                </Link>
              </div>
            )}

            {session && (
               <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Link
                  href="/artifacts/create"
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-slate-800 p-6 border border-slate-700 transition-all hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-bold text-yellow-500">Add Drive Disc →</h3>
                  <div className="text-lg text-gray-300">
                    Record a new drive disc into your database.
                  </div>
                </Link>
                <Link
                  href="/artifacts/recent_list"
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-slate-800 p-6 border border-slate-700 transition-all hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-bold text-blue-400">View Collection →</h3>
                  <div className="text-lg text-gray-300">
                    Browse your recent drive discs and manage them.
                  </div>
                </Link>
                <Link
                  href="/artifacts/search"
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-slate-800 p-6 border border-slate-700 transition-all hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-bold text-green-400">Search Drive Discs →</h3>
                  <div className="text-lg text-gray-300">
                    Advanced search filters to find specific drive discs by stats, set, and score.
                  </div>
                </Link>
                <Link
                  href="/leveling/search"
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-slate-800 p-6 border border-slate-700 transition-all hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-bold text-purple-400">Search Leveling →</h3>
                  <div className="text-lg text-gray-300">
                    Find drive discs based on specific substat roll distributions and leveling history.
                  </div>
                </Link>
                <Link
                  href="/statistics"
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-slate-800 p-6 border border-slate-700 transition-all hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-bold text-pink-400">Statistics →</h3>
                  <div className="text-lg text-gray-300">
                    View comprehensive statistics and charts about your drive disc collection.
                  </div>
                </Link>
                <Link
                  href="/substatistics"
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-slate-800 p-6 border border-slate-700 transition-all hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-bold text-cyan-400">Analytics →</h3>
                  <div className="text-lg text-gray-300">
                    Detailed breakdown of drive disc sets, sources, scores, and leveling investment.
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
