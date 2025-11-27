/**
 * This is the primary tRPC configuration file.
 * It defines the context, procedure helpers, and initialization logic.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "../auth";
import { db } from "../db";

/**
 * Create the tRPC context.
 * This is where we add things that should be available to all procedures.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    ...opts,
  };
};

/**
 * Initialize tRPC with the context and transformer.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // Log errors for monitoring
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("tRPC Internal Server Error:", error.cause, {
        code: error.code,
      });
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Public (unauthenticated) procedure.
 * This is the base piece you use to build new queries and mutations on your tRPC API.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure.
 * If you want a query or mutation to ONLY be accessible to logged in users, use this.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Export reusable router and procedure helpers.
 */
export const createTRPCRouter = t.router;
