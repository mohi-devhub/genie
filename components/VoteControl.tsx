"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/trpc/client";
import { cn } from "~/lib/utils";

interface VoteControlProps {
  promptId: string;
  initialScore: number;
  initialUserVote: "UP" | "DOWN" | null;
}

export function VoteControl({
  promptId,
  initialScore,
  initialUserVote,
}: VoteControlProps) {
  const { data: session } = useSession();
  const [optimisticScore, setOptimisticScore] = useState(initialScore);
  const [optimisticUserVote, setOptimisticUserVote] =
    useState(initialUserVote);

  // Sync with server state when props change
  useEffect(() => {
    setOptimisticScore(initialScore);
    setOptimisticUserVote(initialUserVote);
  }, [initialScore, initialUserVote]);

  const utils = trpc.useUtils();

  const voteMutation = trpc.vote.cast.useMutation({
    onSuccess: (data) => {
      // Update with server response
      setOptimisticScore(data.voteScore);
      setOptimisticUserVote(data.userVote);
      // Invalidate queries to refresh data
      void utils.prompt.getAll.invalidate();
    },
    onError: () => {
      // Revert optimistic update on error
      setOptimisticScore(initialScore);
      setOptimisticUserVote(initialUserVote);
    },
  });

  const handleVote = (type: "UP" | "DOWN") => {
    if (!session) return;

    // Calculate optimistic updates
    let newScore = optimisticScore;
    let newUserVote: "UP" | "DOWN" | null = type;

    if (optimisticUserVote === null) {
      // No existing vote - add vote
      newScore = type === "UP" ? newScore + 1 : newScore - 1;
    } else if (optimisticUserVote === type) {
      // Same type clicked - remove vote
      newScore = type === "UP" ? newScore - 1 : newScore + 1;
      newUserVote = null;
    } else {
      // Different type clicked - change vote (swing by 2)
      newScore = type === "UP" ? newScore + 2 : newScore - 2;
    }

    // Apply optimistic updates
    setOptimisticScore(newScore);
    setOptimisticUserVote(newUserVote);

    // Execute mutation
    voteMutation.mutate({ promptId, type });
  };

  const isAuthenticated = !!session;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote("UP")}
        disabled={!isAuthenticated || voteMutation.isPending}
        className={cn(
          "h-8 w-8",
          optimisticUserVote === "UP" &&
            "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        aria-label="Upvote"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      <span
        className={cn(
          "min-w-[2rem] text-center text-sm font-medium",
          optimisticUserVote === "UP" && "text-primary",
          optimisticUserVote === "DOWN" && "text-destructive"
        )}
      >
        {optimisticScore}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote("DOWN")}
        disabled={!isAuthenticated || voteMutation.isPending}
        className={cn(
          "h-8 w-8",
          optimisticUserVote === "DOWN" &&
            "bg-destructive/10 text-destructive hover:bg-destructive/20"
        )}
        aria-label="Downvote"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
