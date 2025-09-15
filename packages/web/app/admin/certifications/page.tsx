'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Certification {
  id: string;
  title: string;
  provider: string;
  category: string;
  link: string;
  postedAt: string;
  lastUpdated: string;
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.india-jobs.in/api/v1/certifications');
      setCertifications(response.data.certifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching certifications:', err);
      setError('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      setDeletingId(id);
      const token = localStorage.getItem('adminToken');
      await axios.delete(`https://api.india-jobs.in/api/v1/certifications/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      setCertifications(certifications.filter(cert => cert.id !== id));
      toast.success(`Certification "${title}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting certification:', err);
      toast.error('Failed to delete certification');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Certifications Management</h1>
            <p className="text-gray-600 mt-2">Manage free certifications for your platform</p>
          </div>
          <div className="flex gap-3">
          <button
                onClick={() => router.push('/admin/dashboard')}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Go to Dashboard</span>
              </button>
            <button
              onClick={() => router.push('/admin/certifications/bulk')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Bulk Upload
            </button>
            <button
              onClick={() => router.push('/admin/certifications/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add New
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Certifications Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No certifications found. Add your first certification to get started.
                    </td>
                  </tr>
                ) : (
                  certifications.map((certification) => (
                    <tr key={certification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {certification.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{certification.provider}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {certification.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(certification.postedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(certification.link, '_blank')}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Certification"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/certifications/${certification.id}/edit`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(certification.id, certification.title)}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                            disabled={deletingId === certification.id}
                          >
                            {deletingId === certification.id ? (
                              <div className="flex items-center space-x-1">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                <span className="text-xs">Deleting...</span>
                              </div>
                            ) : (
                              <TrashIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Total: {certifications.length} certification{certifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
} 