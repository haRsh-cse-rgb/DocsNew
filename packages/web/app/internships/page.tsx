import type { Metadata } from 'next';
import InternshipsClient from './InternshipsClient';

export const metadata: Metadata = {
  title: 'Internships in India - Find Best Internship Opportunities | India Jobs',
  description: 'Discover exciting internship opportunities across India. Find internships in technology, marketing, finance, engineering, and more. Kickstart your career with top companies.',
  keywords: 'internships in India, summer internships, winter internships, technology internships, marketing internships, engineering internships, fresher internships, student opportunities',
  authors: [{ name: 'India Jobs Team' }],
  openGraph: {
    title: 'Internships in India - Find Best Internship Opportunities',
    description: 'Discover exciting internship opportunities across India. Find internships in technology, marketing, finance, engineering, and more. Kickstart your career with top companies.',
    type: 'website',
    locale: 'en_US',
    url: 'https://india-jobs.in/internships',
    siteName: 'India Jobs',
    images: [
      {
        url: '/IndiaJobs.png',
        width: 1200,
        height: 630,
        alt: 'Internships in India - Find Best Internship Opportunities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Internships in India - Find Best Internship Opportunities',
    description: 'Discover exciting internship opportunities across India. Find internships in technology, marketing, finance, engineering, and more.',
    images: ['/IndiaJobs.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://india-jobs.in/internships',
  },
};

export default function InternshipsPage() {
  return <InternshipsClient />;
} 