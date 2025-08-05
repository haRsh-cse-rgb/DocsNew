'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  CalendarIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  BuildingOfficeIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface Walking {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  experience: string;
  category: string;
  date: string;
  time: string;
  applyLink: string;
  postedAt: string;
}

interface WalkingCardProps {
  walking: Walking;
}

export default function WalkingCard({ walking }: WalkingCardProps) {
  let timeAgo = 'Unknown';
  if (walking.postedAt) {
    const postedDate = new Date(walking.postedAt);
    if (!isNaN(postedDate.getTime())) {
      timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
    }
  }

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(walking.applyLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      {/* Header with Logo and Title */}
      <div className="flex items-start gap-4 mb-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={
                walking.companyLogo ||
                (walking.company
                  ? `https://logo.clearbit.com/${walking.company.toLowerCase().replace(/\s+/g, '')}.com`
                  : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlc8L3RleHQ+Cjwvc3ZnPgo=')
              }
              alt={`${walking.company || 'Company'} logo`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlc8L3RleHQ+Cjwvc3ZnPgo=';
              }}
            />
          </div>
        </div>

        {/* Title and Company */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
            {walking.title}
          </h3>
          <p className="text-base text-gray-700 font-medium truncate">{walking.company}</p>
        </div>

                            {/* Category Badge */}
                    <div className="flex-shrink-0">
                      <span className="badge-primary text-xs px-2 py-1">{walking.category}</span>
                    </div>
      </div>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-1">
          <MapPinIcon className="h-4 w-4 text-gray-400" />
          <span>{walking.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <BriefcaseIcon className="h-4 w-4 text-gray-400" />
          <span>{walking.experience}</span>
        </div>
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span>{walking.date}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-4 w-4 text-gray-400" />
          <span>{walking.time}</span>
        </div>
      </div>

      

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-gray-400">{timeAgo}</span>
        <button
          onClick={handleApplyClick}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <span>Apply Now</span>
          <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
} 