import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(){
  const p = path.join(process.cwd(),'lib','wild-magic','effects.json')
  if (!fs.existsSync(p)) return NextResponse.json({ effects: [] })
  const raw = fs.readFileSync(p,'utf-8')
  const data = JSON.parse(raw)
  return NextResponse.json(data)
}
