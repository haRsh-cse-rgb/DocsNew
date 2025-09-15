import type { Metadata } from 'next';
import WalkingClient from './WalkingClient';

export const metadata: Metadata = {
  title: 'Walk-in Interviews - Latest Walk-in Jobs in India | India Jobs',
  description: 'Find walk-in interview opportunities across India. Discover immediate job openings, walk-in drives, and direct hiring events from top companies. Apply directly without waiting.',
  keywords: 'walk-in interviews, walk-in jobs, walk-in drives, immediate hiring, direct recruitment, walk-in opportunities, job fairs, hiring events, India walk-ins',
  authors: [{ name: 'India Jobs Team' }],
  openGraph: {
    title: 'Walk-in Interviews - Latest Walk-in Jobs in India',
    description: 'Find walk-in interview opportunities across India. Discover immediate job openings, walk-in drives, and direct hiring events from top companies. Apply directly without waiting.',
    type: 'website',
    locale: 'en_US',
    url: 'https://india-jobs.in/walking',
    siteName: 'India Jobs',
    images: [
      {
        url: '/IndiaJobs.png',
        width: 1200,
        height: 630,
        alt: 'Walk-in Interviews - Latest Walk-in Jobs in India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Walk-in Interviews - Latest Walk-in Jobs in India',
    description: 'Find walk-in interview opportunities across India. Discover immediate job openings, walk-in drives, and direct hiring events from top companies.',
    images: ['/IndiaJobs.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://india-jobs.in/walking',
  },
};

export default function WalkingPage() {
  return <WalkingClient />;
} 