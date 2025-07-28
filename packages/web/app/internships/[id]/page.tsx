import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InternshipDetailClient from './InternshipDetailClient';
import axios from 'axios';

interface Props {
  params: { id: string };
}

async function getInternship(id: string) {
  try {
    const response = await axios.get(`${process.env.API_BASE_URL || 'http://localhost:5000/api/v1'}/internships/${id}`);
    return response.data.internship; // Fix: extract the internship object
  } catch (error) {
    console.error('Error fetching internship:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const internship = await getInternship(params.id);
  
  if (!internship) {
    return {
      title: 'Internship Not Found - JobQuest',
    };
  }

  return {
    title: `${internship.title} at ${internship.company} in ${internship.location} - JobQuest`,
    description: internship.description ? internship.description.substring(0, 160) + '...' : 'Internship opportunity',
    openGraph: {
      title: `${internship.title} at ${internship.company}`,
      description: internship.description ? internship.description.substring(0, 160) + '...' : 'Internship opportunity',
      type: 'article',
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