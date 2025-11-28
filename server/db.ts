import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Create Prisma client with serverless-optimized configuration
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development" 
        ? ["query", "error", "warn"] 
        : ["error"],
    
    // Production error handling
    errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
    
    // Datasource configuration for connection pooling
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

