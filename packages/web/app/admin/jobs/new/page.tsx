'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CreateJob() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    companyName: '',
    companyLogo: '',
    location: '',
    salary: '',
    jobDescription: '',
    originalLink: '',
    category: '',
    tags: '',
    batch: '',
    expiresOn: ''
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatSalary = (salary: string) => {
    let s = salary.replace(/[₹,]/g, '').replace(/\s*LPA\s*/i, '').trim();
    if (s.includes('-')) {
      return `₹${s} LPA`;
    }
    return `₹${s} LPA`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      // Prepare data
      const jobData = {
        ...formData,
        salary: formatSalary(formData.salary),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        batch: formData.batch ? formData.batch.split(',').map(batch => batch.trim()) : []
      };

      await axios.post('/api/admin/jobs', jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Job created successfully!');
      router.push('/admin/jobs');
    } catch (error: any) {
      console.error('Error creating job:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create job';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Software',
    'HR',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Design',
    'Product',
    'Data Science',
    'DevOps',
    'QA',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
              <p className="text-gray-600">Add a new job posting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Frontend Developer"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Tech Corp"
                  />
                </div>

                <div>
                  <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo URL (optional)
                  </label>
                  <input
                    type="url"
                    id="companyLogo"
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Bangalore, India"
                  />
                </div>

                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                    Salary *
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    required
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., ₹10-15 LPA"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    required
                    rows={6}
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Detailed job description..."
                  />
                </div>

                <div>
                  <label htmlFor="originalLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Original Job Link *
                  </label>
                  <input
                    type="url"
                    id="originalLink"
                    name="originalLink"
                    required
                    value={formData.originalLink}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://company.com/careers/job-id"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., react, javascript, frontend"
                  />
                </div>

                <div>
                  <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-2">
                    Batch (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 2024, 2025"
                  />
                </div>

                <div>
                  <label htmlFor="expiresOn" className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    id="expiresOn"
                    name="expiresOn"
                    required
                    value={formData.expiresOn}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <PlusIcon className="h-5 w-5" />
                <span>{loading ? 'Creating...' : 'Create Job'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 