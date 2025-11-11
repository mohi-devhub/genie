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
        // Filter to only show prompts with positive votes
        const topPrompts = promptsWithVotes.filter((p) => p.voteScore > 0);
        topPrompts.sort((a, b) => b.voteScore - a.voteScore);
        return topPrompts;
      }

      return promptsWithVotes;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less").trim(),
        promptText: z.string().min(10, "Prompt must be at least 10 characters").max(5000, "Prompt must be 5000 characters or less").trim(),
        categoryId: z.string().cuid("Invalid category ID"),
        modelId: z.string().cuid("Invalid model ID"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify category exists
      const category = await ctx.db.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) {
        throw new Error("Invalid category");
      }

      // Verify model exists
      const model = await ctx.db.model.findUnique({
        where: { id: input.modelId },
      });
      if (!model) {
        throw new Error("Invalid model");
      }

      // Check for rate limiting - max 10 prompts per hour per user
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentPrompts = await ctx.db.prompt.count({
        where: {
          authorId: ctx.session.user.id,
          createdAt: {
            gte: oneHourAgo,
          },
        },
      });

      if (recentPrompts >= 10) {
        throw new Error("Rate limit exceeded. Please wait before submitting more prompts.");
      }

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
