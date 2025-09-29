'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATS = ['destiny','purpose','comfort','combat','investigation','one_liners','questions'] as const;
const MOTIFS = ['forge','shield','stars','neutral'] as const;
const LENGTHS = ['short','medium','long'] as const;
const TONES = ['stoic','teacherly','poetic','commanding'] as const;

export default function GodrikClient() {
  const [category, setCategory] = useState<typeof CATS[number]>('destiny');
  const [motif, setMotif] = useState<typeof MOTIFS[number]>('forge');
  const [length, setLength] = useState<typeof LENGTHS[number]>('medium');
  const [tone, setTone] = useState<typeof TONES[number]>('poetic');
  const [backend, setBackend] = useState<'ollama'|'openai'|'mock'>('mock');
  const [context, setContext] = useState('');
  const [result, setResult] = useState('');
  const [lorePrev, setLorePrev] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch('/api/godrik/generate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ category, motif, length, tone, backend, context })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data || 'Error');
      setResult(data.text || '');
      setLorePrev(data.lorePreview || []);
    } catch (e:any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function copy() { navigator.clipboard.writeText(result || ''); }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName?.match(/INPUT|TEXTAREA|SELECT/)) return;
      if (e.key.toLowerCase() === 'g') generate();
      if (e.key.toLowerCase() === 'c') copy();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result, category, motif, length, tone, backend, context]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-1">
        <CardHeader><CardTitle>Controls</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Select value={category as string} onValueChange={(v:any)=>setCategory(v)}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{(CATS as unknown as string[]).map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={motif as string} onValueChange={(v:any)=>setMotif(v)}>
            <SelectTrigger><SelectValue placeholder="Motif" /></SelectTrigger>
            <SelectContent>{(MOTIFS as unknown as string[]).map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={length as string} onValueChange={(v:any)=>setLength(v)}>
            <SelectTrigger><SelectValue placeholder="Length" /></SelectTrigger>
            <SelectContent>{(LENGTHS as unknown as string[]).map(l=><SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={tone as string} onValueChange={(v:any)=>setTone(v)}>
            <SelectTrigger><SelectValue placeholder="Tone" /></SelectTrigger>
            <SelectContent>{(TONES as unknown as string[]).map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={backend} onValueChange={(v:any)=>setBackend(v)}>
            <SelectTrigger><SelectValue placeholder="Backend" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ollama">ollama (local)</SelectItem>
              <SelectItem value="openai">openai</SelectItem>
              <SelectItem value="mock">mock</SelectItem>
            </SelectContent>
          </Select>
          <Textarea value={context} onChange={(e:any)=>setContext(e.target.value)} placeholder="Optional scene context…" />
          <div className="flex gap-2">
            <Button onClick={generate} disabled={loading}>{loading ? 'Generating…' : 'Generate (G)'}</Button>
            <Button variant="secondary" onClick={copy}>Copy (C)</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Result</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="min-h-[160px] p-4 rounded-md border bg-background/40 whitespace-pre-wrap">{result}</div>
          {lorePrev.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <div className="mb-1 font-medium">Lore referenced:</div>
              <ul className="list-disc pl-5 space-y-1">
                {lorePrev.map((s,i)=><li key={i} className="line-clamp-2">{s}</li>)}
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={generate}>Regenerate</Button>
            <Button variant="secondary" onClick={()=>setResult('')}>Clear</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
