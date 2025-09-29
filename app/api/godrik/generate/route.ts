import { NextRequest, NextResponse } from 'next/server';
import { getLoreSnippets } from '../../../../lib/godrik/rag';
import { buildPrompt } from '../../../../lib/godrik/promptTemplate';

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.1:8b';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

async function callOllama(prompt: string) {
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt, options: { temperature: 0.8 } })
  });
  if (!res.ok) throw new Error(`Ollama error ${res.status}`);
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let text = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    for (const line of chunk.split('\n').filter(Boolean)) {
      try { text += JSON.parse(line).response ?? ''; } catch {}
    }
  }
  return text.trim();
}

async function callOpenAI(prompt: string) {
  if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'You are Godrik, a philosopher-smith artificer. Reply with one concise, lore-aware line.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8
    })
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  return data.choices[0]?.message?.content?.trim() ?? '';
}

export async function POST(req: NextRequest) {
  const { category, motif, length, tone, context, backend } = await req.json();
  const tags = [category, motif, 'godrik', 'forge_gods'];
  const loreSnippets = getLoreSnippets(tags);
  const prompt = buildPrompt({ category, motif, length, tone, context, loreSnippets });

  try {
    let text = '';
    if (backend === 'ollama') text = await callOllama(prompt);
    else if (backend === 'openai') text = await callOpenAI(prompt);
    else {
      const base = 'Destiny is not a chain, but a river.';
      const wrap = motif === 'forge' ? `${base} The forge remembers every blow.`
                : motif === 'shield' ? `${base} Stand; we are the wall.`
                : motif === 'stars' ? `${base} Even stars burn to give light.`
                : base;
      text = wrap;
    }
    return NextResponse.json({ text, lorePreview: loreSnippets.slice(0,3) });
  } catch (e: any) {
    return new NextResponse(e.message || 'Generation failed', { status: 500 });
  }
}
