import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis;

const globalPrisma =
  globalForPrisma.globalPrisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.globalPrisma = globalPrisma;
}

export default globalPrisma;
