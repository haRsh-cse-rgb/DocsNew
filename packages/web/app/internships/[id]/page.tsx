import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InternshipDetailClient from './InternshipDetailClient';
import axios from 'axios';

interface Props {
  params: { id: string };
}

async function getInternship(id: string) {
  try {
    const response = await axios.get(`https://api.india-jobs.in/api/v1/internships/${id}`);
    return response.data.internship; // Fix: extract the internship object
  } catch (error) {
    console.error('Error fetching internship:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const internship = await getInternship(params.id);
  
  if (!internship) {
    return {
      title: 'Internship Not Found | India Jobs',
      description: 'The requested internship could not be found. Browse other internship opportunities on India Jobs.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = internship.title || 'Internship Details';
  const company = internship.company || 'Company';
  const location = internship.location || 'India';
  const description = internship.description || 'View internship details and apply for this position.';
  
  // Create a more detailed description
  const detailedDescription = `${title} internship at ${company} in ${location}. ${description.substring(0, 150)}...`;
  
  // Create keywords from internship data
  const keywords = [
    title,
    company,
    location,
    'internships in India',
    'internship opportunities',
    'student internships',
    'training programs',
    'career development'
  ].filter(Boolean).join(', ');

  return {
    title: `${title} Internship at ${company} - ${location} | India Jobs`,
    description: detailedDescription,
    keywords: keywords,
    authors: [{ name: 'India Jobs Team' }],
    openGraph: {
      title: `${title} Internship at ${company}`,
      description: detailedDescription,
      type: 'website',
      locale: 'en_US',
      url: `https://india-jobs.in/internships/${params.id}`,
      siteName: 'India Jobs',
      images: [
        {
          url: '/IndiaJobs.png',
          width: 1200,
          height: 630,
          alt: `${title} Internship at ${company}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} Internship at ${company}`,
      description: detailedDescription,
      images: ['/IndiaJobs.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://india-jobs.in/internships/${params.id}`,
    },
  };
}

export default async function InternshipDetailPage({ params }: Props) {
  const internship = await getInternship(params.id);
  
  if (!internship) {
    notFound();
  }

  return <InternshipDetailClient internship={internship} />;
} 