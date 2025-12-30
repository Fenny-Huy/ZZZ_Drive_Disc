import { ArtifactList } from "./ArtifactList";

export default function ArtifactsPage() {
  return (
    <main className="min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Recent Artifacts</h1>
          <p className="text-gray-400">View your 10 most recently added artifacts</p>
        </div>
        <ArtifactList />
      </div>
    </main>
  );
}
