import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import FloatingSocialButtons from './components/FloatingSocialButtons';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'India Jobs - Find Your Dream Job',
  description: 'Your trusted platform for finding the best job opportunities across India. From private sector jobs to government positions, internships to walk-ins.',
  keywords: 'jobs, careers, employment, job search, government jobs, sarkari jobs, internships, walk-ins, India jobs',
  authors: [{ name: 'India Jobs Team' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'India Jobs - Find Your Dream Job',
    description: 'Your trusted platform for finding the best job opportunities across India',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/IndiaJobs.png',
        width: 1200,
        height: 630,
        alt: 'India Jobs Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Jobs - Find Your Dream Job',
    description: 'Your trusted platform for finding the best job opportunities across India',
    images: ['/IndiaJobs.png'],
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        {children}
        <FloatingSocialButtons />
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