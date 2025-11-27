"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground">
            {process.env.NODE_ENV === "development" 
              ? error.message 
              : "We encountered an unexpected error. Please try again."}
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

        {process.env.NODE_ENV === "development" && error.stack && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm font-medium">
              Error details (development only)
            </summary>
            <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-xs">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
