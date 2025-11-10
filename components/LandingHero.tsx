"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { SubmitPromptDialog } from "~/components/SubmitPromptDialog";

const FEATURED_PROMPTS = [
  "Write a compelling product description for...",
  "Debug this Python code that...",
  "Create a marketing email for...",
  "Explain quantum computing to a 10-year-old",
  "Generate test cases for...",
  "Refactor this code to be more efficient...",
];

export function LandingHero() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentPromptIndex((prev) => (prev + 1) % FEATURED_PROMPTS.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-20 h-72 w-72 animate-float rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-4 top-40 h-96 w-96 animate-float rounded-full bg-primary/5 blur-3xl [animation-delay:1s]" />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Discover the Best
            <br />
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              AI Prompts
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            A community-driven library of effective prompts for GPT, Claude, Gemini, and more.
            <br />
            Share, discover, and vote on the prompts that work.
          </p>

          {/* Rotating prompt preview */}
          <div className="mb-10 flex min-h-[80px] items-center justify-center">
            <div
              className={`max-w-2xl rounded-lg border bg-card p-6 shadow-lg transition-all duration-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="font-mono text-sm text-muted-foreground md:text-base">
                "{FEATURED_PROMPTS[currentPromptIndex]}"
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SubmitPromptDialog />
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-8">
            <div className="animate-fade-in [animation-delay:200ms]">
              <div className="text-3xl font-bold md:text-4xl">1000+</div>
              <div className="text-sm text-muted-foreground">Prompts</div>
            </div>
            <div className="animate-fade-in [animation-delay:400ms]">
              <div className="text-3xl font-bold md:text-4xl">8</div>
              <div className="text-sm text-muted-foreground">AI Models</div>
            </div>
            <div className="animate-fade-in [animation-delay:600ms]">
              <div className="text-3xl font-bold md:text-4xl">500+</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
