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
          emoji="⚒️"
        />
        <ToolCard
          title="Quests"
          description="Track and generate session quests and hooks."
          href="/tools/quests"
          emoji="🗺️"
        />
        <ToolCard
          title="Achievements"
          description="Manage PC achievements and milestones."
          href="/tools/achievements"
          emoji="🏆"
        />
        <ToolCard
          title="World Map"
          description="Visualize regions, pins, and lore locations."
          href="/tools/world-map"
          emoji="🗺️"
        />
        <ToolCard
          title="Character"
          description="Quick view and edit for characters."
          href="/tools/character"
          emoji="👤"
        />
        <ToolCard
          title="Wild Magic Table"
          description="Roll for wild magic effects and browse the full table."
          href="/tools/wild-magic"
          emoji="✨"
        />
        <ToolCard
          title="Magic Item Generator"
          description="Quickly generate Diablo‑2 inspired magic items with rarity, theme, and a weird toggle."
          href="/tools/magic-item"
          emoji="🪄"
        />
      </div>
    </div>
  );
}
