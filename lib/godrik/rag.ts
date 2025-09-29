import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';

type Entry = { id: string; tags: string[]; text: string };
let cache: Entry[] | null = null;

export function loadLore(): Entry[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), 'lib', 'godrik', 'lore.yaml');
  const doc = yaml.load(fs.readFileSync(p, 'utf-8')) as { entries: Entry[] };
  cache = doc?.entries || [];
  return cache;
}

export function getLoreSnippets(tags: string[], limit = 5): string[] {
  const set = new Set(tags.filter(Boolean));
  const entries = loadLore();
  const hits = entries.filter(e => e.tags.some(t => set.has(t))).map(e => e.text);
  return hits.slice(0, limit);
}
