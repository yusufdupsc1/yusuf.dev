import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1120" }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    template: '%s | Ali Portfolio',
    default: 'Ali Portfolio | Full Stack Developer'
  },
  description: "Modern & Minimal Portfolio showcasing my work in full-stack development, web applications, and software engineering.",
  keywords: ['Portfolio', 'Full Stack Developer', 'Web Development', 'Software Engineer', 'React', 'Next.js'],
  authors: [{ name: 'Ali' }],
  creator: 'Yusuf Ali',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Ali Portfolio | Full Stack Developer',
    description: 'Modern & Minimal Portfolio showcasing my work in full-stack development',
    siteName: 'Ali Portfolio'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Portfolio | Full Stack Developer',
    description: 'Modern & Minimal Portfolio showcasing my work in full-stack development',
    creator: '@yourtwitterhandle'
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={inter.className}
    >
      <head>
        <meta name="theme-color" content="#0B1120" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/fonts/your-custom-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
