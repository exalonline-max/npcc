import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

type Body = { id?: number; text?: string }

async function postToDiscord(webhook: string, content: string){
  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  return res
}

export async function POST(req: Request){
  const webhook = process.env.DISCORD_WILDMAGIC_WEBHOOK
  if (!webhook) return NextResponse.json({ error: 'DISCORD_WILDMAGIC_WEBHOOK not configured' }, { status: 500 })

  let body: Body
  try { body = await req.json() } catch (e) { return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 }) }

  let text = body.text
  if (!text && typeof body.id === 'number'){
    const p = path.join(process.cwd(),'lib','wild-magic','effects.json')
    if (!fs.existsSync(p)) return NextResponse.json({ error: 'effects.json not found' }, { status: 500 })
    const raw = fs.readFileSync(p,'utf-8')
    const data = JSON.parse(raw)
    const effect = Array.isArray(data.effects) && data.effects.find((e: any) => e.id === body.id)
    if (!effect) return NextResponse.json({ error: `effect id ${body.id} not found` }, { status: 404 })
    text = effect.text
  }

  if (!text) return NextResponse.json({ error: 'no text or id provided' }, { status: 400 })

  try {
    const res = await postToDiscord(webhook, text)
    if (!res.ok) {
      const txt = await res.text().catch(()=>'')
      return NextResponse.json({ error: 'discord error', status: res.status, body: txt }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 502 })
  }
}
