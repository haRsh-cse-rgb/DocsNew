import type { Metadata } from 'next';
import CategoryJobsClient from './CategoryJobsClient';

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  
  return {
    title: `${category} Jobs in India - Latest ${category} Opportunities | India Jobs`,
    description: `Find latest ${category} jobs and career opportunities in India. Discover ${category} positions, apply online, and advance your career in ${category} field.`,
    keywords: `${category} jobs, ${category} careers, ${category} opportunities, ${category} positions, ${category} employment, India ${category} jobs`,
    authors: [{ name: 'India Jobs Team' }],
    openGraph: {
      title: `${category} Jobs in India - Latest ${category} Opportunities`,
      description: `Find latest ${category} jobs and career opportunities in India. Discover ${category} positions, apply online, and advance your career.`,
      type: 'website',
      locale: 'en_US',
      url: `https://india-jobs.in/jobs/category/${encodeURIComponent(category)}`,
      siteName: 'India Jobs',
      images: [
        {
          url: '/IndiaJobs.png',
          width: 1200,
          height: 630,
          alt: `${category} Jobs in India`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category} Jobs in India - Latest ${category} Opportunities`,
      description: `Find latest ${category} jobs and career opportunities in India. Discover ${category} positions, apply online, and advance your career.`,
      images: ['/IndiaJobs.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://india-jobs.in/jobs/category/${encodeURIComponent(category)}`,
    },
  };
}

export default function CategoryJobsPage({ params }: Props) {
  return <CategoryJobsClient category={decodeURIComponent(params.category)} />;
} 