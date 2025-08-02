'use client';

import { useState, useEffect } from 'react';
import GovernmentJobCard from '../components/GovernmentJobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { SarkariJob } from '../types';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

export default function GovernmentJobsPage() {
  const router = useRouter();
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
  const [orgFilter, setOrgFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/sarkari-jobs?page=${page}&limit=20`);
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

  // Get unique organizations for filter dropdown
  const organizations = Array.from(new Set(jobs.map(j => j.organization).filter(Boolean)));

  // Filter jobs based on selected organization and last date
  const filteredJobs = jobs.filter(job => {
    const orgMatch = !orgFilter || job.organization === orgFilter;
    let dateMatch = true;
    if (dateFilter) {
      const endDate = job.importantDates?.applicationEnd;
      if (!endDate) return false;
      dateMatch = endDate >= dateFilter;
    }
    return orgMatch && dateMatch;
  });

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        {/* Sticky header with back button, heading, and filters */}
        <div className="sticky top-0 z-10 bg-gray-50 pb-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Latest Government Jobs
            </h1>
          </div>
        </div>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <select
                value={orgFilter}
                onChange={e => setOrgFilter(e.target.value)}
                className="input-field w-48"
              >
                <option value="">All</option>
                {organizations.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Date to Apply (on or after)</label>
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="input-field w-48"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              className="ml-2 text-sm text-blue-600 hover:underline px-2 py-1"
              style={{ minHeight: '2.25rem' }}
              onClick={() => { setOrgFilter(''); setDateFilter(''); }}
              disabled={!orgFilter && !dateFilter}
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Government Jobs Found</h3>
              <p className="text-gray-600 mb-4">
                Please check back later for new government job postings.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {filteredJobs.map((job, index) => (
              <div key={job.jobId} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="max-w-4xl mx-auto w-full">
                  <GovernmentJobCard job={job} />
                </div>
              </div>
            ))}
          </div>
        )}
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
      <Footer />
    </>
  );
} 