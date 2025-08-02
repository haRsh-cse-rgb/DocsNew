'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  MapPinIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '../../types';
import CVAnalysisModal from '../../components/CVAnalysisModal';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';

interface JobDetailClientProps {
  job: Job;
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const [showCVAnalysis, setShowCVAnalysis] = useState(false);
  const router = useRouter();

  const postedDate = new Date(job.postedOn);
  const expiresDate = new Date(job.expiresOn);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  const expiresIn = formatDistanceToNow(expiresDate, { addSuffix: true });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.role} at ${job.companyName}`,
          text: `Check out this job opportunity: ${job.role} at ${job.companyName} in ${job.location}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    // In a real app, this would save to user's bookmarks
    toast.success('Job bookmarked! (Feature coming soon)');
  };

  function parseJobDescription(desc?: string) {
    if (!desc) return [];
    // Split by ';' for sections
    return desc.split(';').map(section => {
      const [heading, ...rest] = section.split(':');
      return {
        heading: rest.length ? heading.trim() : null,
        content: rest.length ? rest.join(':').split(',').map(s => s.trim()).filter(Boolean) : [heading.trim()]
      };
    }).filter(item => item.content.length > 0);
  }

  const descriptionSections = parseJobDescription(job.jobDescription);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Job Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={job.companyLogo || `https://logo.clearbit.com/${job.companyName.toLowerCase().replace(/\s+/g, '')}.com`}
                    alt={`${job.companyName} logo`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0OCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPko8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
              </div>

              {/* Job Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.role}</h1>
                    <h2 className="text-xl text-gray-700 font-semibold">{job.companyName}</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="badge-primary">{job.category}</span>
                    <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Job Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CurrencyDollarIcon className="h-5 w-5" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Posted {timeAgo}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={job.originalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center justify-center space-x-2 flex-1"
                  >
                    <span>Apply Now</span>
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </a>
                  
                  <button
                    onClick={() => setShowCVAnalysis(true)}
                    className="btn-outline flex items-center justify-center space-x-2 flex-1"
                  >
                    <SparklesIcon className="h-5 w-5" />
                    <span>Analyze CV</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <ShareIcon className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                  
                  <button
                    onClick={handleBookmark}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <BookmarkIcon className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
                <div className="prose prose-gray max-w-none">
                  {descriptionSections.length > 0 ? (
                    descriptionSections.map((section, idx) => (
                      <div key={idx} className="mb-3">
                        {section.heading && (
                          <div className="font-bold text-blue-700 mb-1">{section.heading}</div>
                        )}
                        <ul className="list-disc pl-5">
                          {section.content.map((point, i) => (
                            <li key={i} className="text-gray-800 text-base">{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-600">No description provided.</span>
                  )}
                </div>
              </div>

              {/* Skills & Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="badge-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-4">
                {job.experience && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Experience</dt>
                      <dd className="text-sm text-gray-900">{job.experience}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Salary</dt>
                    <dd className="text-sm text-gray-900">{job.salary}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="text-sm text-gray-900">{job.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="text-sm text-gray-900">{job.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Posted</dt>
                    <dd className="text-sm text-gray-900">{timeAgo}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Expires</dt>
                    <dd className="text-sm text-gray-900">{expiresIn}</dd>
                  </div>
                  
                  
                  
                </div>
              </div>

              {/* Batch Information */}
              {job.batch && job.batch.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suitable For</h3>
                  <div className="space-y-2">
                    {job.batch.map((year, index) => (
                      <span key={index} className="badge-warning block text-center">
                        {year} Batch
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.companyName}</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={job.companyLogo || `https://logo.clearbit.com/${job.companyName.toLowerCase().replace(/\s+/g, '')}.com`}
                      alt={`${job.companyName} logo`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjI0IiB5PSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPko8L3RleHQ+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{job.companyName}</h4>
                    <p className="text-sm text-gray-600">Technology Company</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Learn more about this opportunity by visiting the company's official job posting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CVAnalysisModal
        isOpen={showCVAnalysis}
        onClose={() => setShowCVAnalysis(false)}
        job={job}
      />
    </>
  );
}