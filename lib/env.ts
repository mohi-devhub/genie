/**
 * Environment variable validation and type-safe access
 * This ensures all required environment variables are present at build/runtime
 */

import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().min(1, "NEXTAUTH_URL is required"),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 * Throws an error with detailed information if validation fails
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    const issues = result.error.issues.map(
      (err: z.ZodIssue) => `  - ${err.path.join(".")}: ${err.message}`
    ).join("\n");
    
    throw new Error(
      `❌ Environment variable validation failed:\n\n${issues}\n\n` +
      `Please check your .env file and ensure all required variables are set.\n` +
      `See .env.example for a template.`
    );
  }
  
  return result.data;
}

/**
 * Type-safe environment variables
 * Only validates in production and development (not during build)
 */
export const env: Env = process.env.NEXT_PHASE === "phase-production-build" 
  ? (process.env as unknown as Env)
  : validateEnv();

