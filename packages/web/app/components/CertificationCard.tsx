'use client';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface Certification {
  id: string;
  title: string;
  provider: string;
  category: string;
  link: string;
  providerLogo: string;
  postedAt: string;
}

interface CertificationCardProps {
  certification: Certification;
}

export default function CertificationCard({ certification }: CertificationCardProps) {
  const handleCardClick = () => {
    window.open(certification.link, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100 flex flex-col items-center justify-between w-full max-w-xs mx-auto min-h-[260px] group"
      style={{ minWidth: 220, minHeight: 260 }}
      onClick={handleCardClick}
    >
      {/* Provider Logo */}
      <div className="flex items-center justify-center mt-6 mb-2">
        <img
          src={certification.providerLogo}
          alt={`${certification.provider} logo`}
          className="h-16 w-16 object-cover rounded-full border-2 border-blue-100 bg-white shadow-sm group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-logo.svg';
          }}
        />
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base mb-1 text-center line-clamp-2 group-hover:text-blue-700 transition-colors">
          {certification.title}
        </h3>
        {/* Provider */}
        <p className="text-gray-500 text-xs mb-1 text-center">
          by <span className="font-medium text-gray-700">{certification.provider}</span>
        </p>
        {/* Category */}
        <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium mb-2">
          {certification.category}
        </span>
        {/* Posted Date */}
        <p className="text-gray-400 text-xs mb-2 text-center">
          Posted {formatDate(certification.postedAt)}
        </p>
      </div>
      {/* Action Button */}
      <div className="w-full flex items-center justify-center mb-4">
        <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 text-xs font-medium transition-colors rounded-full px-4 py-1 shadow group-hover:shadow-md">
          <span>Get Certified</span>
          <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
} 