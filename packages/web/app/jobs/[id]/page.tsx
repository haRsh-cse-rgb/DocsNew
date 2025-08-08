import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailClient from './JobDetailClient';
import axios from 'axios';

interface Props {
  params: { id: string };
}

async function getJob(id: string) {
  try {
    const response = await axios.get(`${process.env.API_BASE_URL || 'http://localhost:5001/api/v1'}/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = await getJob(params.id);
  const title = job?.title || 'Job Details';
  return {
    title: `${title} - India Jobs`,
    description: job?.description || 'View job details and apply for this position.',
  };
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJob(params.id);
  
  if (!job) {
    notFound();
  }

  return <JobDetailClient job={job} />;
}