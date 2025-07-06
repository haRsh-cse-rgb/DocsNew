"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditSarkariJob() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    postName: "",
    organization: "",
    advertisementNo: "",
    applicationStart: "",
    applicationEnd: "",
    examDate: "",
    applicationFee: "",
    vacancyDetails: "",
    eligibility: "",
    officialWebsite: "",
    notificationLink: "",
    applyLink: "",
    resultLink: ""
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setFetching(true);
        const response = await axios.get(`/api/sarkari-jobs/${jobId}`);
        const job = response.data;
        setFormData({
          postName: job.postName || "",
          organization: job.organization || "",
          advertisementNo: job.advertisementNo || "",
          applicationStart: job.importantDates?.applicationStart || "",
          applicationEnd: job.importantDates?.applicationEnd || "",
          examDate: job.importantDates?.examDate || "",
          applicationFee: job.applicationFee || "",
          vacancyDetails: job.vacancyDetails || "",
          eligibility: job.eligibility || "",
          officialWebsite: job.officialWebsite || "",
          notificationLink: job.notificationLink || "",
          applyLink: job.applyLink || "",
          resultLink: job.resultLink || ""
        });
      } catch (error) {
        toast.error("Failed to fetch government job details");
        router.push("/admin/sarkari-jobs");
      } finally {
        setFetching(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId, router]);

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
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const jobData = {
        ...formData,
        importantDates: {
          applicationStart: formData.applicationStart,
          applicationEnd: formData.applicationEnd,
          examDate: formData.examDate
        }
      };
      await axios.put(`/api/admin/sarkari-jobs/${jobId}`, jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Government job updated successfully!");
      router.push("/admin/sarkari-jobs");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to update government job";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const organizations = [
    "UPSC",
    "SSC",
    "IBPS",
    "SBI",
    "Railway",
    "Defense",
    "Teaching",
    "State PSC",
    "Other"
  ];

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading government job details...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Edit Government Job</h1>
              <p className="text-gray-600">Update government job posting details</p>
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
            {/* Other Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Other Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vacancyDetails" className="block text-sm font-medium text-gray-700 mb-2">
                    Vacancy Details
                  </label>
                  <input
                    type="text"
                    id="vacancyDetails"
                    name="vacancyDetails"
                    value={formData.vacancyDetails}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 100 Posts"
                  />
                </div>
                <div>
                  <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-2">
                    Eligibility
                  </label>
                  <input
                    type="text"
                    id="eligibility"
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Graduate"
                  />
                </div>
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
                    placeholder="https://example.com"
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
                    placeholder="https://example.com/notification.pdf"
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
                    placeholder="https://example.com/apply"
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
                    placeholder="https://example.com/result"
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex space-x-4 justify-end">
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
                <PencilIcon className="h-5 w-5" />
                <span>{loading ? "Updating..." : "Update Job"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 