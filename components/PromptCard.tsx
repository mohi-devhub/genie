"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CopyButton } from "~/components/CopyButton";
import { VoteControl } from "~/components/VoteControl";
import { cn } from "~/lib/utils";

interface PromptCardProps {
  prompt: {
    id: string;
    createdAt: Date;
    title: string;
    promptText: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    category: {
      id: string;
      name: string;
    };
    model: {
      id: string;
      name: string;
    };
    voteScore: number;
    currentUserVote: "UP" | "DOWN" | null;
  };
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{prompt.title}</CardTitle>
        <CardDescription>
          by {prompt.author.name ?? "Anonymous"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <p
          className={cn(
            "whitespace-pre-wrap text-sm",
            !isExpanded && "line-clamp-3"
          )}
        >
          {prompt.promptText}
        </p>
        {prompt.promptText.length > 150 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 h-auto p-0 text-sm font-normal text-primary hover:bg-transparent hover:underline"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        )}
      </CardContent>

      <CardFooter className="flex-wrap gap-3">
        {/* Category and Model Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {prompt.category.name}
          </span>
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {prompt.model.name}
          </span>
        </div>

        {/* Copy and Vote Controls */}
        <div className="ml-auto flex items-center gap-2">
          <CopyButton textToCopy={prompt.promptText} />
          <VoteControl
            promptId={prompt.id}
            initialScore={prompt.voteScore}
            initialUserVote={prompt.currentUserVote}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
