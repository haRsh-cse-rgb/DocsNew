'use client';

import { ArrowTopRightOnSquareIcon, MapPinIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

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
}

interface InternshipCardProps {
  internship: Internship;
}

export default function InternshipCard({ internship }: InternshipCardProps) {
  const handleCardClick = () => {
    window.open(internship.applyLink, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPostedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col w-full group overflow-hidden relative"
      style={{ minHeight: 400 }}
      onClick={handleCardClick}
    >
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
          {internship.category}
        </span>
      </div>

      {/* Company Logo Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 flex items-center justify-center">
        <div className="relative">
          <img
            src={internship.companyLogo}
            alt={`${internship.company} logo`}
            className="h-20 w-20 object-cover rounded-2xl border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-logo.svg';
            }}
          />
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-purple-400 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-6">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors leading-tight">
          {internship.title}
        </h3>

        {/* Company */}
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <span className="font-medium text-gray-800">{internship.company}</span>
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{internship.location}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{internship.duration}</span>
        </div>

        {/* Stipend */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
          <span>{internship.stipend}</span>
        </div>

        {/* Skills */}
        {internship.skills && internship.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {internship.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {internship.skills.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{internship.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Posted Date */}
        <p className="text-gray-400 text-xs mb-4 flex items-center">
          <span>Posted {formatPostedDate(internship.postedAt)}</span>
        </p>

        {/* Action Button */}
        <div className="mt-auto">
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-xl flex items-center justify-center">
            <span>Apply Now</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
    </div>
  );
} 