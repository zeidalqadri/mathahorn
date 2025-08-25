import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Math Learning Adventure | Interactive Math Game for Kids",
  description: "An adaptive math learning game for children aged 6-12 with personalized challenges, progress tracking, and gamified rewards system.",
  keywords: "math learning, educational games, children math, adaptive learning, CCSS aligned, math practice",
  authors: [{ name: "Math Learning Adventure" }],
  creator: "Math Learning Adventure",
  publisher: "Math Learning Adventure",
  robots: "index, follow",
  openGraph: {
    title: "Math Learning Adventure",
    description: "Transform math learning into an exciting adventure for kids!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Math Learning Adventure",
    description: "Interactive math learning game for children",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen`}
      >
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
