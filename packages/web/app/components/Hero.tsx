'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import NewsletterModal from './NewsletterModal';
import DotGrid from './DotGrid';

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
      
      // Scroll to job results after a short delay to allow results to load
      setTimeout(() => {
        const jobsSection = document.getElementById('jobs');
        if (jobsSection) {
          jobsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <section className="relative text-center overflow-hidden">
        {/* DotGrid Background */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <DotGrid
            dotSize={4}
            gap={15}
            baseColor="#D3D3D3"
            activeColor="#8A00C4" // slightly lighter for active
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black text-balance drop-shadow-lg">
              Find Your Dream Job with{' '}
              <span className="text-[#8A00C4] drop-shadow-lg">AI-Powered</span> Insights
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-black max-w-3xl mx-auto text-balance drop-shadow">
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
                  className="w-full px-6 py-4 pl-12 text-black bg-white/80 backdrop-blur-md border border-[#8A00C4]/30 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-[#8A00C4] focus:ring-opacity-60 text-lg placeholder:text-gray-500"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#8A00C4]" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#8A00C4] hover:bg-[#6a0099] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 border border-[#8A00C4]/30 shadow-md"
                >
                  Search
                </button>
              </div>
            </form>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowNewsletter(true)}
                className="bg-[#8A00C4] hover:bg-[#6a0099] text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 flex items-center space-x-2 border border-[#8A00C4]/30 shadow-md"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Subscribe to Job Alerts</span>
              </button>
              <a
                href="#jobs"
                className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 border border-[#8A00C4]/30 shadow-md"
              >
                Browse All Jobs
              </a>
              <a
                href="/government-jobs"
                className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 border border-[#8A00C4]/30 shadow-md"
              >
                Government Jobs
              </a>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8A00C4] drop-shadow">1000+</div>
                <div className="text-black">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8A00C4] drop-shadow">50+</div>
                <div className="text-black">Top Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8A00C4] drop-shadow">AI-Powered</div>
                <div className="text-black">CV Analysis</div>
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