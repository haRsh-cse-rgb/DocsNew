"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditInternshipPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    async function fetchInternship() {
      try {
        const res = await axios.get(`https://api.india-jobs.in/api/v1/internships/${id}`);
        const data = res.data.internship;
        setForm({
          title: data.title || "",
          company: data.company || "",
          location: data.location || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          stipend: data.stipend || "",
          duration: data.duration || "",
          applyLink: data.applyLink || "",
          description: data.description || "",
          skills: data.skills ? data.skills.join(",") : "",
          category: data.category || "",
          batch: data.batch ? data.batch.join(",") : "",
        });
      } catch (err) {
        toast.error("Failed to fetch internship data");
      } finally {
        setLoading(false);
      }
    }
    fetchInternship();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        batch: form.batch.split(",").map((b) => b.trim()).filter(Boolean),
      };
      await axios.put(`https://api.india-jobs.in/api/v1/internships/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Internship updated successfully");
      router.push("/admin/internships");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update internship");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Internship</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input type="text" name="company" value={form.company} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} className="input-field" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
            <input type="text" name="stipend" value={form.stipend} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input type="text" name="duration" value={form.duration} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link</label>
          <input type="url" name="applyLink" value={form.applyLink} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input type="text" name="category" value={form.category} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch (comma separated, e.g. 2024,2025)</label>
          <input type="text" name="batch" value={form.batch} onChange={handleChange} className="input-field" placeholder="2024,2025" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
          <input type="text" name="skills" value={form.skills} onChange={handleChange} className="input-field" placeholder="JavaScript,React,Python" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={4} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Updating..." : "Update Internship"}
        </button>
      </form>
    </div>
  );
} 