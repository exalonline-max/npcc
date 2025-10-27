import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const present = !!process.env.OPENAI_API_KEY
    return NextResponse.json({ openai_api_key_present: present })
  } catch (err:any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
