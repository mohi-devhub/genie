import { createTRPCRouter, publicProcedure } from "../trpc";

export const modelRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const models = await ctx.db.model.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return models;
    } catch (error) {
      console.error("[model.getAll] Database error:", error);
      throw error;
    }
  }),
});
