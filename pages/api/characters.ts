import { NextApiRequest, NextApiResponse } from 'next'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const user = await currentUser()
  if (!user || !user.id) return res.status(401).json({ error: 'Not authenticated' })

  const { name, class: klass, level } = req.body as { name?: string; class?: string; level?: number }
  if (!name || !klass || !level) return res.status(400).json({ error: 'Missing fields' })

  try {
    // ensure user exists
    let dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } })
    if (!dbUser) {
      dbUser = await prisma.user.create({ data: { clerkId: user.id } })
    }

    const character = await prisma.character.create({
      data: { name, class: klass, level: Number(level), userId: dbUser.id }
    })

    return res.status(201).json({ character })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}
