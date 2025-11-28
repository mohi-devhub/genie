import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.db.category.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return categories;
    } catch (error) {
      console.error("[category.getAll] Database error:", error);
      throw error;
    }
  }),
});
