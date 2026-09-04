import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafePay India · AI Voice Money Transfer Simulator",
  description: "Consumer Banking App with Voice-Driven Money Transfer and Behavioral N-Month Safety Verification",
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
