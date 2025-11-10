"use client";

/**
 * Header component with site title, submit button, and login button.
 * Sticky positioned at the top of the page.
 */
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LoginButton } from "./LoginButton";
import { SubmitPromptDialog } from "./SubmitPromptDialog";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={session ? "/prompts" : "/"}>
            <h1 className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
              AI Prompt Library
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <SubmitPromptDialog />
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
