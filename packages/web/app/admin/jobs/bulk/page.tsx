'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DocumentArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function BulkUploadJobs() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please select a valid Excel or CSV file');
        return;
      }
      
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setUploading(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/admin/jobs/bulk', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResult(response.data);
      toast.success(`Upload completed! ${response.data.successful} jobs created successfully.`);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response?.data?.error || 'Failed to upload file';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `role,companyName,companyLogo,location,salary,jobDescription,originalLink,category,tags,batch,expiresOn
Frontend Developer,Tech Corp,https://example.com/logo.png,Bangalore,₹10-15 LPA,We are looking for a skilled frontend developer...,https://techcorp.com/careers/frontend,Software,"react,javascript,frontend","2024,2025",2024-12-31
Backend Developer,Startup Inc,https://example.com/startup-logo.png,Mumbai,₹12-18 LPA,Join our growing team as a backend developer...,https://startupinc.com/careers/backend,Software,"nodejs,python,backend","2024,2025",2024-12-31`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs-template.csv';
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
              <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Jobs</h1>
              <p className="text-gray-600">Upload multiple jobs via Excel or CSV file</p>
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
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    id="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <span className="text-primary-600 hover:text-primary-500 font-medium">
                      Choose a file
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Excel (.xlsx, .xls) or CSV files up to 10MB
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
                type="submit"
                disabled={!file || uploading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <DocumentArrowUpIcon className="h-5 w-5" />
                <span>{uploading ? 'Uploading...' : 'Upload Jobs'}</span>
              </button>
            </form>
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
                  <span className="text-gray-600">role</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">companyName</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">companyLogo</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">location</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">salary</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">jobDescription</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">originalLink</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">category</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">expiresOn</span>
                  <span className="text-red-600">Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">tags</span>
                  <span className="text-gray-500">Optional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">batch</span>
                  <span className="text-gray-500">Optional</span>
                </div>
              </div>
            </div>

            {/* Format Guidelines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Format Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use comma-separated values for tags and batch fields</li>
                <li>• Date format: YYYY-MM-DD (e.g., 2024-12-31)</li>
                <li>• Company logo should be a valid URL</li>
                <li>• Original link should be a valid URL</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{uploadResult.successful}</div>
                <div className="text-sm text-green-800">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{uploadResult.errors}</div>
                <div className="text-sm text-red-800">Errors</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{uploadResult.successful + uploadResult.errors}</div>
                <div className="text-sm text-blue-800">Total</div>
              </div>
            </div>
            
            {uploadResult.errorDetails && uploadResult.errorDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Error Details:</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {uploadResult.errorDetails.map((error: any, index: number) => (
                    <div key={index} className="text-sm text-red-800">
                      Row {error.row}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 