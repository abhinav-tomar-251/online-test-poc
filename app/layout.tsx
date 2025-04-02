"use client";
import { Suspense, useEffect } from "react";
import { Metadata, Viewport } from "next";
import { getRedirectRoute, isPWA } from "./shared/lib/pwa";
import { useRouter } from "next/navigation";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#000000' },
    { media: '(prefers-color-scheme: dark)', color: '#ffffff' }
  ]
}

export const metadata: Metadata = {
  title: "Test Maker",
  description: "Create and share tests with ease",
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['test', 'maker', 'test maker', 'test creator', 'test creator'],
  authors: [{ name: 'Abhinav Tomar', url: 'https://github.com/abhinav-tomar-251' }],
  icons: [
    { rel: "apple-touch-icon", url: "/icons/icon-512.png" },
    { rel: "icon", url: "/icons/icon-512.png" },
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
        <link rel="icon" href="/icons/icon-512.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <PWARedirectHandler />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

// Component to handle PWA deep links
function PWARedirectHandler() {
  const router = useRouter();
  
  useEffect(() => {
    // Only run in PWA mode
    if (isPWA()) {
      // Check if there's a redirect route
      const redirectRoute = getRedirectRoute();
      if (redirectRoute) {
        // Navigate to the route
        router.push(redirectRoute);
      }
    }
  }, [router]);
  
  return null;
}
