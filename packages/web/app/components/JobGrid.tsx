'use client';

import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';
import { Job } from '../types';

export default function JobGrid() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Get current URL parameters
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      params.set('page', page.toString());
      params.set('limit', '15');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/jobs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0,
        hasNext: false,
        hasPrev: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs();
  }, []);

  // Listen for filter and search updates
  useEffect(() => {
    const handleUpdate = () => {
      fetchJobs(1); // Reset to page 1 when filters change
    };

    window.addEventListener('filtersUpdate', handleUpdate);
    window.addEventListener('searchUpdate', handleUpdate);

    return () => {
      window.removeEventListener('filtersUpdate', handleUpdate);
      window.removeEventListener('searchUpdate', handleUpdate);
    };
  }, []);

  const handlePageChange = (page: number) => {
    fetchJobs(page);
    // Scroll to top of job grid
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-error-800 mb-2">Error Loading Jobs</h3>
          <p className="text-error-600 mb-4">{error}</p>
          <button
            onClick={() => fetchJobs()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Jobs Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms to find more opportunities.
          </p>
          <button
            onClick={() => {
              // Clear all filters and search
              const url = new URL(window.location.href);
              url.search = '';
              window.history.pushState({}, '', url.toString());
              window.dispatchEvent(new CustomEvent('filtersUpdate'));
            }}
            className="btn-outline"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="jobs" className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Latest Job Opportunities
        </h2>
        <p className="text-gray-600">
          {pagination.totalJobs} job{pagination.totalJobs !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-6">
        {jobs.map((job, index) => (
          <div
            key={job.jobId}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        </div>
      )}
    </div>
  );
}