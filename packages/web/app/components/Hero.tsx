'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import NewsletterModal from './NewsletterModal';

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewsletter, setShowNewsletter] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Update URL with search parameter
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchTerm.trim());
      window.history.pushState({}, '', url.toString());
      
      // Trigger a custom event to notify JobGrid component
      window.dispatchEvent(new CustomEvent('searchUpdate'));
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Find Your Dream Job with{' '}
              <span className="text-primary-200">AI-Powered</span> Insights
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto text-balance">
              Discover curated job opportunities, get instant CV analysis, and receive personalized job recommendations.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 text-gray-900 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50 text-lg"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowNewsletter(true)}
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-xl transition-colors duration-200 flex items-center space-x-2"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Subscribe to Job Alerts</span>
              </button>
              <a
                href="#jobs"
                className="bg-primary-500 hover:bg-primary-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
              >
                Browse All Jobs
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-primary-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-200">1000+</div>
                <div className="text-primary-100">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-200">50+</div>
                <div className="text-primary-100">Top Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-200">AI-Powered</div>
                <div className="text-primary-100">CV Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterModal 
        isOpen={showNewsletter} 
        onClose={() => setShowNewsletter(false)} 
      />
    </>
  );
}