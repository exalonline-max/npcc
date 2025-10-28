import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const item = body?.item
    if (!item) return NextResponse.json({ error: 'Missing item in request' }, { status: 400 })

    const key = process.env.OPENAI_API_KEY
    if (!key) return NextResponse.json({ error: 'OpenAI API key not configured on the server' }, { status: 501 })

    const title = item.name ?? 'Magic Item'
    const typeLine = item.typeLine ?? (item.description ?? '')
    const rarity = item.rarity ?? ''
    const flavor = item.flavor ?? ''
    const affixes = (item.affixes ?? []).slice(0,6).join('; ')
    const theme = item.theme ?? ''

    const prompt = `Create a high-quality, detailed depiction of the described magic item. IMPORTANT: render ONLY the item (for example: a sword, dagger, staff, ring, or trinket) centered on a neutral textured background — do NOT include titles, UI chrome, cards, labels, or borders. Focus on realistic materials and details that reflect rarity and affixes. Use cinematic digital-painting style with painterly brushwork and dramatic lighting. Show the full object (or the most iconic angle) with soft shadows and clear silhouette so it can be composited into a card later.

Item title: ${title}
Type/subtitle: ${typeLine}
Theme: ${theme}
Rarity: ${rarity}
Flavor note: ${flavor}
Key affixes (short): ${affixes}

Stylistic hints: detailed metal and leather textures, subtle magical glow where appropriate, muted warm palette, slightly desaturated background, high contrast lighting, square composition, high detail on focal surfaces.`

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
