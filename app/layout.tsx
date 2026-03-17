import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter is a clean, professional sans-serif font — readable for non-technical users
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clear Memo",
  description: "Turn messy meeting notes into crisp summaries, action items, and follow-up emails.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
