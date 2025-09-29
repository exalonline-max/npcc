"use client";
import React, { useEffect, useState } from 'react';

type Entry = { id: string; tags: string[]; text: string };

export default function LoreEditor(){
  const [entries, setEntries] = useState<Entry[]>([]);
  const [id, setId] = useState('');
  const [tags, setTags] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(){
    const res = await fetch('/api/godrik/lore');
    const data = await res.json();
    setEntries(data.entries || []);
  }

  useEffect(()=>{ load() },[]);

  async function add(e:React.FormEvent){
    e.preventDefault();
    setLoading(true);
    try{
    const slug = id || `l-${Date.now()}`;
    const payload = { slug, tags: tags.split(',').map(s=>s.trim()).filter(Boolean), text };
    const res = await fetch('/api/godrik/lore', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    // refresh
    await load();
      setId(''); setTags(''); setText('');
    }catch(err:any){ alert(err.message || String(err)) }
    finally{ setLoading(false) }
  }

  async function remove(id:string){
  if (!confirm('Delete this entry?')) return;
  const res = await fetch(`/api/godrik/lore?slug=${encodeURIComponent(id)}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) return alert(data.error || 'Error');
  await load();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="p-2 border rounded" placeholder="id (optional)" value={id} onChange={e=>setId(e.target.value)} />
        <input className="p-2 border rounded" placeholder="tags (comma-separated)" value={tags} onChange={e=>setTags(e.target.value)} />
        <div className="col-span-1 md:col-span-3">
          <textarea className="w-full p-2 border rounded" rows={4} placeholder="Lore text" value={text} onChange={e=>setText(e.target.value)} />
          <div className="mt-2 flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>Add</button>
            <button type="button" className="btn btn-outline" onClick={()=>{ setId(''); setTags(''); setText('') }}>Clear</button>
          </div>
        </div>
      </form>

      <div className="space-y-2">
        {entries.map((en)=> (
          <div key={en.id} className="p-3 border rounded bg-white">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="text-sm font-medium">{en.id}</div>
                <div className="text-xs text-gray-600">{en.tags.join(', ')}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline" onClick={()=>{ navigator.clipboard.writeText(en.text) }}>Copy</button>
                <button className="btn btn-ghost" onClick={()=>remove(en.id)}>Delete</button>
              </div>
            </div>
            <div className="mt-2 text-sm">{en.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
