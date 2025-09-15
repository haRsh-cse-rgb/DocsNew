import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Jobs in India - Find Latest Job Opportunities | India Jobs',
  description: 'Discover thousands of job opportunities across India. Find private sector jobs, remote work, fresher positions, and career opportunities in various industries.',
  keywords: 'jobs in India, private sector jobs, remote jobs, fresher jobs, career opportunities, job search India, employment opportunities',
  authors: [{ name: 'India Jobs Team' }],
  openGraph: {
    title: 'Jobs in India - Find Latest Job Opportunities',
    description: 'Discover thousands of job opportunities across India. Find private sector jobs, remote work, fresher positions, and career opportunities.',
    type: 'website',
    locale: 'en_US',
    url: 'https://india-jobs.in/jobs',
    siteName: 'India Jobs',
    images: [
      {
        url: '/IndiaJobs.png',
        width: 1200,
        height: 630,
        alt: 'Jobs in India - Find Latest Job Opportunities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobs in India - Find Latest Job Opportunities',
    description: 'Discover thousands of job opportunities across India. Find private sector jobs, remote work, fresher positions, and career opportunities.',
    images: ['/IndiaJobs.png'],
  },
  robots: {
    index: true,
    follow: true,
  },    
  alternates: {
    canonical: 'https://india-jobs.in/jobs',
  },
};

export default function JobsPage() {
  redirect('/');
} 