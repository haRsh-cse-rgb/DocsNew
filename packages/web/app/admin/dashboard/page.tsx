'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BriefcaseIcon, 
  PlusIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Dialog } from '@headlessui/react';

interface AdminUser {
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityLoading, setActivityLoading] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', role: 'admin' });
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (!token || !user) {
      toast.error('Please login first');
      router.push('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(user));
    } catch (error) {
      console.error('Error parsing admin user:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        const response = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        setStats(null);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setActivityLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        const response = await axios.get(`/api/admin/recent-activity?page=${activityPage}&limit=20`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentActivity(response.data.activities);
        setActivityTotalPages(response.data.totalPages);
        setActivityTotal(response.data.total);
      } catch (error) {
        setRecentActivity([]);
        setActivityTotalPages(1);
        setActivityTotal(0);
      } finally {
        setActivityLoading(false);
      }
    };
    fetchRecentActivity();
  }, [activityPage]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Not authenticated');
      await axios.post('/api/admin/admins', newAdmin, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Admin created successfully');
      setShowCreateAdminModal(false);
      setNewAdmin({ email: '', password: '', role: 'admin' });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to create admin');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Private Jobs',
      description: 'Manage private sector job postings',
      icon: BriefcaseIcon,
      href: '/admin/jobs',
      color: 'bg-blue-500'
    },
    {
      title: 'Government Jobs',
      description: 'Manage government job postings',
      icon: DocumentTextIcon,
      href: '/admin/sarkari-jobs',
      color: 'bg-green-500'
    },
    {
      title: 'Certifications',
      description: 'Manage free certifications',
      icon: AcademicCapIcon,
      href: '/admin/certifications',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
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
                onClick={() => setShowCreateAdminModal(true)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-900 transition-colors border border-blue-600 px-3 py-1 rounded-md"
              >
                <CogIcon className="h-5 w-5" />
                <span>Create Admin</span>
              </button>
              <span className="text-sm text-gray-600">
                Welcome, {adminUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Create Admin Modal */}
      <Dialog open={showCreateAdminModal} onClose={() => setShowCreateAdminModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6 z-10">
            <Dialog.Title className="text-lg font-bold mb-4">Create New Admin</Dialog.Title>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="input-field w-full"
                  value={newAdmin.email}
                  onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="input-field w-full"
                  value={newAdmin.password}
                  onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  className="input-field w-full"
                  value={newAdmin.role}
                  onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateAdminModal(false)}
                  disabled={creatingAdmin}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={creatingAdmin}
                >
                  {creatingAdmin ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your JobQuest platform</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(card.href)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Private Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats ? stats.totalPrivateJobs : 0}</p>
                <p className="text-sm text-gray-500">Active: {stats ? stats.activePrivateJobs : 0}</p>
              </div>
              <BriefcaseIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Govt Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats ? stats.totalGovtJobs : 0}</p>
                <p className="text-sm text-gray-500">Active: {stats ? stats.activeGovtJobs : 0}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats ? stats.totalCertifications : 0}</p>
                <p className="text-sm text-gray-500">Free certifications</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{stats ? stats.totalSubscriptions : 0}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <span className="text-xs text-gray-500">Total: {activityTotal}</span>
          </div>
          <div className="p-6 overflow-x-auto">
            {activityLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : recentActivity.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No recent activity to display
              </p>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentActivity.map((activity, idx) => (
                      <tr key={activity.id || idx}>
                        <td className="px-4 py-2 whitespace-nowrap font-semibold text-blue-700">{activity.action}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{activity.targetType}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-600">{activity.targetId}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-900">{activity.adminEmail}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">{activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center space-x-2">
                  <button
                    className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                    onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                    disabled={activityPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {activityPage} of {activityTotalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                    onClick={() => setActivityPage(p => Math.min(activityTotalPages, p + 1))}
                    disabled={activityPage === activityTotalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 