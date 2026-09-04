import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BankMantri · Accessible Family-Protected Voice Banking",
  description: "Accessible voice-first digital banking with Trusted Circle second opinions and zero screen sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F3F4F6] text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
