import type { Metadata } from 'next';
import CertificationsClient from './CertificationsClient';

export const metadata: Metadata = {
  title: 'Free Certifications - Online Courses & Skills Development | India Jobs',
  description: 'Discover free certifications and online courses from top providers. Enhance your skills with free courses in technology, business, marketing, and more. Boost your career with professional certifications.',
  keywords: 'free certifications, online courses, free courses, professional certifications, skills development, technology courses, business courses, marketing courses, career development',
  authors: [{ name: 'India Jobs Team' }],
  openGraph: {
    title: 'Free Certifications - Online Courses & Skills Development',
    description: 'Discover free certifications and online courses from top providers. Enhance your skills with free courses in technology, business, marketing, and more. Boost your career with professional certifications.',
    type: 'website',
    locale: 'en_US',
    url: 'https://india-jobs.in/certifications',
    siteName: 'India Jobs',
    images: [
      {
        url: '/IndiaJobs.png',
        width: 1200,
        height: 630,
        alt: 'Free Certifications - Online Courses & Skills Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Certifications - Online Courses & Skills Development',
    description: 'Discover free certifications and online courses from top providers. Enhance your skills with free courses in technology, business, marketing, and more.',
    images: ['/IndiaJobs.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://india-jobs.in/certifications',
  },
};

export default function CertificationsPage() {
  return <CertificationsClient />;
} 