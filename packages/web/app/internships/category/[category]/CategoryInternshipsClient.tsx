"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InternshipCategoryCard from "../../../components/InternshipCategoryCard";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Pagination from "../../../components/Pagination";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from "axios";

interface CategoryInternshipsClientProps {
  category: string;
}

export default function CategoryInternshipsClient({ category }: CategoryInternshipsClientProps) {
  const router = useRouter();
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInternships: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [locationFilter, setLocationFilter] = useState("");
  const [allCategoryInternships, setAllCategoryInternships] = useState<any[]>([]);

  // Fetch internships for category and location
  const fetchInternships = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const paramsObj = new URLSearchParams();
      paramsObj.set("page", page.toString());
      paramsObj.set("limit", "20");
      paramsObj.set("category", category);
      if (locationFilter) paramsObj.set("location", locationFilter);
      const response = await axios.get(`https://api.india-jobs.in/api/v1/internships/category/${encodeURIComponent(category)}?${paramsObj.toString()}`);
      if (response.status !== 200) throw new Error("Failed to fetch internships");
      const data = response.data;
      setInternships(data.internships || []);
      setPagination(data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalInternships: 0,
        hasNext: false,
        hasPrev: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters/category/page change
  useEffect(() => {
    fetchInternships(pagination.currentPage);
    // eslint-disable-next-line
  }, [category, locationFilter, pagination.currentPage]);

  // Fetch all internships for the category (for location options)
  useEffect(() => {
    const fetchAllCategoryInternships = async () => {
      const paramsObj = new URLSearchParams();
      paramsObj.set("page", "1");
      paramsObj.set("limit", "1000"); // or a large enough number
      paramsObj.set("category", category);
      const response = await axios.get(`https://api.india-jobs.in/api/v1/internships/category/${encodeURIComponent(category)}?${paramsObj.toString()}`);
      setAllCategoryInternships(response.data.internships || []);
    };
    fetchAllCategoryInternships();
  }, [category]);

  // Get unique locations from all category internships
  let locations = Array.from(
    new Set(allCategoryInternships.flatMap((i) => (i.location ? (Array.isArray(i.location) ? i.location : [i.location]) : [])).filter(Boolean))
  );
  locations = locations.sort((a, b) => a.localeCompare(b));

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        {/* Sticky header with back button */}
        <div className="sticky top-0 z-10 bg-gray-50 pb-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/internships')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Internships</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Internships in <span className="text-primary-700">{category}</span>
            </h1>
          </div>
        </div>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-4 items-end flex-wrap">
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
                onClick={() => { setLocationFilter(""); }}
                disabled={!locationFilter}
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
        ) : internships.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Internships Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or check back later for new internships.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {internships.map((internship) => (
              <div key={internship.id} className="max-w-4xl mx-auto w-full">
                <InternshipCategoryCard internship={internship} />
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
