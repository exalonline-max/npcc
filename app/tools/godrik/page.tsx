import GodrikClient from './GodrikClient';

export const metadata = { title: 'Godrik AI — Tools • NPC Chatter' };

export default function GodrikPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Godrik AI — Philosopher-Smith</h1>
      <p className="text-sm text-muted-foreground">Generate in-character lines with lore awareness. Backend supports Ollama (local) and OpenAI.</p>
      <GodrikClient />
    </div>
  );
}
