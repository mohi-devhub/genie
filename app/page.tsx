import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { LandingHero } from "~/components/LandingHero";
import { PromptShowcase } from "~/components/PromptShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Genie - Discover and Share AI Prompts",
  description: "Browse, submit, and vote on AI prompts for various models and categories. A community-driven platform for discovering effective AI prompts.",
};

// Force dynamic rendering to check auth on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
