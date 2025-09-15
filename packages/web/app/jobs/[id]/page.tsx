import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailClient from './JobDetailClient';
import axios from 'axios';

interface Props {
  params: { id: string };
}

async function getJob(id: string) {
  try {
    const response = await axios.get(`https://api.india-jobs.in/api/v1/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = await getJob(params.id);
  
  if (!job) {
    return {
      title: 'Job Not Found | India Jobs',
      description: 'The requested job could not be found. Browse other job opportunities on India Jobs.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = job.title || 'Job Details';
  const company = job.company || 'Company';
  const location = job.location || 'India';
  const description = job.description || 'View job details and apply for this position.';
  
  // Create a more detailed description
  const detailedDescription = `${title} at ${company} in ${location}. ${description.substring(0, 150)}...`;
  
  // Create keywords from job data
  const keywords = [
    title,
    company,
    location,
    'jobs in India',
    'career opportunities',
    'job application',
    'employment',
    'hiring'
  ].filter(Boolean).join(', ');

  return {
    title: `${title} at ${company} - ${location} | India Jobs`,
    description: detailedDescription,
    keywords: keywords,
    authors: [{ name: 'India Jobs Team' }],
    openGraph: {
      title: `${title} at ${company}`,
      description: detailedDescription,
      type: 'website',
      locale: 'en_US',
      url: `https://india-jobs.in/jobs/${params.id}`,
      siteName: 'India Jobs',
      images: [
        {
          url: '/IndiaJobs.png',
          width: 1200,
          height: 630,
          alt: `${title} at ${company}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} at ${company}`,
      description: detailedDescription,
      images: ['/IndiaJobs.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://india-jobs.in/jobs/${params.id}`,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJob(params.id);
  
  if (!job) {
    notFound();
  }

  return <JobDetailClient job={job} />;
}