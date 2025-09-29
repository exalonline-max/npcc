import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import prisma from '../prisma';

export type Entry = { id: string; slug: string; tags: string[]; text: string; createdAt?: string };

const LORE_PATH = path.join(process.cwd(), 'lib', 'godrik', 'lore.yaml');

export async function loadLore(): Promise<Entry[]> {
  // load from db
  const rows = await prisma.loreEntry.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map((r: { id: string; slug: string; tags: string[]; text: string; createdAt: Date | null }) => ({ id: r.id, slug: r.slug, tags: r.tags as string[], text: r.text, createdAt: r.createdAt?.toISOString() }));
}

export async function getLoreSnippets(tags: string[], limit = 5): Promise<string[]> {
  const set = new Set(tags.filter(Boolean));
  const rows = await prisma.loreEntry.findMany({});
  const hits = rows.filter((e: { tags: string[] }) => e.tags.some((t: string) => set.has(t))).map((e: { text: string }) => e.text as string);
  return hits.slice(0, limit);
}

export async function exportYaml(): Promise<void> {
  const rows = await prisma.loreEntry.findMany({ orderBy: { createdAt: 'desc' } });
  const entries = rows.map((r: { slug: string; tags: string[]; text: string }) => ({ id: r.slug, tags: r.tags, text: r.text }));
  const doc = { entries };
  const yamlStr = yaml.dump(doc, { lineWidth: 1000 });
  fs.writeFileSync(LORE_PATH, yamlStr, 'utf-8');
}

export async function addLoreEntry(entry: { slug: string; tags: string[]; text: string }) {
  const r = await prisma.loreEntry.create({ data: { slug: entry.slug, tags: entry.tags as any, text: entry.text } });
  await exportYaml();
  return r;
}

export async function removeLoreEntryBySlug(slug: string) {
  const r = await prisma.loreEntry.deleteMany({ where: { slug } });
  await exportYaml();
  return r.count;
}
