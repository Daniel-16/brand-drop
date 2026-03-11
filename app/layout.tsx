import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandDrop — Brand Kit in 60 Seconds",
  description: "Your brand kit and social media content — in 60 seconds. No website needed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
