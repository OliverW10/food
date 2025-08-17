import { PrismaClient } from "@/generated/prisma/client";
import "server-only";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

// Prevents multiple instances of prisma client when hot reloading? (gpt suggestion)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
