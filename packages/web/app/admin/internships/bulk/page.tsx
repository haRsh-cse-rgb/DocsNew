"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, DocumentArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from "react-hot-toast";
import axios from "axios";

const REQUIRED_FIELDS = [
  "title",
  "company",
  "location",
  "startDate",
  "endDate",
  "stipend",
  "duration",
  "applyLink",
  "description",
  "skills",
  "category",
  "batch", // Add batch as required field
];

export default function BulkUploadInternships() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please select a valid Excel or CSV file');
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
      setErrors([]);
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
      const response = await axios.post('/api/internships/bulk-upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadResult(response.data);
      if (response.data.success) {
        toast.success(response.data.message || 'Bulk upload successful!');
        setErrors(response.data.errors || []);
      } else {
        toast.error(response.data.message || 'Bulk upload failed.');
        setErrors(response.data.errors || []);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
      setErrors(error.response?.data?.errors || []);
    } finally {
      setUploading(false);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Internships</h1>
              <p className="text-gray-600">Upload multiple internships via Excel or CSV file</p>
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
                <span>{uploading ? 'Uploading...' : 'Upload Internships'}</span>
              </button>
            </form>
            {uploadResult && (
              <div className={`mt-6 p-4 rounded-lg ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h4 className={`font-semibold mb-2 ${uploadResult.success ? 'text-green-700' : 'text-red-700'}`}>{uploadResult.message}</h4>
                {errors.length > 0 && (
                  <ul className="list-disc list-inside text-red-600 text-sm max-h-40 overflow-y-auto">
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            {/* Template Download */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Download Template</h3>
              <p className="text-sm text-gray-600 mb-4">
                Use our template to ensure your data is formatted correctly.<br />
                <b>Batch</b> should be a comma separated list (e.g. <code>2024,2025</code>).
              </p>
              <a
                href="/internships-sample-data.csv"
                download
                className="btn-secondary flex items-center space-x-2"
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>Download CSV Template</span>
              </a>
            </div>
            {/* Required Fields */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Required Fields</h3>
              <div className="space-y-2 text-sm">
                {REQUIRED_FIELDS.map((field) => (
                  <div key={field} className="flex justify-between">
                    <span className="text-gray-600">{field}</span>
                    <span className="text-red-600">Required</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 