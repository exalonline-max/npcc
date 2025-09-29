import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '../../../lib/prisma'

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user || !user.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()
  const { name, class: klass, level } = body as { name?: string; class?: string; level?: number }
  if (!name || !klass || !level) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    let dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } })
    if (!dbUser) {
      dbUser = await prisma.user.create({ data: { clerkId: user.id } })
    }

    const character = await prisma.character.create({
      data: { name, class: klass, level: Number(level), userId: dbUser.id }
    })

    return NextResponse.json({ character }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
