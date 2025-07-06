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
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

interface SarkariJob {
  jobId: string;
  postName: string;
  organization: string;
  advertisementNo?: string;
  applicationFee?: string;
  vacancyDetails?: string;
  eligibility?: string;
  officialWebsite: string;
  notificationLink: string;
  status: string;
  createdAt: string;
}

export default function SarkariJobsManagement() {
  const [jobs, setJobs] = useState<SarkariJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchJobs();
  }, [router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sarkari-jobs?limit=100');
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching sarkari jobs:', error);
      toast.error('Failed to fetch government jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this government job?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/sarkari-jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Government job deleted successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting sarkari job:', error);
      toast.error('Failed to delete government job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.postName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrganization = !filterOrganization || job.organization === filterOrganization;
    const matchesStatus = !filterStatus || job.status === filterStatus;
    
    return matchesSearch && matchesOrganization && matchesStatus;
  });

  const organizations = Array.from(new Set(jobs.map(job => job.organization)));
  const statuses = Array.from(new Set(jobs.map(job => job.status)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading government jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Government Jobs Management</h1>
              <p className="text-gray-600">Manage government job postings</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Go to Dashboard</span>
              </button>
              <button
                onClick={() => router.push('/admin/sarkari-jobs/bulk')}
                className="btn-secondary flex items-center space-x-2"
              >
                <DocumentArrowUpIcon className="h-5 w-5" />
                <span>Bulk Upload</span>
              </button>
              <button
                onClick={() => router.push('/admin/sarkari-jobs/new')}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Job</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Organization Filter */}
            <select
              value={filterOrganization}
              onChange={(e) => setFilterOrganization(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Organizations</option>
              {organizations.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterOrganization('');
                setFilterStatus('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Government Jobs ({filteredJobs.length})
            </h2>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No government jobs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Advertisement No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job.jobId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{job.postName}</div>
                          {job.applicationFee && (
                            <div className="text-sm text-gray-500">Fee: {job.applicationFee}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-8 w-8 text-gray-400 mr-3" />
                          <div className="text-sm text-gray-900">{job.organization}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.advertisementNo || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : job.status === 'result-out'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <a
                            href={job.notificationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                            title="View Notification"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => router.push(`/admin/sarkari-jobs/${job.jobId}/edit`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.jobId)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 