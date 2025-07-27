'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

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
}

export default function InternshipsManagement() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchInternships();
  }, [router]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/internships?limit=100');
      setInternships(response.data.internships || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInternship = async (internshipId: string, internshipTitle: string) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      setDeletingId(internshipId);
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/internships/${internshipId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Internship "${internshipTitle}" deleted successfully`);
      fetchInternships();
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast.error('Failed to delete internship');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || internship.category === filterCategory;
    const matchesStatus = !filterStatus || (internship.isActive ? 'active' : 'inactive') === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/IndiaJobs.png" alt="India Jobs Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold text-gray-900 flex items-center" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1' }}>
                India <span style={{ color: '#FF9800' }}>J</span>obs
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Internships Management</h2>
          <p className="text-gray-600">Manage internship opportunities</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/internships/new')}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Internship
          </button>
          <button
            onClick={() => router.push('/admin/internships/bulk')}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
            Bulk Upload
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Software Development">Software Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Operations">Operations</option>
              <option value="Research">Research</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Business Development">Business Development</option>
              <option value="Product Management">Product Management</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Internships Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Internships ({filteredInternships.length})</h3>
          </div>
          <div className="overflow-x-auto">
            {filteredInternships.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No internships found
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInternships.map((internship) => (
                    <tr key={internship.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{internship.title}</div>
                          <div className="text-sm text-gray-500">{internship.stipend}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={internship.companyLogo} 
                            alt={internship.company}
                            className="h-8 w-8 rounded-full mr-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-logo.svg';
                            }}
                          />
                          <div className="text-sm font-medium text-gray-900">{internship.company}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{internship.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{internship.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{internship.duration}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(internship.postedAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          internship.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {internship.isActive ? 'active' : 'inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(internship.applyLink, '_blank')}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Application"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/internships/${internship.id}/edit`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInternship(internship.id, internship.title)}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                            disabled={deletingId === internship.id}
                          >
                            {deletingId === internship.id ? (
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
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 