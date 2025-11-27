import { PrismaClient } from "@prisma/client";
import { logger } from "~/lib/logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Create Prisma client with production-ready configuration
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development" 
        ? ["query", "error", "warn"] 
        : ["error"],
    
    // Production error handling
    errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Graceful shutdown
if (process.env.NODE_ENV === "production") {
  const shutdown = async () => {
    logger.info("Shutting down Prisma client...");
    await db.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

