import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CopilotDemoTour from "@/components/demo/CopilotDemoTour";

export const metadata: Metadata = {
  title: "AI Financial Safety & Lending Copilot",
  description: "Decision-Support Platform with ML Risk Prediction, Policy RAG, and Human Governance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] font-sans selection:bg-yellow-400">
        <CopilotDemoTour />
        <Navbar />
        {children}
      </body>
    </html>
  );
}


