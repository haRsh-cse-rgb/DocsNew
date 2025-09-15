"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  stipend: "",
  duration: "",
  applyLink: "",
  description: "",
  skills: "",
  category: "",
  batch: "",
};

export default function NewInternship() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!form.title || !form.company || !form.location || !form.applyLink || !form.category) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const payload = {
        ...form,
        batch: form.batch.split(',').map(b => b.trim()).filter(Boolean),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await axios.post(
        "https://api.india-jobs.in/api/v1/internships",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Internship created successfully!");
      router.push("/admin/internships");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create internship."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Add New Internship</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="e.g. Software Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
              <input
                type="text"
                name="stipend"
                value={form.stipend}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 10,000 INR/month"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 3 months"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link *</label>
            <input
              type="url"
              name="applyLink"
              value={form.applyLink}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch (comma separated, e.g. 2024,2025)</label>
            <input
              type="text"
              name="batch"
              value={form.batch}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2024,2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. React, Node.js, Python"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Describe the internship role, requirements, etc."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Internship"}
          </button>
        </form>
      </div>
    </div>
  );
} 