import { NextResponse } from "next/server";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`;
    
    // Test category query
    const categoryCount = await db.category.count();
    
    // Test model query
    const modelCount = await db.model.count();
    
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      categories: categoryCount,
      models: modelCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Health Check] Error:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
