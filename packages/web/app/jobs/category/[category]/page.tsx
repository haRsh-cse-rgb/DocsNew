"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import JobCard from "../../../components/JobCard";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Pagination from "../../../components/Pagination";
import Link from "next/link";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from "axios";

export default function CategoryJobsPage() {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(params.category as string);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [batchFilter, setBatchFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [allCategoryJobs, setAllCategoryJobs] = useState<any[]>([]);

  // Fetch jobs for category, batch, and location
  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const paramsObj = new URLSearchParams();
      paramsObj.set("page", page.toString());
      paramsObj.set("limit", "20");
      paramsObj.set("category", category);
      if (batchFilter) paramsObj.set("batch", batchFilter);
      if (locationFilter) paramsObj.set("location", locationFilter);
      const response = await axios.get(`/api/jobs?${paramsObj.toString()}`);
      if (response.status !== 200) throw new Error("Failed to fetch jobs");
      const data = response.data;
      setJobs(data.jobs || []);
      setPagination(data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalJobs: 0,
        hasNext: false,
        hasPrev: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters/category/page/search change
  useEffect(() => {
    fetchJobs(pagination.currentPage);
    // eslint-disable-next-line
  }, [category, batchFilter, locationFilter, pagination.currentPage, searchTerm]);

  // Fetch all jobs for the category (for batch options)
  useEffect(() => {
    const fetchAllCategoryJobs = async () => {
      const paramsObj = new URLSearchParams();
      paramsObj.set("page", "1");
      paramsObj.set("limit", "1000"); // or a large enough number
      paramsObj.set("category", category);
      const response = await axios.get(`/api/jobs?${paramsObj.toString()}`);
      setAllCategoryJobs(response.data.jobs || []);
    };
    fetchAllCategoryJobs();
  }, [category]);

  // Get unique batches and locations from all category jobs
  let batches = Array.from(
    new Set(allCategoryJobs.flatMap((j) => (j.batch ? j.batch : [])).filter(Boolean))
  );
  // Sort numerically if possible, otherwise alphabetically
  batches = batches.sort((a, b) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return bNum - aNum; // Descending order (latest batch first)
    }
    return a.localeCompare(b);
  });

  let locations = Array.from(
    new Set(allCategoryJobs.flatMap((j) => (j.location ? (Array.isArray(j.location) ? j.location : [j.location]) : [])).filter(Boolean))
  );
  locations = locations.sort((a, b) => a.localeCompare(b));

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        {/* Sticky header with back button */}
        <div className="sticky top-0 z-10 bg-gray-50 pb-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Jobs in <span className="text-primary-700">{category}</span>
            </h1>
          </div>
        </div>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="input-field w-32"
              >
                <option value="">All</option>
                {batches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="Not Mentioned">Not Mentioned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input-field w-32"
              >
                <option value="">All</option>
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="ml-2 text-sm text-blue-600 hover:underline px-2 py-1"
                style={{ minHeight: '2.25rem' }}
                onClick={() => { setBatchFilter(""); setLocationFilter(""); }}
                disabled={!batchFilter && !locationFilter}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Jobs Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or check back later for new jobs.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {jobs.map((job) => (
              <div key={job.jobId} className="max-w-4xl mx-auto w-full">
                <JobCard job={job} />
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