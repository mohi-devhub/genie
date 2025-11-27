import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { api } from "~/lib/trpc/server";
import { PromptGallery } from "~/components/PromptGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Prompts - Lokha",
  description: "Browse and discover AI prompts for various models and categories.",
};

export default async function PromptsPage() {
  const session = await getServerSession(authOptions);

  // Redirect to home if not authenticated
  if (!session) {
    redirect("/");
  }

  // Fetch initial prompts sorted by NEW (most recent)
  const initialPrompts = await api.prompt.getAll({ sortBy: "NEW" });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Prompts</h1>
        <p className="text-muted-foreground">
          Discover, vote, and share AI prompts from the community
        </p>
      </div>
      <PromptGallery initialPrompts={initialPrompts} />
    </main>
  );
}
