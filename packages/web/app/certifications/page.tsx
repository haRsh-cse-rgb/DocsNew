'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CertificationCard from '../components/CertificationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Certification {
  id: string;
  title: string;
  provider: string;
  category: string;
  link: string;
  providerLogo: string;
  postedAt: string;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = 'Certifications';
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [selectedCategory]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? '/api/certifications' 
        : `/api/certifications/category/${encodeURIComponent(selectedCategory)}`;
      
      const response = await axios.get(url);
      setCertifications(response.data.certifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching certifications:', err);
      setError('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(certifications.map(cert => cert.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Free Certifications</h1>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchCertifications}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Free Certifications
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover free certifications from top providers to enhance your skills and advance your career
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>

          {/* Certifications Grid */}
          {certifications.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications found</h3>
              <p className="text-gray-600">Try selecting a different category or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {certifications.map((certification) => (
                <CertificationCard key={certification.id} certification={certification} />
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Showing {certifications.length} certification{certifications.length !== 1 ? 's' : ''}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 