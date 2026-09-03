import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

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
      <body className="min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans selection:bg-[#F5D04C]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
