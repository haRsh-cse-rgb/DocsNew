import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InternshipDetailClient from './InternshipDetailClient';
import axios from 'axios';

interface Props {
  params: { id: string };
}

async function getInternship(id: string) {
  try {
    const response = await axios.get(`${process.env.API_BASE_URL || 'http://localhost:5001/api/v1'}/internships/${id}`);
    return response.data.internship; // Fix: extract the internship object
  } catch (error) {
    console.error('Error fetching internship:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const internship = await getInternship(params.id);
  const title = internship?.title || 'Internship Details';
  return {
    title: `${title} - India Jobs`,
    description: internship?.description || 'View internship details and apply for this position.',
  };
}

export default async function InternshipDetailPage({ params }: Props) {
  const internship = await getInternship(params.id);
  
  if (!internship) {
    notFound();
  }

  return <InternshipDetailClient internship={internship} />;
} 