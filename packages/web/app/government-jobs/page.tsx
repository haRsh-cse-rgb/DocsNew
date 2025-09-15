import type { Metadata } from 'next';
import GovernmentJobsClient from './GovernmentJobsClient';

export const metadata: Metadata = {
  title: 'Government Jobs in India - Latest Sarkari Naukri | India Jobs',
  description: 'Find latest government jobs and sarkari naukri opportunities across India. Apply for central and state government positions, PSU jobs, and public sector vacancies.',
  keywords: 'government jobs, sarkari naukri, central government jobs, state government jobs, PSU jobs, public sector jobs, government vacancies, India government jobs',
  authors: [{ name: 'India Jobs Team' }],
  openGraph: {
    title: 'Government Jobs in India - Latest Sarkari Naukri',
    description: 'Find latest government jobs and sarkari naukri opportunities across India. Apply for central and state government positions, PSU jobs, and public sector vacancies.',
    type: 'website',
    locale: 'en_US',
    url: 'https://india-jobs.in/government-jobs',
    siteName: 'India Jobs',
    images: [
      {
        url: '/IndiaJobs.png',
        width: 1200,
        height: 630,
        alt: 'Government Jobs in India - Latest Sarkari Naukri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Jobs in India - Latest Sarkari Naukri',
    description: 'Find latest government jobs and sarkari naukri opportunities across India. Apply for central and state government positions, PSU jobs, and public sector vacancies.',
    images: ['/IndiaJobs.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://india-jobs.in/government-jobs',
  },
};

export default function GovernmentJobsPage() {
  return <GovernmentJobsClient />;
} 