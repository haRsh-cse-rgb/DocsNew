import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobQuest - Find Your Dream Job',
  description: 'A scalable, clutter-free job aggregation platform with AI-powered CV analysis and curated job listings.',
  keywords: 'jobs, careers, employment, job search, CV analysis, government jobs, sarkari jobs',
  authors: [{ name: 'JobQuest Team' }],
  openGraph: {
    title: 'JobQuest - Find Your Dream Job',
    description: 'Discover curated job opportunities with AI-powered CV analysis',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobQuest - Find Your Dream Job',
    description: 'Discover curated job opportunities with AI-powered CV analysis',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}