'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Footer() {
  const [jobCategories, setJobCategories] = useState<string[]>([]);
  const [internshipCategories, setInternshipCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch job categories
    const fetchJobCategories = async () => {
      try {
        const response = await axios.get('/api/jobs?limit=1000');
        const jobs = response.data.jobs || [];
        const uniqueCategories = Array.from(new Set(
          jobs.map((job: any) => job.category).filter((cat: any): cat is string => cat && typeof cat === 'string')
        )).sort() as string[];
        setJobCategories(uniqueCategories.slice(0, 8)); // Show max 8 categories
      } catch (error) {
        console.error('Error fetching job categories:', error);
        setJobCategories([]);
      }
    };

    // Fetch internship categories
    const fetchInternshipCategories = async () => {
      try {
        const response = await axios.get('/api/internships?limit=1000');
        const internships = response.data.internships || [];
        const uniqueCategories = Array.from(new Set(
          internships.map((internship: any) => internship.category).filter((cat: any): cat is string => cat && typeof cat === 'string')
        )).sort() as string[];
        setInternshipCategories(uniqueCategories.slice(0, 8)); // Show max 8 categories
      } catch (error) {
        console.error('Error fetching internship categories:', error);
        setInternshipCategories([]);
      }
    };

    fetchJobCategories();
    fetchInternshipCategories();
  }, []);

  return (
    <footer className="bg-black text-gray-200 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/IndiaJobs.png" alt="India Jobs Logo" className="h-12 w-12 bg-white rounded-full shadow p-1" />
              <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                India <span style={{ color: '#FF9800' }}>J</span>obs
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted platform for finding the best job opportunities across India. 
              From private sector jobs to government positions, internships to walk-ins - 
              we connect you with your dream career.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Telegram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Job Categories</h3>
            <ul className="space-y-2">
              {jobCategories.length > 0 ? (
                jobCategories.map((category) => (
                  <li key={category}>
                    <Link 
                      href={`/jobs/category/${encodeURIComponent(category)}`} 
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {category}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading categories...</li>
              )}
            </ul>
          </div>

          {/* Internship Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Internship Categories</h3>
            <ul className="space-y-2">
              {internshipCategories.length > 0 ? (
                internshipCategories.map((category) => (
                  <li key={category}>
                    <Link 
                      href={`/internships/category/${encodeURIComponent(category)}`} 
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {category}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading categories...</li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Private Jobs
                </Link>
              </li>
              <li>
                <Link href="/government-jobs" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Government Jobs
                </Link>
              </li>
              <li>
                <Link href="/walking" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Walk-ins
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Certifications
                </Link>
              </li>
              <li>
                <Link href="/internships" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} India Jobs. All rights reserved. Built with ❤️ for job seekers.
          </p>
        </div>
      </div>
    </footer>
  );
}