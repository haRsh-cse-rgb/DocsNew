import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailClient from './JobDetailClient';

interface Props {
  params: { id: string };
}

async function getJob(id: string) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000/api/v1'}/jobs/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.id);
  
  if (!job) {
    return {
      title: 'Job Not Found - JobQuest',
    };
  }

  return {
    title: `${job.role} at ${job.companyName} in ${job.location} - JobQuest`,
    description: job.jobDescription.substring(0, 160) + '...',
    openGraph: {
      title: `${job.role} at ${job.companyName}`,
      description: job.jobDescription.substring(0, 160) + '...',
      type: 'article',
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