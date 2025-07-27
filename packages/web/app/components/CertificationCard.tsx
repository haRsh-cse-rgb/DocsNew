'use client';

import { ArrowTopRightOnSquareIcon, StarIcon } from '@heroicons/react/24/outline';

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
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col w-full max-w-sm mx-auto group overflow-hidden relative"
      style={{ minHeight: 320 }}
      onClick={handleCardClick}
    >
      {/* FREE Tag */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
          <StarIcon className="h-3 w-3 mr-1" />
          FREE
        </div>
      </div>

      {/* Provider Logo Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="relative">
          <img
            src={certification.providerLogo}
            alt={`${certification.provider} logo`}
            className="h-20 w-20 object-cover rounded-2xl border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-logo.svg';
            }}
          />
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-blue-400 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
            {certification.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors leading-tight">
          {certification.title}
        </h3>

        {/* Provider */}
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <span className="font-medium text-gray-800">by {certification.provider}</span>
        </p>

        {/* Posted Date */}
        <p className="text-gray-400 text-xs mb-4 flex items-center">
          <span>Posted {formatDate(certification.postedAt)}</span>
        </p>

        {/* Action Button */}
        <div className="mt-auto">
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-xl flex items-center justify-center">
            <span>Get Certified</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
    </div>
  );
} 