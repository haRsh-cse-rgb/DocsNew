'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  BriefcaseIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

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

export default function JobCard({ job }: JobCardProps) {
  const [showCVAnalysis, setShowCVAnalysis] = useState(false);

  let timeAgo = 'Unknown';
  if (job.postedOn) {
    const postedDate = new Date(job.postedOn);
    if (!isNaN(postedDate.getTime())) {
      timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
    }
  }

  const descriptionSections = parseJobDescription(job.jobDescription);

  return (
    <>
      <div className="card hover:shadow-lg transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Company Logo */}
          {job.companyName ? (
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={
                  job.companyLogo ||
                  (job.companyName
                    ? `https://logo.clearbit.com/${job.companyName.toLowerCase().replace(/\s+/g, '')}.com`
                    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPko8L3RleHQ+Cjwvc3ZnPgo=')
                }
                alt={`${job.companyName || 'Job'} logo`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPko8L3RleHQ+Cjwvc3ZnPgo=';
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}

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
                <BriefcaseIcon className="h-4 w-4" />
                <span>{job.experience}</span>
              </div>
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
                href={`/jobs/${job.jobId}`}
                className="btn-secondary flex items-center justify-center flex-1"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}