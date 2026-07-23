import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton. Next.js dev mode hot-reloads modules, which
 * would otherwise spin up a new PrismaClient (and new DB connection pool)
 * on every edit — so the instance is cached on `globalThis` in development.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
