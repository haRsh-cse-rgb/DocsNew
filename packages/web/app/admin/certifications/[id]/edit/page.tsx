'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../../../components/LoadingSpinner';

interface Certification {
  id: string;
  title: string;
  provider: string;
  category: string;
  link: string;
}

export default function EditCertificationPage() {
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    category: '',
    link: ''
  });
  const [customCategory, setCustomCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetchCertification();
  }, [id]);

  const fetchCertification = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.india-jobs.in/api/v1/certifications/${id}`);
      const certification = response.data.certification;
      
      setFormData({
        title: certification.title,
        provider: certification.provider,
        category: certification.category,
        link: certification.link
      });
      setError(null);
    } catch (err: any) {
      console.error('Error fetching certification:', err);
      setError(err.response?.data?.message || 'Failed to load certification');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      const finalFormData = {
        ...formData,
        category: formData.category === 'Other' ? customCategory : formData.category
      };
      
      await axios.put(`https://api.india-jobs.in/api/v1/certifications/${id}`, finalFormData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      router.push('/admin/certifications');
    } catch (err: any) {
      console.error('Error updating certification:', err);
      setError(err.response?.data?.message || 'Failed to update certification');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Certifications
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Certification</h1>
          <p className="text-gray-600 mt-2">Update certification details</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Certification Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., AWS Cloud Practitioner"
              />
            </div>

            {/* Provider */}
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                Provider *
              </label>
              <input
                type="text"
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Amazon Web Services"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="AI/ML">AI/ML</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Custom Category Input - Only show when "Other" is selected */}
            {formData.category === 'Other' && (
              <div className="animate-fadeIn">
                <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Category Name *
                </label>
                <input
                  type="text"
                  id="customCategory"
                  name="customCategory"
                  value={customCategory}
                  onChange={handleCustomCategoryChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Blockchain, IoT, Mobile Development"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the name of your custom category
                </p>
              </div>
            )}

            {/* Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                Certification Link *
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/certification"
              />
              <p className="text-sm text-gray-500 mt-1">
                Direct link to the certification page
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving || (formData.category === 'Other' && !customCategory.trim())}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {saving ? 'Updating...' : 'Update Certification'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 