'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  BuildingOfficeIcon,
  ShareIcon,
  ClipboardDocumentCheckIcon
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
  const [copied, setCopied] = useState(false);

  let timeAgo = 'Unknown';
  if (internship.postedAt) {
    const postedDate = new Date(internship.postedAt);
    if (!isNaN(postedDate.getTime())) {
      timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
    }
  }

  const handleShare = async () => {
    const message = `${internship.company} is offering an internship for ${internship.title}.
Stipend: ${internship.stipend || 'Not specified'}


Apply here: ${window.location.origin}/internships/${internship.id}`;

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
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
                internship.companyLogo ||
                (internship.company
                  ? `https://logo.clearbit.com/${internship.company.toLowerCase().replace(/\s+/g, '')}.com`
                  : 'data:image/svg+xml;base64,...')
              }
              alt={`${internship.company || 'Internship'} logo`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
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
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{timeAgo}</span>
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

      {/* Action Buttons */}
      <div className="mt-auto flex flex-col sm:flex-row gap-3">
        <Link
          href={`/internships/${internship.id}`}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center block"
        >
          View Details
        </Link>
        <button
          onClick={handleShare}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {copied ? (
            <>
              <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <ShareIcon className="h-5 w-5 mr-2" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
