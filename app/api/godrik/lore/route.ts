import { NextResponse } from 'next/server';
import { loadLore, addLoreEntry, removeLoreEntryBySlug } from '../../../../lib/godrik/rag';
import { currentUser } from '@clerk/nextjs/server';

async function requireAdmin() {
  const user = await currentUser();
  if (!user) return { ok: false, status: 401, msg: 'Unauthorized' };
  const admin = process.env.GODRIK_ADMIN_EMAIL;
  if (admin && user.emailAddresses?.[0]?.emailAddress !== admin) return { ok: false, status: 403, msg: 'Forbidden' };
  return { ok: true, user };
}

export async function GET() {
  const entries = await loadLore();
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return NextResponse.json({ error: adminCheck.msg }, { status: adminCheck.status });
    const body = await req.json();
    const entry = body;
    const created = await addLoreEntry(entry);
    return NextResponse.json({ entry: created });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return NextResponse.json({ error: adminCheck.msg }, { status: adminCheck.status });
    const url = new URL(req.url);
    const slug = url.searchParams.get('id') || url.searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const count = await removeLoreEntryBySlug(slug);
    return NextResponse.json({ deleted: count });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 });
  }
}
