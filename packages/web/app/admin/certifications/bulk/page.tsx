'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeftIcon, DocumentArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface CertificationData {
  title: string;
  provider: string;
  category: string;
  link: string;
}

export default function BulkUploadCertificationsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<CertificationData[]>([]);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
      setPreview([]);
      
      // Preview CSV content
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          const data: CertificationData[] = [];
          for (let i = 1; i < Math.min(lines.length, 6); i++) { // Preview first 5 rows
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim());
              if (values.length >= 4) {
                data.push({
                  title: values[0] || '',
                  provider: values[1] || '',
                  category: values[2] || '',
                  link: values[3] || ''
                });
              }
            }
          }
          setPreview(data);
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('/api/certifications/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      setSuccess(`Successfully uploaded ${response.data.count} certifications!`);
      setFile(null);
      setPreview([]);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `title,provider,category,link
"AWS Cloud Practitioner","Amazon Web Services","Cloud Computing","https://aws.amazon.com/certification/certified-cloud-practitioner/"
"Google Cloud Digital Leader","Google Cloud","Cloud Computing","https://cloud.google.com/certification/cloud-digital-leader"
"Microsoft Azure Fundamentals","Microsoft","Cloud Computing","https://docs.microsoft.com/en-us/certifications/azure-fundamentals/"
"Python Programming","Coursera","Programming","https://www.coursera.org/learn/python"
"Data Science Fundamentals","edX","Data Science","https://www.edx.org/course/data-science"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certifications-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Certifications</h1>
              <p className="text-gray-600">Upload multiple certifications via CSV file</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload File</h3>
            <div>
              <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <input
                  id="file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-500 font-medium">
                    Choose a file
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  CSV files up to 1000 certifications per upload
                </p>
              </div>
              {file && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800">{file.name}</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
            >
              <DocumentArrowUpIcon className="h-5 w-5" />
              <span>{uploading ? 'Uploading...' : 'Upload Certifications'}</span>
            </button>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4">
                {success}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            {/* Template Download */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Download Template</h3>
              <p className="text-sm text-gray-600 mb-4">
                Use our template to ensure your data is formatted correctly.
              </p>
              <button
                onClick={downloadTemplate}
                className="btn-secondary flex items-center space-x-2"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>Download CSV Template</span>
              </button>
            </div>

            {/* Required Fields */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Required Fields</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">title</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">provider</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">category</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">link</span>
                  <span className="text-red-600">Required</span>
                </div>
              </div>
            </div>

            {/* Format Guidelines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Format Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Only CSV files are supported</li>
                <li>• Maximum 1000 certifications per upload</li>
                <li>• All fields are required</li>
                <li>• The link should be a valid URL</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {preview.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">File Preview (First 5 rows)</h2>
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
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.provider}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {item.link}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 