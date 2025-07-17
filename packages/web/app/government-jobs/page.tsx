'use client';

import { useState, useEffect } from 'react';
import GovernmentJobCard from '../components/GovernmentJobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { SarkariJob } from '../types';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function GovernmentJobsPage() {
  const [jobs, setJobs] = useState<SarkariJob[]>([]);
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
      const response = await axios.get(`/api/sarkari-jobs?page=${page}&limit=15`);
      const data = response.data;
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePageChange = (page: number) => {
    fetchJobs(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Government Jobs</h1>
      <p className="text-gray-600 mb-8">Explore the latest government (Sarkari) job opportunities across India. Updated regularly with new openings.</p>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Government Jobs Found</h3>
            <p className="text-gray-600 mb-4">
              Please check back later for new government job postings.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid gap-6 mb-8">
            {jobs.map((job, index) => (
              <div key={job.jobId} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <GovernmentJobCard job={job} />
              </div>
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
            />
          )}
        </div>
      )}
    </div>
  );
} 