'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import JobCard from './JobCard';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';
import { Job } from '../types';
import axios from 'axios';

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
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchJobs = async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      setError(null);
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      params.set('page', page.toString());
      params.set('limit', '20');
      const response = await axios.get(`https://api.india-jobs.in/api/v1/jobs?${params.toString()}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch jobs');
      }
      const data = response.data;
      setJobs(prev => append ? [...prev, ...(data.jobs || [])] : (data.jobs || []));
      setPagination(data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalJobs: 0,
        hasNext: false,
        hasPrev: false
      });
      setHasMore(data.pagination ? data.pagination.hasNext : false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      if (!append) setJobs([]);
    } finally {
      if (page === 1) setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs(1);
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

  // Infinite scroll observer
  const lastJobRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setIsFetchingMore(true);
        fetchJobs(pagination.currentPage + 1, true);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, hasMore, pagination.currentPage]);

  if (loading && jobs.length === 0) {
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
            onClick={() => fetchJobs(1)}
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
        {jobs.map((job, index) => {
          const isLast = index === jobs.length - 1;
          return (
            <div
              key={job.jobId}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              ref={isLast ? lastJobRef : undefined}
            >
              <JobCard job={job} />
            </div>
          );
        })}
      </div>

      {/* Infinite scroll loading spinner */}
      {isFetchingMore && (
        <div className="flex justify-center items-center py-6">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}