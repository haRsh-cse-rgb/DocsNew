import type { Metadata } from 'next';
import WalkingCategoryClient from './WalkingCategoryClient';

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  
  return {
    title: `${category} Walk-in Interviews in India - Latest ${category} Walk-in Jobs | India Jobs`,
    description: `Find latest ${category} walk-in interview opportunities across India. Discover ${category} walk-in drives, immediate hiring events, and direct recruitment opportunities.`,
    keywords: `${category} walk-in interviews, ${category} walk-in jobs, ${category} walk-in drives, ${category} immediate hiring, ${category} direct recruitment, India ${category} walk-ins`,
    authors: [{ name: 'India Jobs Team' }],
    openGraph: {
      title: `${category} Walk-in Interviews in India - Latest ${category} Walk-in Jobs`,
      description: `Find latest ${category} walk-in interview opportunities across India. Discover ${category} walk-in drives, immediate hiring events, and direct recruitment opportunities.`,
      type: 'website',
      locale: 'en_US',
      url: `https://india-jobs.in/walking/category/${encodeURIComponent(category)}`,
      siteName: 'India Jobs',
      images: [
        {
          url: '/IndiaJobs.png',
          width: 1200,
          height: 630,
          alt: `${category} Walk-in Interviews in India`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category} Walk-in Interviews in India - Latest ${category} Walk-in Jobs`,
      description: `Find latest ${category} walk-in interview opportunities across India. Discover ${category} walk-in drives, immediate hiring events, and direct recruitment opportunities.`,
      images: ['/IndiaJobs.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://india-jobs.in/walking/category/${encodeURIComponent(category)}`,
    },
  };
}

export default function WalkingCategoryPage({ params }: Props) {
  return <WalkingCategoryClient category={decodeURIComponent(params.category)} />;
} 