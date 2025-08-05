'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WalkingCard from '../components/WalkingCard';
import WalkingFilters from '../components/WalkingFilters';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Walking {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  experience: string;
  category: string;
  date: string;
  time: string;
  applyLink: string;
  postedAt: string;
}

export default function WalkingPage() {
  const [walking, setWalking] = useState<Walking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    category: '',
    location: ''
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchWalking();
  }, [searchParams, filters, pagination.currentPage]);

  const fetchWalking = async () => {
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

      // Add search params from URL
      const searchTerm = searchParams.get('q');
      if (searchTerm) params.append('q', searchTerm);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/walking?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setWalking(data.walking);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch walking opportunities');
      }
    } catch (err) {
      setError('Error fetching walking opportunities');
      console.error('Error:', err);
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
              Find Your Perfect Walking Opportunity
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exciting walking opportunities from top companies. Apply directly and take the next step in your career.
            </p>
          </div>

          {/* Filters */}
          <WalkingFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />

          {/* Results */}
          <div className="mt-8">
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
                <button 
                  onClick={fetchWalking}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : walking.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No walking opportunities found matching your criteria</p>
                <button 
                  onClick={() => {
                    setFilters({ category: '', location: '' });
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
                    Showing {walking.length} of {pagination.totalItems} walking opportunity{pagination.totalItems !== 1 ? 'ies' : ''}
                  </p>
                </div>

                {/* Walking Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {walking.map((walkingItem) => (
                    <WalkingCard key={walkingItem.id} walking={walkingItem} />
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