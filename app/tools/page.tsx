import { ToolCard } from './_components/ToolCard';

export default function ToolsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Tools</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ToolCard
          title="Godrik AI — Philosopher-Smith"
          description="Generate lore-aware, in-character lines for a 20 INT artificer."
          href="/tools/godrik"
        />
      </div>
    </div>
  );
}
