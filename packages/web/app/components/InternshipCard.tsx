'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  ArrowTopRightOnSquareIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  startDate: string;
  endDate: string;
  stipend: string;
  duration: string;
  applyLink: string;
  description: string;
  skills: string[];
  category: string;
  postedAt: string;
  isActive: boolean;
  batch?: string[];
}

interface InternshipCardProps {
  internship: Internship;
}

export default function InternshipCard({ internship }: InternshipCardProps) {
  let timeAgo = 'Unknown';
  if (internship.postedAt) {
    const postedDate = new Date(internship.postedAt);
    if (!isNaN(postedDate.getTime())) {
      timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      {/* Header with Logo and Title */}
      <div className="flex items-start gap-4 mb-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={
                internship.companyLogo ||
                (internship.company
                  ? `https://logo.clearbit.com/${internship.company.toLowerCase().replace(/\s+/g, '')}.com`
                  : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkk8L3RleHQ+Cjwvc3ZnPgo=')
              }
              alt={`${internship.company || 'Internship'} logo`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkk8L3RleHQ+Cjwvc3ZnPgo=';
              }}
            />
          </div>
        </div>

        {/* Title and Company */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
            <Link href={`/internships/${internship.id}`} className="hover:underline">
              {internship.title}
            </Link>
          </h3>
          <p className="text-base text-gray-700 font-medium truncate">{internship.company}</p>
        </div>

        {/* Status Badges */}
        <div className="flex-shrink-0 flex flex-col gap-1">
          <span className="badge-primary text-xs px-2 py-1">{internship.category}</span>
          <span className={`badge text-xs px-2 py-1 ${internship.isActive ? 'badge-success' : 'badge-error'}`}>
            {internship.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Batch Information */}
      {internship.batch && internship.batch.length > 0 && (
        <div className="mb-3">
          <span className="text-sm text-gray-600">Suitable for: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {internship.batch.map((year, index) => (
              <span key={index} className="badge-warning text-xs px-2 py-1">
                {year} batch
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Meta Information */}
      <div className="grid grid-cols-1 gap-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{internship.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{internship.stipend}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{internship.duration}</span>
        </div>
      </div>

      {/* Skills */}
      {internship.skills && internship.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {internship.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="badge-secondary text-xs px-2 py-1">
                {skill}
              </span>
            ))}
            {internship.skills.length > 3 && (
              <span className="badge-secondary text-xs px-2 py-1">
                +{internship.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-auto">
        <Link
          href={`/internships/${internship.id}`}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 