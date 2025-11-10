import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { VoteType } from "@prisma/client";

export const promptRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        modelId: z.string().optional(),
        sortBy: z.enum(["NEW", "TOP"]).default("NEW"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, modelId, sortBy } = input;

      // Build the where clause for filtering
      const where = {
        ...(categoryId && { categoryId }),
        ...(modelId && { modelId }),
      };

      // Fetch prompts with relations
      const prompts = await ctx.db.prompt.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          model: {
            select: {
              id: true,
              name: true,
            },
          },
          votes: true,
        },
        orderBy: sortBy === "NEW" ? { createdAt: "desc" } : undefined,
      });

      // Calculate vote scores and determine current user vote
      const promptsWithVotes = prompts.map((prompt) => {
        const upvotes = prompt.votes.filter((v) => v.type === VoteType.UP).length;
        const downvotes = prompt.votes.filter((v) => v.type === VoteType.DOWN).length;
        const voteScore = upvotes - downvotes;

        // Determine current user's vote if authenticated
        let currentUserVote: "UP" | "DOWN" | null = null;
        if (ctx.session?.user?.id) {
          const userVote = prompt.votes.find((v) => v.userId === ctx.session!.user.id);
          if (userVote) {
            currentUserVote = userVote.type;
          }
        }

        // Remove votes array from response
        const { votes, ...promptWithoutVotes } = prompt;

        return {
          ...promptWithoutVotes,
          voteScore,
          currentUserVote,
        };
      });

      // Sort by TOP (voteScore) if requested
      if (sortBy === "TOP") {
        promptsWithVotes.sort((a, b) => b.voteScore - a.voteScore);
      }

      return promptsWithVotes;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        promptText: z.string().min(1).max(5000),
        categoryId: z.string(),
        modelId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = await ctx.db.prompt.create({
        data: {
          title: input.title,
          promptText: input.promptText,
          categoryId: input.categoryId,
          modelId: input.modelId,
          authorId: ctx.session.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          model: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return prompt;
    }),
});
