import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/components/QueryProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Torre Radar | Visualize Your Skills',
  description:
    'Interactive skill radar charts for Torre.ai users with percentile analysis and comparison features.',
  keywords: [
    'torre',
    'skills',
    'radar',
    'visualization',
    'percentile',
    'comparison',
  ],
  authors: [{ name: 'Torre Radar Team' }],
  creator: 'Torre Radar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://torre-radar.vercel.app',
    title: 'Torre Radar | Visualize Your Skills',
    description:
      'Interactive skill radar charts for Torre.ai users with percentile analysis and comparison features.',
    siteName: 'Torre Radar',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Torre Radar - Skill Visualization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Torre Radar | Visualize Your Skills',
    description:
      'Interactive skill radar charts for Torre.ai users with percentile analysis.',
    images: ['/og-image.png'],
    creator: '@torreradar',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="relative min-h-screen bg-background">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold">Torre Radar</h1>
                  </div>
                  <ThemeToggle />
                </div>
              </header>
              <main className="container mx-auto px-4 py-8">{children}</main>
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                },
                success: {
                  iconTheme: {
                    primary: 'hsl(var(--primary))',
                    secondary: 'hsl(var(--primary-foreground))',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'hsl(var(--destructive))',
                    secondary: 'hsl(var(--destructive-foreground))',
                  },
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}