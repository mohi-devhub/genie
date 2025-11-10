import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { VoteType } from "@prisma/client";

export const voteRouter = createTRPCRouter({
  cast: protectedProcedure
    .input(
      z.object({
        promptId: z.string(),
        type: z.enum(["UP", "DOWN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { promptId, type } = input;

      // Check if vote exists for this user and prompt
      const existingVote = await ctx.db.vote.findUnique({
        where: {
          userId_promptId: {
            userId,
            promptId,
          },
        },
      });

      let userVote: "UP" | "DOWN" | null = null;

      if (!existingVote) {
        // No existing vote - create new vote
        await ctx.db.vote.create({
          data: {
            userId,
            promptId,
            type: type as VoteType,
          },
        });
        userVote = type;
      } else if (existingVote.type === type) {
        // Same type clicked - delete vote (toggle off)
        await ctx.db.vote.delete({
          where: {
            id: existingVote.id,
          },
        });
        userVote = null;
      } else {
        // Different type clicked - update vote
        await ctx.db.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            type: type as VoteType,
          },
        });
        userVote = type;
      }

      // Calculate updated vote score
      const votes = await ctx.db.vote.findMany({
        where: {
          promptId,
        },
      });

      const voteScore = votes.reduce((score, vote) => {
        return vote.type === "UP" ? score + 1 : score - 1;
      }, 0);

      return {
        success: true,
        voteScore,
        userVote,
      };
    }),
});
