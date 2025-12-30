import Link from "next/link";
import { auth } from "~/server/auth";

export async function NavBar() {
  const session = await auth();

  return (
    <nav className="bg-slate-900 p-4 text-white shadow-md">
      <div className="w-full px-8 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-yellow-500">
          Genshin Artifacts
        </Link>
        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link
                href="/artifacts/recent_list"
                className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-yellow-500 hover:shadow-yellow-500/20 active:scale-95"
              >
                My Artifacts
              </Link>              
              <Link
                href="/artifacts/search"
                className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-yellow-500 hover:shadow-yellow-500/20 active:scale-95"
              >
                Search Artifacts
              </Link>              
              <Link
                href="/artifacts/create"
                className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-yellow-500 hover:shadow-yellow-500/20 active:scale-95"
              >
                Add Artifact
              </Link>
              <Link
                href="/leveling/search"
                className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-yellow-500 hover:shadow-yellow-500/20 active:scale-95"
              >
                Search Leveling
              </Link>
              <Link
                href="/statistics"
                className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-yellow-500 hover:shadow-yellow-500/20 active:scale-95"
              >
                Statistics
              </Link>
              <Link
                href="/substatistics"
                className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-yellow-500 hover:shadow-yellow-500/20 active:scale-95"
              >
                Analytics
              </Link>
              <Link
                href="/api/auth/signout"
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
              >
                Sign Out
              </Link>
              <span className="text-sm text-gray-400">
                Welcome, {session.user?.name}
              </span>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-yellow-500 hover:shadow-yellow-500/20 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
