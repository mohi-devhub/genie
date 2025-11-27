import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { VoteType } from "@prisma/client";
import { rateLimiters } from "~/lib/rate-limit";

export const voteRouter = createTRPCRouter({
  cast: protectedProcedure
    .input(
      z.object({
        promptId: z.string().cuid("Invalid prompt ID"),
        type: z.enum(["UP", "DOWN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { promptId, type } = input;

      // Rate limiting: 100 votes per minute per user
      const rateLimitResult = rateLimiters.voting.check(userId);
      if (!rateLimitResult.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many votes. Please slow down and try again later.",
        });
      }

      // Verify prompt exists
      const prompt = await ctx.db.prompt.findUnique({
        where: { id: promptId },
      });
      if (!prompt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      // Prevent users from voting on their own prompts
      if (prompt.authorId === userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot vote on your own prompts",
        });
      }

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
