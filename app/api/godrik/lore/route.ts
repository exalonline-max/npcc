import { NextResponse } from 'next/server';
import { loadLore, addLoreEntry, removeLoreEntryBySlug } from '../../../../lib/godrik/rag';

export async function GET() {
  const entries = await loadLore();
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entry = body;
    const r = await addLoreEntry(entry);
    return NextResponse.json({ entry: r });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('id') || url.searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const count = await removeLoreEntryBySlug(slug);
    return NextResponse.json({ deleted: count });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 });
  }
}
