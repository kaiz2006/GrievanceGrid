import type { Metadata } from "next";
import { Inter, Playfair_Display, Pacifico } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GrievanceGrid — Smart Public Service CRM",
  description:
    "An intelligent command center that captures, routes, and resolves citizen complaints with real-time transparency and AI-powered automation.",
  keywords: [
    "grievance management",
    "public service",
    "CRM",
    "citizen complaints",
    "smart city",
    "government",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${pacifico.variable}`} suppressHydrationWarning>
      <body className="noise-overlay" suppressHydrationWarning>{children}</body>
    </html>
  );
}
