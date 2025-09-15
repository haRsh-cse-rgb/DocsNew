import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobFilters from './components/JobFilters';
import JobGrid from './components/JobGrid';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

export const metadata: Metadata = {
  title: 'India Jobs - Find Your Dream Job | Best Job Opportunities in India',
  description: 'Discover the best job opportunities across India. Find private sector jobs, government positions, internships, and walk-in interviews. Your trusted platform for career growth.',
  keywords: 'jobs in India, careers, employment, job search, government jobs, sarkari jobs, internships, walk-ins, private sector jobs, remote jobs, fresher jobs',
  authors: [{ name: 'India Jobs Team' }],
  openGraph: {
    title: 'India Jobs - Find Your Dream Job',
    description: 'Discover the best job opportunities across India. Find private sector jobs, government positions, internships, and walk-in interviews.',
    type: 'website',
    locale: 'en_US',
    url: 'https://india-jobs.in',
    siteName: 'India Jobs',
    images: [
      {
        url: '/IndiaJobs.png',
        width: 1200,
        height: 630,
        alt: 'India Jobs - Find Your Dream Job',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Jobs - Find Your Dream Job',
    description: 'Discover the best job opportunities across India. Find private sector jobs, government positions, internships, and walk-in interviews.',
    images: ['/IndiaJobs.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://india-jobs.in',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <Suspense fallback={<LoadingSpinner />}>
                <JobFilters />
              </Suspense>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <JobGrid />
            </Suspense>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}