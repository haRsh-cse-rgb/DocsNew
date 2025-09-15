'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../../../components/LoadingSpinner';

interface Walking {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  category: string;
  date: string;
  time: string;
  applyLink: string;
  postedAt: string;
}

export default function EditWalkingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
                const [formData, setFormData] = useState({
                title: '',
                company: '',
                location: '',
                experience: '',
                category: '',
                date: '',
                time: '',
                applyLink: ''
              });

  const categories = [
    'Technology',
    'Marketing',
    'Sales',
    'Finance',
    'Healthcare',
    'Education',
    'Engineering',
    'Design',
    'Operations'
  ];

  const experienceLevels = [
    'Fresher',
    '0-1 years',
    '1-2 years',
    '2-3 years',
    '3-5 years',
    '5+ years'
  ];

  useEffect(() => {
    if (id) {
      fetchWalking();
    }
  }, [id]);

  const fetchWalking = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.india-jobs.in/api/v1/walking/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const walking = data.walking;
                            setFormData({
                      title: walking.title || '',
                      company: walking.company || '',
                      location: walking.location || '',
                      experience: walking.experience || '',
                      category: walking.category || '',
                      date: walking.date || '',
                      time: walking.time || '',
                      applyLink: walking.applyLink || ''
                    });
      } else {
        setError('Failed to fetch walking opportunity');
      }
    } catch (err) {
      setError('Error fetching walking opportunity');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`https://api.india-jobs.in/api/v1/walking/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Walking opportunity updated successfully!');
        router.push('/admin/walking');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update walking opportunity');
      }
    } catch (err) {
      console.error('Error updating walking opportunity:', err);
      alert('Error updating walking opportunity');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/admin/walking"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Walking Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/walking"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Walking Opportunities
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Walking Opportunity</h1>
          <p className="mt-2 text-gray-600">Update walking opportunity details</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer Walking"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Google"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Bangalore, India"
                />
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required *
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Experience Level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Apply Link */}
              <div className="md:col-span-2">
                <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Application Link *
                </label>
                <input
                  type="url"
                  id="applyLink"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/apply"
                />
              </div>

              
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/walking"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 