'use client'
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

const CATS = ['destiny','purpose','comfort','combat','investigation','one_liners','questions'] as const;
const MOTIFS = ['forge','shield','stars','neutral'] as const;
const LENGTHS = ['short','medium','long'] as const;
const TONES = ['stoic','teacherly','poetic','commanding'] as const;

export default function GodrikClient() {
  const [category, setCategory] = useState<typeof CATS[number]>('destiny');
  const [motif, setMotif] = useState<typeof MOTIFS[number]>('forge');
  const [length, setLength] = useState<typeof LENGTHS[number]>('medium');
  const [tone, setTone] = useState<typeof TONES[number]>('poetic');
    const [backend, setBackend] = useState<'ollama' | 'openai' | 'mock'>('mock');
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-600">Category</label>
              <select className="w-full p-2 border rounded mt-1" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
                <option value="destiny">Destiny</option>
                <option value="purpose">Purpose</option>
                <option value="comfort">Comfort</option>
                <option value="combat">Combat</option>
                <option value="investigation">Investigation</option>
                <option value="one_liners">One Liners</option>
                <option value="questions">Questions</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Motif</label>
              <select className="w-full p-2 border rounded mt-1" value={motif} onChange={(e) => setMotif(e.target.value as typeof motif)}>
                <option value="forge">Forge</option>
                <option value="shield">Shield</option>
                <option value="stars">Stars</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Length</label>
              <select className="w-full p-2 border rounded mt-1" value={length} onChange={(e) => setLength(e.target.value as typeof length)}>
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Tone</label>
              <select className="w-full p-2 border rounded mt-1" value={tone} onChange={(e) => setTone(e.target.value as typeof tone)}>
                <option value="stoic">Stoic</option>
                <option value="teacherly">Teacherly</option>
                <option value="poetic">Poetic</option>
                <option value="commanding">Commanding</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600">Backend</label>
              <select className="w-full p-2 border rounded mt-1" value={backend} onChange={(e) => setBackend(e.target.value as typeof backend)}>
                <option value="ollama">Ollama (local)</option>
                <option value="openai">OpenAI</option>
                <option value="mock">Mock</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="text-xs text-gray-600">Prompt / Context</label>
            <Textarea value={context} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContext(e.target.value)} placeholder="Optional scene context…" />
          </div>
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
