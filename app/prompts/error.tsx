"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/Header";

export default function PromptsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Prompts page error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Failed to load prompts
            </h1>
            <p className="text-muted-foreground">
              There was an error loading the prompts. This might be due to a connection issue.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button onClick={() => reset()}>
              Try again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Go home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
