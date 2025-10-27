import { NextResponse } from 'next/server'

type Item = any

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const item: Item = body?.item
    if (!item) return NextResponse.json({ error: 'Missing item in request' }, { status: 400 })

    const key = process.env.OPENAI_API_KEY
    if (!key) return NextResponse.json({ error: 'OpenAI API key not configured on the server' }, { status: 501 })

    const system = `You are a professional fantasy item writer. Produce a short, evocative description and a mechanical bullet list from the provided JSON representation. Return JSON with keys: summary (string) and bullets (array of strings). The summary should include a one-line type/rarity line and a 2-4 sentence evocative paragraph.`

    const user = `Item JSON:\n${JSON.stringify(item, null, 2)}`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: res.status })
    }

    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? ''

    // Try to parse JSON from the model; fall back to raw text
    try {
      const parsed = JSON.parse(raw)
      return NextResponse.json(parsed)
    } catch (e) {
      return NextResponse.json({ summary: raw, bullets: [] })
    }
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
