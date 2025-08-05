'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import InternshipCard from '../components/InternshipCard';
import InternshipFilters from '../components/InternshipFilters';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

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
  batch?: string[];
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInternships: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    batch: ''
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchInternships();
  }, [searchParams, filters, pagination.currentPage]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      // Add pagination params
      params.append('page', pagination.currentPage.toString());
      params.append('limit', '30');

      // Add filter params
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.batch) params.append('batch', filters.batch);

      // Add search params from URL
      const searchTerm = searchParams.get('q');
      if (searchTerm) params.append('q', searchTerm);

      const response = await axios.get(`/api/internships?${params.toString()}`);
      
      setInternships(response.data.internships);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingSpinner />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Internship
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exciting internship opportunities across various industries and kickstart your career journey
            </p>
          </div>

          {/* Filters */}
          <InternshipFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />

          {/* Results */}
          <div className="mt-8">
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
                <button 
                  onClick={fetchInternships}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No internships found matching your criteria</p>
                <button 
                  onClick={() => {
                    setFilters({ category: '', location: '', batch: '' });
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {internships.length} of {pagination.totalInternships} internships
                  </p>
                </div>

                {/* Internships Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {internships.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 