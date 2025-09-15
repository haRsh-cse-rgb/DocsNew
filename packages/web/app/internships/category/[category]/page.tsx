import type { Metadata } from 'next';
import CategoryInternshipsClient from './CategoryInternshipsClient';

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  
  return {
    title: `${category} Internships in India - Latest ${category} Internship Opportunities | India Jobs`,
    description: `Find latest ${category} internships and opportunities in India. Discover ${category} internship positions, apply online, and kickstart your career in ${category} field.`,
    keywords: `${category} internships, ${category} internship opportunities, ${category} student positions, ${category} training programs, India ${category} internships`,
    authors: [{ name: 'India Jobs Team' }],
    openGraph: {
      title: `${category} Internships in India - Latest ${category} Internship Opportunities`,
      description: `Find latest ${category} internships and opportunities in India. Discover ${category} internship positions, apply online, and kickstart your career.`,
      type: 'website',
      locale: 'en_US',
      url: `https://india-jobs.in/internships/category/${encodeURIComponent(category)}`,
      siteName: 'India Jobs',
      images: [
        {
          url: '/IndiaJobs.png',
          width: 1200,
          height: 630,
          alt: `${category} Internships in India`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category} Internships in India - Latest ${category} Internship Opportunities`,
      description: `Find latest ${category} internships and opportunities in India. Discover ${category} internship positions, apply online, and kickstart your career.`,
      images: ['/IndiaJobs.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://india-jobs.in/internships/category/${encodeURIComponent(category)}`,
    },
  };
}

export default function CategoryInternshipsPage({ params }: Props) {
  return <CategoryInternshipsClient category={decodeURIComponent(params.category)} />;
} 