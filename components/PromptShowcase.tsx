"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";

const DEMO_PROMPTS = [
  {
    title: "Professional Email Writer",
    preview: "You are a professional email writer. Write a clear, concise, and polite email...",
    category: "Writing",
    model: "GPT-4",
    votes: 12,
  },
  {
    title: "Code Review Assistant",
    preview: "Review the following code for best practices, potential bugs, and performance...",
    category: "Coding",
    model: "Claude 3 Opus",
    votes: 15,
  },
  {
    title: "Social Media Caption Generator",
    preview: "Create 5 engaging social media captions for [PLATFORM] about [TOPIC]...",
    category: "Marketing",
    model: "GPT-4",
    votes: 8,
  },
  {
    title: "Explain Like I'm Five",
    preview: "Explain [COMPLEX_TOPIC] in simple terms that a 5-year-old would understand...",
    category: "Education",
    model: "Gemini Pro",
    votes: 10,
  },
  {
    title: "Bug Finder and Fixer",
    preview: "Analyze this code and identify any bugs or issues. For each issue found...",
    category: "Coding",
    model: "Claude 3 Opus",
    votes: 14,
  },
  {
    title: "Meeting Summary Generator",
    preview: "Summarize the following meeting notes into a clear, actionable format...",
    category: "Business",
    model: "GPT-4",
    votes: 9,
  },
];

export function PromptShowcase() {

  return (
    <section className="relative overflow-hidden border-t bg-muted/30 py-16">
      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold">Discover Amazing Prompts</h2>
          <p className="text-muted-foreground">
            Sign in to browse, submit, and vote on thousands of AI prompts
          </p>
        </div>

        {/* Scrolling prompt cards */}
        <div className="mb-8 overflow-hidden">
          <div className="flex gap-6 animate-scroll">
            {/* Triple the prompts for seamless infinite loop */}
            {[...DEMO_PROMPTS, ...DEMO_PROMPTS, ...DEMO_PROMPTS].map((prompt, index) => (
              <div
                key={index}
                className="min-w-[350px] flex-shrink-0 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold leading-tight">{prompt.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>↑</span>
                    <span>{prompt.votes}</span>
                  </div>
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {prompt.preview}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 px-2 py-1">
                    {prompt.category}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-1">
                    {prompt.model}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to sign in */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 animate-pulse rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 blur" />
            <Button
              size="lg"
              onClick={() => signIn("google", { callbackUrl: "/prompts" })}
              className="relative flex items-center gap-2"
            >
              Sign in to View All Prompts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Join our community of AI enthusiasts
          </p>
        </div>
      </div>
    </section>
  );
}
