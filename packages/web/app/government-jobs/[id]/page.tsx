import { notFound } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Metadata } from 'next';

function parseDelimited(str?: string): Array<{ category: string; value: string }> {
  if (!str) return [];
  return str.split(';').map((line) => {
    const [category, ...rest] = line.split(':');
    return { category: category?.trim() || '', value: rest.join(':').trim() };
  }).filter(item => item.category && item.value);
}

function parseBullets(str?: string): string[] {
  if (!str) return [];
  return str.split(';').map(line => line.trim()).filter(Boolean);
}

async function getSarkariJob(id: string) {
  try {
    const res = await axios.get(`https://api.india-jobs.in/api/v1/sarkari-jobs/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = await getSarkariJob(params.id);
  
  if (!job) {
    return {
      title: 'Government Job Not Found | India Jobs',
      description: 'The requested government job could not be found. Browse other government job opportunities on India Jobs.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const postName = job.postName || 'Government Job';
  const organization = job.organization || 'Government Organization';
  const description = job.description || 'View government job details and apply for this position.';
  
  // Create a more detailed description
  const detailedDescription = `${postName} at ${organization}. ${description.substring(0, 150)}...`;
  
  // Create keywords from job data
  const keywords = [
    postName,
    organization,
    'government jobs',
    'sarkari naukri',
    'government vacancies',
    'public sector jobs',
    'government recruitment',
    'India government jobs'
  ].filter(Boolean).join(', ');

  return {
    title: `${postName} at ${organization} - Government Job | India Jobs`,
    description: detailedDescription,
    keywords: keywords,
    authors: [{ name: 'India Jobs Team' }],
    openGraph: {
      title: `${postName} at ${organization}`,
      description: detailedDescription,
      type: 'website',
      locale: 'en_US',
      url: `https://india-jobs.in/government-jobs/${params.id}`,
      siteName: 'India Jobs',
      images: [
        {
          url: '/IndiaJobs.png',
          width: 1200,
          height: 630,
          alt: `${postName} at ${organization}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${postName} at ${organization}`,
      description: detailedDescription,
      images: ['/IndiaJobs.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://india-jobs.in/government-jobs/${params.id}`,
    },
  };
}

export default async function GovernmentJobDetailPage({ params }: { params: { id: string } }) {
  const job = await getSarkariJob(params.id);
  if (!job) notFound();

  const feeRows = parseDelimited(job.applicationFee);
  const vacancyRows = parseDelimited(job.vacancyDetails);
  const eligibilityBullets = job.eligibility && job.eligibility.includes(';') ? parseBullets(job.eligibility) : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link 
              href="/government-jobs"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Government Jobs</span>
            </Link>
          </div>
      <div className="mb-6 flex items-center space-x-3">
        <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900">{job.postName}</h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <tbody>
            <tr className="bg-gray-50">
              <td className="font-semibold py-3 px-4 w-48 border-b border-gray-100">Post Name</td>
              <td className="py-3 px-4 border-b border-gray-100 text-lg font-bold text-gray-900">{job.postName || '-'}</td>
            </tr>
            <tr>
              <td className="font-semibold py-3 px-4 border-b border-gray-100">Organization</td>
              <td className="py-3 px-4 border-b border-gray-100">{job.organization || '-'}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="font-semibold py-3 px-4 border-b border-gray-100">Advertisement No</td>
              <td className="py-3 px-4 border-b border-gray-100">{job.advertisementNo || '-'}</td>
            </tr>
            <tr>
              <td className="font-semibold py-3 px-4 border-b border-gray-100">Status</td>
              <td className="py-3 px-4 border-b border-gray-100 capitalize">{job.status || '-'}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="font-semibold py-3 px-4 border-b border-gray-100 align-top">Vacancy Details</td>
              <td className="py-3 px-4 border-b border-gray-100">
                {vacancyRows.length > 0 ? (
                  <table className="border border-blue-300 rounded w-auto mb-2 text-sm">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-2 py-1 border-b border-blue-200 text-left">Category</th>
                        <th className="px-2 py-1 border-b border-blue-200 text-left">No. of Posts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vacancyRows.map((row, idx) => (
                        <tr key={idx} className="odd:bg-white even:bg-blue-50">
                          <td className="px-2 py-1 border-b border-blue-100 font-semibold whitespace-nowrap">{row.category}</td>
                          <td className="px-2 py-1 border-b border-blue-100 text-blue-800 font-bold whitespace-nowrap">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <span>{job.vacancyDetails || '-'}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-3 px-4 border-b border-gray-100 align-top">Important Dates</td>
              <td className="py-3 px-4 border-b border-gray-100">
                <table className="border border-green-300 rounded w-auto mb-2 text-sm">
                  <tbody>
                    <tr>
                      <td className="px-2 py-1 border-b border-green-100 font-semibold">Application Start</td>
                      <td className="px-2 py-1 border-b border-green-100 text-green-800 font-bold whitespace-nowrap">{job.importantDates?.applicationStart || '-'}</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 border-b border-green-100 font-semibold">Application End</td>
                      <td className="px-2 py-1 border-b border-green-100 text-green-800 font-bold whitespace-nowrap">{job.importantDates?.applicationEnd || '-'}</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 border-b border-green-100 font-semibold">Exam Date</td>
                      <td className="px-2 py-1 border-b border-green-100 text-green-800 font-bold whitespace-nowrap">{job.importantDates?.examDate || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="font-semibold py-3 px-4 border-b border-gray-100 align-top">Application Fee</td>
              <td className="py-3 px-4 border-b border-gray-100">
                {feeRows.length > 0 ? (
                  <table className="border border-purple-300 rounded w-auto mb-2 text-sm">
                    <tbody>
                      {feeRows.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-2 py-1 border-b border-purple-100 font-semibold whitespace-nowrap">{row.category}</td>
                          <td className="px-2 py-1 border-b border-purple-100 text-purple-800 font-bold whitespace-nowrap">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <span>{job.applicationFee || '-'}</span>
                )}
              </td>
            </tr>
            <tr>
              {/* <td className="font-semibold py-3 px-4 border-b border-gray-100 align-top">Eligibility</td>
              <td className="py-3 px-4 border-b border-gray-100">
                {eligibilityBullets ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {eligibilityBullets.map((item, idx) => (
                      <li key={idx} className="text-gray-800">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{job.eligibility || '-'}</span>
                )}
              </td> */}

<td className="font-semibold py-3 px-4 border-b border-gray-100 align-top">
  Eligibility
</td>
<td className="py-3 px-4 border-b border-gray-100">
  <ul className="list-disc pl-5 space-y-1">
    {(eligibilityBullets || job.eligibility?.split(";")).map((item, idx) => (
      <li key={idx} className="text-gray-800">
        {item.trim()}
      </li>
    ))}
  </ul>
</td>

            </tr>
            <tr className="bg-gray-50">
              <td className="font-semibold py-3 px-4 border-b border-gray-100">Official Website</td>
              <td className="py-3 px-4 border-b border-gray-100">
                {job.officialWebsite ? <a href={job.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{job.officialWebsite}</a> : '-'}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-3 px-4 border-b border-gray-100">Notification Link</td>
              <td className="py-3 px-4 border-b border-gray-100">
                {job.notificationLink ? <a href={job.notificationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a> : '-'}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="font-semibold py-3 px-4 border-b border-gray-100">Apply Link</td>
              <td className="py-3 px-4 border-b border-gray-100">
                {job.applyLink ? <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Apply Online</a> : '-'}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-3 px-4 border-b border-gray-100">Result Link</td>
              <td className="py-3 px-4 border-b border-gray-100">
                {job.resultLink ? <a href={job.resultLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Result</a> : '-'}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="font-semibold py-3 px-4">Created At</td>
              <td className="py-3 px-4">{job.createdAt ? new Date(job.createdAt).toLocaleString() : '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 