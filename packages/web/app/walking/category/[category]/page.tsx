'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WalkingCard from '../../../components/WalkingCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

export default function WalkingCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  
  const [walking, setWalking] = useState<Walking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      fetchWalkingByCategory();
    }
  }, [category]);

  const fetchWalkingByCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/walking/category/${encodeURIComponent(category)}`);
      const data = await response.json();
      
      if (data.success) {
        setWalking(data.walking);
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
            onClick={() => router.push('/walking')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Walking Opportunities
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category} Walking Opportunities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exciting {category.toLowerCase()} walking opportunities from top companies. Apply directly and take the next step in your career.
            </p>
          </div>

          {/* Results */}
          <div className="mt-8">
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">{error}</p>
                <button 
                  onClick={fetchWalkingByCategory}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : walking.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No {category.toLowerCase()} walking opportunities found</p>
                <button 
                  onClick={() => router.push('/walking')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View All Walking Opportunities
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {walking.length} walking opportunity{walking.length !== 1 ? 'ies' : ''} in {category}
                  </p>
                </div>

                {/* Walking Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {walking.map((walkingItem) => (
                    <WalkingCard key={walkingItem.id} walking={walkingItem} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 