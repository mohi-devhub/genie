import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "~/lib/auth/SessionProvider";
import { TRPCProvider } from "~/lib/trpc/TRPCProvider";
import { Header } from "~/components/Header";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Prompt Library",
  description: "Browse, submit, and vote on AI prompts",
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
