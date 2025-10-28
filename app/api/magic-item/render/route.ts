import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const item = body?.item
    if (!item) return NextResponse.json({ error: 'Missing item in request' }, { status: 400 })

    const key = process.env.OPENAI_API_KEY
    if (!key) return NextResponse.json({ error: 'OpenAI API key not configured on the server' }, { status: 501 })

    // Build a visual prompt for an evocative D&D-item card in parchment style
    const title = item.name ?? 'Magic Item'
    const typeLine = item.typeLine ?? (item.description ?? '')
    const rarity = item.rarity ?? ''
    const flavor = item.flavor ?? ''
    const affixes = (item.affixes ?? []).slice(0,6).join('; ')

    const prompt = `Create a high-quality, parchment-style Dungeons & Dragons magic item card artwork for the following item. Do NOT include any visible UI chrome or buttons — only the card art itself. Use warm parchment tones, subtle vignette, and an elegant serif title. Center a stylized depiction of the item (iconic, somewhat painterly) with soft shadows. Include space near the top for the item name and a subtitle line. Visual cues: rarity: ${rarity}. Flavor: ${flavor}. Affixes (short): ${affixes}. Title: ${title}. Style: detailed watercolor and digital painting blend, aged paper texture, muted warm palette, cinematic lighting, 3:4 aspect ratio.`

    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: res.status })
    }

    const data = await res.json()
    const b64 = data?.data?.[0]?.b64_json
    if (!b64) return NextResponse.json({ error: 'No image returned from OpenAI' }, { status: 502 })

    return NextResponse.json({ b64 })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
