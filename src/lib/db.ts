import { PrismaClient } from '.prisma/client'

// Always create a fresh client to avoid caching issues
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// In development, always create a new client to pick up schema changes
export const db = new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db