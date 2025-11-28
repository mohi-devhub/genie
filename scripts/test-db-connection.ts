/**
 * Test database connection script
 * Run with: npx tsx scripts/test-db-connection.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"));
    
    // Test basic connection
    await prisma.$connect();
    console.log("✓ Database connected successfully");

    // Test Category query
    console.log("\nTesting Category.findMany()...");
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    console.log(`✓ Found ${categories.length} categories:`, categories.map(c => c.name));

    // Test Model query
    console.log("\nTesting Model.findMany()...");
    const models = await prisma.model.findMany({
      orderBy: { name: "asc" },
    });
    console.log(`✓ Found ${models.length} models:`, models.map(m => m.name));

    console.log("\n✓ All tests passed!");
  } catch (error) {
    console.error("\n✗ Database connection failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
