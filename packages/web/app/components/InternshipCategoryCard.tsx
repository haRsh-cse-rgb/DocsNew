'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
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

interface InternshipCategoryCardProps {
  internship: Internship;
}

export default function InternshipCategoryCard({ internship }: InternshipCategoryCardProps) {
  let timeAgo = 'Unknown';
  if (internship.postedAt) {
    const postedDate = new Date(internship.postedAt);
    if (!isNaN(postedDate.getTime())) {
      timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
    }
  }

  return (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Company Logo */}
        {internship.company ? (
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
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Internship Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                <Link href={`/internships/${internship.id}`}>
                  {internship.title}
                </Link>
              </h3>
              <p className="text-lg text-gray-700 font-medium">{internship.company}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="badge-primary">{internship.category}</span>
              <span className={`badge ${internship.isActive ? 'badge-success' : 'badge-error'}`}>
                {internship.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Batch Information */}
          {internship.batch && internship.batch.length > 0 && (
            <div className="mb-4">
              <span className="text-sm text-gray-600">Suitable for: </span>
              {internship.batch.map((year, index) => (
                <span key={index} className="badge-warning text-xs ml-1">
                  {year} batch
                </span>
              ))}
            </div>
          )}

          {/* Internship Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{internship.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span>{internship.stipend}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{internship.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Skills */}
          {internship.skills && internship.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {internship.skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="badge-secondary text-xs">
                  {skill}
                </span>
              ))}
              {internship.skills.length > 5 && (
                <span className="badge-secondary text-xs">
                  +{internship.skills.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/internships/${internship.id}`}
              className="btn-secondary flex items-center justify-center flex-1"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 