'use client'
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
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
          <div className="space-y-3 mb-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">Category</div>
              <div className="flex flex-wrap gap-2">
                {CATS.map((c) => (
                  <Button key={c} variant="toggle" active={category === c} onClick={() => setCategory(c)} className="px-3 py-2 text-sm">{c.replace(/_/g,' ')}</Button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Motif</div>
              <div className="flex gap-2">
                {MOTIFS.map((m) => (
                  <Button key={m} variant="toggle" active={motif === m} onClick={() => setMotif(m)} className="px-3 py-2 text-sm">{m}</Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <div>
                <div className="text-xs text-gray-600 mb-1">Length</div>
                <div className="flex gap-2">
                  {LENGTHS.map((l) => (
                    <Button key={l} variant="toggle" active={length === l} onClick={() => setLength(l)} className="px-3 py-2 text-sm">{l}</Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Tone</div>
                <div className="flex gap-2">
                  {TONES.map((t) => (
                    <Button key={t} variant="toggle" active={tone === t} onClick={() => setTone(t)} className="px-3 py-2 text-sm">{t}</Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Backend</div>
              <div className="flex gap-2">
                {(['ollama','openai','mock'] as const).map((b) => (
                  <Button key={b} variant="toggle" active={backend === b} onClick={() => setBackend(b)} className="px-3 py-2 text-sm">{b}</Button>
                ))}
              </div>
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
