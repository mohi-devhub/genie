import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "~/lib/auth/SessionProvider";
import { TRPCProvider } from "~/lib/trpc/TRPCProvider";
import { Header } from "~/components/Header";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Lokha - AI Prompt Library",
    template: "%s | Lokha",
  },
  description: "Browse, submit, and vote on AI prompts. A community-driven library for discovering the best prompts for GPT-4, Claude, Gemini, and more.",
  keywords: ["AI prompts", "GPT-4", "Claude", "Gemini", "prompt engineering", "AI tools", "Lokha"],
  authors: [{ name: "Lokha Team" }],
  creator: "Lokha",
  metadataBase: new URL("https://lokha.tech"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lokha.tech",
    siteName: "Lokha",
    title: "Lokha - AI Prompt Library",
    description: "Browse, submit, and vote on AI prompts. A community-driven library for discovering the best prompts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lokha - AI Prompt Library",
    description: "Browse, submit, and vote on AI prompts. A community-driven library for discovering the best prompts.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>
        <SessionProvider>
          <TRPCProvider>
            <Header />
            {children}
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
