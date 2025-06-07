import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Custom Cursor | Interactive Cursor Components for React",
  description: "Discover @yhattav/react-component-cursor - A lightweight, TypeScript-first React library for creating beautiful custom cursors with SSR support. Perfect for interactive websites, games, and creative applications.",
  keywords: [
    "react cursor",
    "custom cursor",
    "react component",
    "typescript",
    "interactive cursor",
    "mouse tracker",
    "react library",
    "frontend",
    "UI components",
    "SSR support",
    "Next.js compatible"
  ],
  authors: [{ name: "Yonatan Hattav" }],
  creator: "Yonatan Hattav",
  publisher: "Yonatan Hattav",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yhattav.github.io'),
  alternates: {
    canonical: '/react-component-cursor',
  },
  openGraph: {
    title: "React Custom Cursor | Interactive Cursor Components",
    description: "A lightweight, TypeScript-first React library for creating beautiful custom cursors. Features SSR support, smooth animations, and zero dependencies.",
    url: 'https://yhattav.github.io/react-component-cursor',
    siteName: 'React Custom Cursor',
    images: [
      {
        url: '/react-component-cursor/og-image.png',
        width: 1200,
        height: 630,
        alt: 'React Custom Cursor Library Demo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "React Custom Cursor | Interactive Components",
    description: "Lightweight React library for custom cursors with SSR support",
    images: ['/react-component-cursor/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/react-component-cursor/favicon.ico" />
        <link rel="apple-touch-icon" href="/react-component-cursor/apple-touch-icon.png" />
        <link rel="manifest" href="/react-component-cursor/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "React Custom Cursor",
              "description": "A lightweight, TypeScript-first React library for creating beautiful custom cursors with SSR support",
              "url": "https://yhattav.github.io/react-component-cursor",
              "author": {
                "@type": "Person",
                "name": "Yonatan Hattav"
              },
              "programmingLanguage": "TypeScript",
              "runtimePlatform": "React",
              "operatingSystem": "Cross-platform",
              "applicationCategory": "DeveloperApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
