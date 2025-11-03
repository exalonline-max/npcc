// app/tools/achievements/achievements.tsx
"use client";
import React from "react";

// ---------------- Storage (localStorage + export/import) ----------------
const KEY = "npcc.achievements.v1";

function loadStore() {
  if (typeof window === "undefined") return { achievements: [], awards: [], players: [] };
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null") ?? { achievements: [], awards: [], players: [] };
  } catch {
    return { achievements: [], awards: [], players: [] };
  }
}
function saveStore(store: any) {
  localStorage.setItem(KEY, JSON.stringify(store));
}
function uid() { return Math.random().toString(36).slice(2); }
function nowISO() { return new Date().toISOString(); }
function fmtDate(iso?: string) { if (!iso) return "—"; try { return new Date(iso).toLocaleString(); } catch { return iso; } }

// ---------------- Types (shape only for clarity) ----------------
// type Achievement = { id: string; title: string; description?: string; points: number; tags: string[]; visible: boolean; createdAt: string; };
// type Award = { id: string; achievementId: string; playerId: string; notes?: string; awardedAt: string; };
// type Player = { id: string; name: string };

// Small UI helpers
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge mr-1">{children}</span>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 mr-2">{children}</span>;
}

export default function AchievementsPage() {
  const [store, setStore] = React.useState(loadStore());
  const [filter, setFilter] = React.useState({ q: "", tag: "All" });
  const [form, setForm] = React.useState({ title: "", description: "", points: 1, tags: "", visible: true });
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newPlayer, setNewPlayer] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => { saveStore(store); }, [store]);

  // ----- Derived helpers -----
  const allTags: string[] = Array.from(new Set(((store.achievements || []) as any[]).flatMap((a: any) => a.tags || []))).sort();
  const filtered = (store.achievements || []).filter((a: any) => {
    const byTag = filter.tag === "All" || (a.tags || []).includes(filter.tag);
    const byQ = !filter.q || (a.title + " " + (a.description || "")).toLowerCase().includes(filter.q.toLowerCase());
    return byTag && byQ;
  });

  const achievementsCount = (store.achievements || []).length;
  const playersCount = (store.players || []).length;
  const awardsCount = (store.awards || []).length;

  // ----- CRUD: Achievements -----
  function resetForm() {
    setForm({ title: "", description: "", points: 1, tags: "", visible: true });
    setEditingId(null);
  }
  function submitAchievement(e: React.FormEvent) {
    e.preventDefault();
    const tags = form.tags.split(",").map(s => s.trim()).filter(Boolean);
    if (editingId) {
      setStore((s: any) => ({
        ...s,
        achievements: s.achievements.map((a: any) =>
          a.id === editingId ? { ...a, title: form.title.trim(), description: form.description.trim(), points: Number(form.points || 0), tags, visible: !!form.visible } : a
        )
      }));
    } else {
      const a = { id: uid(), title: form.title.trim(), description: form.description.trim(), points: Number(form.points || 0), tags, visible: !!form.visible, createdAt: nowISO() };
      setStore((s: any) => ({ ...s, achievements: [a, ...(s.achievements || [])] }));
    }
    resetForm();
  }
  function editAchievement(a: any) {
    setEditingId(a.id);
    setForm({ title: a.title, description: a.description || "", points: a.points, tags: (a.tags || []).join(", "), visible: !!a.visible });
  }
  function deleteAchievement(id: string) {
    if (!confirm("Delete this achievement? This will also remove awards referencing it.")) return;
    setStore((s: any) => ({
      ...s,
      achievements: s.achievements.filter((a: any) => a.id !== id),
      awards: s.awards.filter((w: any) => w.achievementId !== id),
    }));
    if (editingId === id) resetForm();
  }

  // ----- Players -----
  function addPlayer() {
    const name = newPlayer.trim();
    if (!name) return;
    const p = { id: uid(), name };
    setStore((s: any) => ({ ...s, players: [...(s.players || []), p] }));
    setNewPlayer("");
  }
  function removePlayer(id: string) {
    if (!confirm("Remove player and all their awards?")) return;
    setStore((s: any) => ({ ...s, players: s.players.filter((p: any) => p.id !== id), awards: s.awards.filter((w: any) => w.playerId !== id) }));
  }

  // ----- Awards (per player) -----
  function award(achievementId: string, playerId: string, notes = "") {
    const exists = store.awards.find((w: any) => w.achievementId === achievementId && w.playerId === playerId);
    if (exists) return;
    const w = { id: uid(), achievementId, playerId, notes, awardedAt: nowISO() };
    setStore((s: any) => ({ ...s, awards: [w, ...(s.awards || [])] }));
  }
  function revoke(achievementId: string, playerId: string) {
    setStore((s: any) => ({ ...s, awards: s.awards.filter((w: any) => !(w.achievementId === achievementId && w.playerId === playerId)) }));
  }
  function playerHas(achievementId: string, playerId: string) {
    return store.awards.some((w: any) => w.achievementId === achievementId && w.playerId === playerId);
  }

  // ----- Import/Export -----
  function exportJson() {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `npcc_achievements_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = JSON.parse(String(reader.result));
        if (!next?.achievements || !next?.awards || !Array.isArray(next.achievements)) throw new Error("Bad file");
        setStore(next);
      } catch {
        alert("Invalid file format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // ----- Progress summary -----
  const playerTotals = (store.players || []).map((p: any) => {
    const gained = (store.awards || []).filter((w: any) => w.playerId === p.id)
      .map((w: any) => (store.achievements.find((a: any) => a.id === w.achievementId)?.points || 0))
      .reduce((a: number, b: number) => a + b, 0);
    const max = (store.achievements || []).reduce((a: number, b: any) => a + (b.points || 0), 0);
    return { player: p, gained, max };
  });

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[380px_1fr] p-4">
      {/* LEFT: Controls */}
      <section className="card bg-base-100 shadow-sm border">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="card-title">Achievements</h2>
              <p className="text-sm opacity-70 mt-1">Create awards, track points per player, and export/import your progress.</p>
              <div className="mt-2 flex items-center gap-2">
                <Pill>{achievementsCount} achievements</Pill>
                <Pill>{playersCount} players</Pill>
                <Pill>{awardsCount} awards</Pill>
              </div>
            </div>
            <div className="flex gap-2 mt-1">
              <button className="btn btn-sm" onClick={exportJson} aria-label="Export achievements">Export</button>
              <label className="btn btn-sm btn-ghost" aria-label="Import achievements">
                Import <input type="file" className="hidden" accept="application/json" onChange={importJson} />
              </label>
            </div>
          </div>

          {/* Create / Edit */}
          <form onSubmit={submitAchievement} className="space-y-2">
            <label className="label"><span className="label-text">Title</span></label>
            <input aria-label="Achievement title" className="input input-bordered w-full" placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required />
            <label className="label"><span className="label-text">Description</span></label>
            <textarea aria-label="Achievement description" className="textarea textarea-bordered w-full" placeholder="Description" rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
            <div className="grid grid-cols-3 gap-2">
              <input type="number" min={0} className="input input-bordered" placeholder="Points" value={form.points} onChange={e=>setForm(f=>({...f,points:Number(e.target.value)||0}))} />
              <input aria-label="Tags" className="input input-bordered col-span-2" placeholder="Tags (comma-separated)" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} />
            </div>
            <label className="label cursor-pointer justify-start gap-3">
              <input type="checkbox" className="checkbox" checked={form.visible} onChange={e=>setForm(f=>({...f,visible:e.target.checked}))} />
              <span className="label-text">Visible to players</span>
            </label>

            <div className="flex gap-2">
              <button className="btn btn-primary" type="submit">{editingId ? "Save" : "Create"}</button>
              {editingId && <button className="btn btn-ghost" type="button" onClick={resetForm}>Cancel</button>}
            </div>
          </form>

          {/* Players */}
          <div className="divider my-3">Players</div>
          <div className="flex gap-2">
            <input className="input input-bordered flex-1" placeholder="Add player name" value={newPlayer} onChange={e=>setNewPlayer(e.target.value)} />
            <button className="btn" onClick={addPlayer}>Add</button>
          </div>
          {(store.players || []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(store.players || []).map((p: any)=>(
                <div key={p.id} className="flex items-center gap-2 bg-base-200 px-2 py-1 rounded-full">
                  <span className="text-sm">{p.name}</span>
                  <button title={`Remove ${p.name}`} aria-label={`Remove ${p.name}`} className="btn btn-ghost btn-xs" onClick={()=>removePlayer(p.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RIGHT: List & Progress */}
      <section className="space-y-4">
        {/* Search / Filter */}
        <div className="flex items-center gap-2">
          <input aria-label="Search achievements" className="input input-bordered w-full" placeholder="Search achievements..." value={filter.q} onChange={e=>setFilter(f=>({...f,q:e.target.value}))} />
          <select aria-label="Filter by tag" className="select select-bordered" value={filter.tag} onChange={e=>setFilter(f=>({...f,tag:e.target.value}))}>
            <option>All</option>
            {allTags.map(t=> <option key={t}>{t}</option>)}
          </select>
          <div className="ml-2 text-sm opacity-70">Showing <strong>{filtered.length}</strong> / {achievementsCount}</div>
        </div>

        {/* Progress Summary */}
        {(store.players || []).length > 0 && (
          <div className="grid md:grid-cols-2 gap-3">
            {playerTotals.map(({player, gained, max}: { player: any; gained: number; max: number })=> (
              <div key={player.id} className="card bg-base-100 shadow-sm border">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{player.name}</h4>
                    <Badge>{gained} / {max} pts</Badge>
                  </div>
                  <progress className="progress w-full" value={max ? (gained/max*100) : 0} max={100}></progress>
                  <div className="text-xs opacity-60 mt-2">Last updated: {fmtDate()}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Achievements grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a: any)=>{
            const awardedMap: Record<string, boolean> = Object.fromEntries((store.awards || [])
              .filter((w: any) => w.achievementId === a.id)
              .map((w: any) => [w.playerId, true])
            );
            const copyText = `**${a.title}** (${a.points} pts)\n${a.description || ""}\n${(a.tags||[]).map((t:string)=>`#${t}`).join(" ")}`.trim();

            return (
              <article key={a.id} className="card bg-base-100 shadow-sm border">
                <div className="card-body">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="card-title leading-tight">{a.title}</h4>
                      <div className="text-sm opacity-70">
                        <span className="badge badge-ghost mr-1">{a.points} pts</span>
                        {(a.tags||[]).map((t:string)=>(<Badge key={t}>#{t}</Badge>))}
                        {!a.visible && <span className="badge badge-outline ml-1">Hidden</span>}
                      </div>
                    </div>
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-xs" onClick={()=>copy(copyText)} aria-label={`Copy ${a.title}`}>Copy</button>
                        <button className="btn btn-ghost btn-xs" onClick={()=>editAchievement(a)} aria-label={`Edit ${a.title}`}>Edit</button>
                        <button className="btn btn-ghost btn-xs" onClick={()=>deleteAchievement(a.id)} aria-label={`Delete ${a.title}`}>Delete</button>
                      </div>
                  </div>

                  {a.description && <p className="text-sm mt-2">{a.description}</p>}

                  {/* Award controls */}
                  {(store.players || []).length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs opacity-70 mb-1">Award to:</div>
                      <div className="flex flex-wrap gap-2">
                        {store.players.map((p: any)=>{
                          const has = !!awardedMap[p.id];
                          return has ? (
                            <button key={p.id} className="btn btn-xs btn-success" onClick={()=>revoke(a.id, p.id)} aria-label={`Revoke ${a.title} from ${p.name}`}>{p.name} ✓</button>
                          ) : (
                            <button key={p.id} className="btn btn-xs" onClick={()=>award(a.id, p.id)} aria-label={`Award ${a.title} to ${p.name}`}>{p.name}</button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Small footer */}
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs opacity-60">Created: {fmtDate(a.createdAt)}</div>
                    <div>
                      <button className="btn btn-sm" onClick={()=>copy(copyText)}>Copy for Discord</button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm opacity-70">
              No achievements yet. Create one on the left — or import a JSON from a previous campaign.
            </div>
          )}
        </div>
      </section>

      {/* tiny copy toast */}
      {copied && (
        <div className="toast toast-end">
          <div className="alert alert-success"><span>Copied to clipboard.</span></div>
        </div>
      )}
    </div>
  );
}