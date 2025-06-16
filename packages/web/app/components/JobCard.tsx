'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  SparklesIcon,
  ExternalLinkIcon 
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '../types';
import CVAnalysisModal from './CVAnalysisModal';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const [showCVAnalysis, setShowCVAnalysis] = useState(false);

  const postedDate = new Date(job.postedOn);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <>
      <div className="card hover:shadow-lg transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={job.companyLogo || `https://logo.clearbit.com/${job.companyName.toLowerCase().replace(/\s+/g, '')}.com`}
                alt={`${job.companyName} logo`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=${job.companyName.charAt(0)}`;
                }}
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  <Link href={`/jobs/${job.jobId}`}>
                    {job.role}
                  </Link>
                </h3>
                <p className="text-lg text-gray-700 font-medium">{job.companyName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="badge-primary">{job.category}</span>
                <span className="badge-secondary">{job.status}</span>
              </div>
            </div>

            {/* Job Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CurrencyDollarIcon className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{timeAgo}</span>
              </div>
            </div>

            {/* Job Description Preview */}
            <p className="text-gray-600 mb-4 line-clamp-2">
              {job.jobDescription.length > 150 
                ? `${job.jobDescription.substring(0, 150)}...` 
                : job.jobDescription
              }
            </p>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.slice(0, 5).map((tag, index) => (
                  <span key={index} className="badge-secondary text-xs">
                    {tag}
                  </span>
                ))}
                {job.tags.length > 5 && (
                  <span className="badge-secondary text-xs">
                    +{job.tags.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Batch Information */}
            {job.batch && job.batch.length > 0 && (
              <div className="mb-4">
                <span className="text-sm text-gray-600">Suitable for: </span>
                {job.batch.map((year, index) => (
                  <span key={index} className="badge-warning text-xs ml-1">
                    {year} batch
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={job.originalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center space-x-2 flex-1"
              >
                <span>Apply Now</span>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
              
              <button
                onClick={() => setShowCVAnalysis(true)}
                className="btn-outline flex items-center justify-center space-x-2 flex-1"
              >
                <SparklesIcon className="h-4 w-4" />
                <span>Analyze CV</span>
              </button>
              
              <Link
                href={`/jobs/${job.jobId}`}
                className="btn-secondary flex items-center justify-center flex-1"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CVAnalysisModal
        isOpen={showCVAnalysis}
        onClose={() => setShowCVAnalysis(false)}
        job={job}
      />
    </>
  );
}