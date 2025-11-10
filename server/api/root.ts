/**
 * This is the primary router for your server.
 * All routers added in /server/api/routers should be manually added here.
 */
import { createCallerFactory, createTRPCRouter } from "./trpc";
import { categoryRouter } from "./routers/category";
import { modelRouter } from "./routers/model";
import { promptRouter } from "./routers/prompt";
import { voteRouter } from "./routers/vote";

/**
 * This is the primary router for your server.
 * All routers will be added here as they are created.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  model: modelRouter,
  prompt: promptRouter,
  vote: voteRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 */
export const createCaller = createCallerFactory(appRouter);
