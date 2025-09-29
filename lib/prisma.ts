// Use require to avoid TypeScript module resolution issues in this environment
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export default prisma
