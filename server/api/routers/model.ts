import { createTRPCRouter, publicProcedure } from "../trpc";

export const modelRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.model.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
});
