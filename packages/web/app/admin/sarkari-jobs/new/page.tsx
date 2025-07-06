'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CreateSarkariJob() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    postName: '',
    organization: '',
    advertisementNo: '',
    applicationStart: '',
    applicationEnd: '',
    examDate: '',
    applicationFee: '',
    vacancyDetails: '',
    eligibility: '',
    officialWebsite: '',
    notificationLink: '',
    applyLink: '',
    resultLink: ''
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      // Prepare data with important dates
      const jobData = {
        ...formData,
        importantDates: {
          applicationStart: formData.applicationStart,
          applicationEnd: formData.applicationEnd,
          examDate: formData.examDate
        }
      };

      await axios.post('/api/admin/sarkari-jobs', jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Government job created successfully!');
      router.push('/admin/sarkari-jobs');
    } catch (error: any) {
      console.error('Error creating sarkari job:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create government job';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const organizations = [
    'UPSC',
    'SSC',
    'IBPS',
    'SBI',
    'Railway',
    'Defense',
    'Teaching',
    'State PSC',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Government Job</h1>
                <p className="text-gray-600">Add a new government job posting</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
            </button>
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
                  <label htmlFor="postName" className="block text-sm font-medium text-gray-700 mb-2">
                    Post Name *
                  </label>
                  <input
                    type="text"
                    id="postName"
                    name="postName"
                    required
                    value={formData.postName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Civil Services"
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization *
                  </label>
                  <select
                    id="organization"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select Organization</option>
                    {organizations.map(org => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="advertisementNo" className="block text-sm font-medium text-gray-700 mb-2">
                    Advertisement Number
                  </label>
                  <input
                    type="text"
                    id="advertisementNo"
                    name="advertisementNo"
                    value={formData.advertisementNo}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 01/2024"
                  />
                </div>

                <div>
                  <label htmlFor="applicationFee" className="block text-sm font-medium text-gray-700 mb-2">
                    Application Fee
                  </label>
                  <input
                    type="text"
                    id="applicationFee"
                    name="applicationFee"
                    value={formData.applicationFee}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., ₹1000"
                  />
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Important Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="applicationStart" className="block text-sm font-medium text-gray-700 mb-2">
                    Application Start Date
                  </label>
                  <input
                    type="date"
                    id="applicationStart"
                    name="applicationStart"
                    value={formData.applicationStart}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="applicationEnd" className="block text-sm font-medium text-gray-700 mb-2">
                    Application End Date
                  </label>
                  <input
                    type="date"
                    id="applicationEnd"
                    name="applicationEnd"
                    value={formData.applicationEnd}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    id="examDate"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="vacancyDetails" className="block text-sm font-medium text-gray-700 mb-2">
                    Vacancy Details
                  </label>
                  <textarea
                    id="vacancyDetails"
                    name="vacancyDetails"
                    rows={3}
                    value={formData.vacancyDetails}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Number of vacancies and details..."
                  />
                </div>

                <div>
                  <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-2">
                    Eligibility Criteria
                  </label>
                  <textarea
                    id="eligibility"
                    name="eligibility"
                    rows={4}
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Educational qualification, age limit, etc..."
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Important Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="officialWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                    Official Website *
                  </label>
                  <input
                    type="url"
                    id="officialWebsite"
                    name="officialWebsite"
                    required
                    value={formData.officialWebsite}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://official-website.com"
                  />
                </div>

                <div>
                  <label htmlFor="notificationLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Link *
                  </label>
                  <input
                    type="url"
                    id="notificationLink"
                    name="notificationLink"
                    required
                    value={formData.notificationLink}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://notification-link.com"
                  />
                </div>

                <div>
                  <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Apply Link
                  </label>
                  <input
                    type="url"
                    id="applyLink"
                    name="applyLink"
                    value={formData.applyLink}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://apply-link.com"
                  />
                </div>

                <div>
                  <label htmlFor="resultLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Result Link
                  </label>
                  <input
                    type="url"
                    id="resultLink"
                    name="resultLink"
                    value={formData.resultLink}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://result-link.com"
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
                <span>{loading ? 'Creating...' : 'Create Government Job'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 