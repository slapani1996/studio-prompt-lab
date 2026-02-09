import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

async function createPrismaClientWithTurso(): Promise<PrismaClient> {
  const { PrismaLibSql } = await import('@prisma/adapter-libsql');

  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // @ts-expect-error - adapter type differs between versions
  return new PrismaClient({ adapter });
}

// For production with Turso, use async initialization
// For development, use standard PrismaClient
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Export async function for production Turso usage
export async function getTursoPrismaClient(): Promise<PrismaClient> {
  if (process.env.TURSO_DATABASE_URL) {
    return createPrismaClientWithTurso();
  }
  return prisma;
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
