/**
 * Client-side tRPC utilities.
 * This configures the tRPC client for use in client components.
 */
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "~/server/api/root";

/**
 * A set of type-safe React hooks for your tRPC API.
 */
export const trpc = createTRPCReact<AppRouter>();
