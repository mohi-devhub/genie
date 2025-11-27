import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { LandingHero } from "~/components/LandingHero";
import { PromptShowcase } from "~/components/PromptShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lokha - Discover and Share AI Prompts",
  description: "Browse, submit, and vote on AI prompts for various models and categories. A community-driven platform for discovering effective AI prompts.",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to prompts page
  if (session) {
    redirect("/prompts");
  }

  return (
    <main>
      <LandingHero />
      <PromptShowcase />
    </main>
  );
}
