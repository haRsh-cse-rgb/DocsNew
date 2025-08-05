'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CloudArrowUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function BulkUploadWalkingPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/walking/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const result = await response.json();
      setUploadResult(result);

      if (response.ok) {
        alert(`Successfully uploaded ${result.uploaded} walking opportunities!`);
        router.push('/admin/walking');
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

                const downloadTemplate = () => {
                const csvContent = `title,company,location,experience,category,date,time,applyLink
            "Software Engineer Walking","Google","Bangalore, India","0-1 years","Technology","2024-01-15","10:00","https://google.com/apply"
            "Marketing Specialist Walking","Microsoft","Mumbai, India","1-2 years","Marketing","2024-01-20","14:00","https://microsoft.com/apply"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'walking-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Walking Opportunities</h1>
          <p className="mt-2 text-gray-600">Upload multiple walking opportunities from a CSV file</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload CSV File</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  id="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
            </form>

            {uploadResult && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Upload Result</h3>
                <p className="text-sm text-gray-600">
                  Successfully uploaded: {uploadResult.uploaded} walking opportunities
                </p>
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">Errors: {uploadResult.errors.length}</p>
                    <ul className="text-xs text-red-500 mt-1">
                      {uploadResult.errors.slice(0, 3).map((error: any, index: number) => (
                        <li key={index}>• {error.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">CSV Format</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Your CSV file should include the following columns:
                </p>
                                            <ul className="text-sm text-gray-600 space-y-1">
                              <li><strong>title</strong> - Walking opportunity title</li>
                              <li><strong>company</strong> - Company name</li>
                              <li><strong>location</strong> - Location of the walking</li>
                              <li><strong>experience</strong> - Required experience level</li>
                              <li><strong>category</strong> - Category (Technology, Marketing, etc.)</li>
                              <li><strong>date</strong> - Walking date (YYYY-MM-DD)</li>
                              <li><strong>time</strong> - Walking time (HH:MM)</li>
                              <li><strong>applyLink</strong> - Application URL</li>
                            </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Experience Levels</h3>
                <p className="text-sm text-gray-600">
                  Use one of these values: Fresher, 0-1 years, 1-2 years, 2-3 years, 3-5 years, 5+ years
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                <p className="text-sm text-gray-600">
                  Use one of these values: Technology, Marketing, Sales, Finance, Healthcare, Education, Engineering, Design, Operations
                </p>
              </div>

              <div>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Download Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 