'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showInternshipCategories, setShowInternshipCategories] = useState(false);
  const [internshipCategories, setInternshipCategories] = useState<string[]>([]);
  
  // Internship categories - same as in InternshipFilters
  // const internshipCategories = [
  //   'Software Development',
  //   'Data Science',
  //   'Marketing',
  //   'Finance',
  //   'Design',
  //   'Sales',
  //   'HR',
  //   'Operations',
  //   'Research',
  //   'Content Writing',
  //   'Business Development',
  //   'Product Management'
  // ];

  useEffect(() => {
    // Fetch categories from backend for jobs
    async function fetchCategories() {
      try {
        const response = await axios.get('https://api.india-jobs.in/api/v1/jobs?limit=1000'); // adjust as needed
        const jobs: any[] = response.data.jobs || [];
        const uniqueCategories: string[] = Array.from(new Set(jobs.map((j: any) => j.category).filter((cat: any): cat is string => typeof cat === 'string' && !!cat)));
        setCategories(uniqueCategories);
      } catch (err) {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch categories from backend for internships
    async function fetchInternshipCategories() {
      try {
        const response = await axios.get('https://api.india-jobs.in/api/v1/internships?limit=1000');
        const internships: any[] = response.data.internships || [];
        const uniqueCategories: string[] = Array.from(new Set(internships.map((i: any) => i.category).filter((cat: any): cat is string => typeof cat === 'string' && !!cat)));
        setInternshipCategories(uniqueCategories);
      } catch (err) {
        setInternshipCategories([]);
      }
    }
    fetchInternshipCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        setShowCategories(false);
        setShowInternshipCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/IndiaJobs.png" alt="India Jobs Logo" className="h-12 w-12" />
            <span className="text-2xl font-bold text-gray-900 flex items-center font-inter" style={{ lineHeight: '1', fontFamily: 'Inter, sans-serif' }}>
              <span className="flex flex-row items-center gap-1">
                <span>India</span>
                <span>
                  <span style={{ color: '#FF9800' }}>J</span>obs
                </span>
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 flex items-center space-x-1"
                onClick={() => setShowCategories((v) => !v)}
                type="button"
              >
                Jobs
                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showCategories && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  {categories.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">No categories</div>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/jobs/category/${encodeURIComponent(cat)}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={() => setShowCategories(false)}
                      >
                        {cat}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            <Link 
              href="/government-jobs" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Government Jobs
            </Link>
            <div className="relative inline-block">
  <button
    className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 flex items-center space-x-1"
    onClick={() => setShowInternshipCategories((v) => !v)}
    type="button"
  >
    Internships
    <svg
      className="h-4 w-4 ml-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {showInternshipCategories && (
    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto shadow-lg z-50">
      {/* ✅ "All" option at top */}
      <Link
        href="/internships"
        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
        onClick={() => setShowInternshipCategories(false)}
      >
        All
      </Link>

      {internshipCategories.length === 0 ? (
        <div className="px-4 py-2 text-gray-500">No categories</div>
      ) : (
        internshipCategories.map((cat) => (
          <Link
            key={cat}
            href={`/internships/category/${encodeURIComponent(cat)}`}
            className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            onClick={() => setShowInternshipCategories(false)}
          >
            {cat}
          </Link>
        ))
      )}
    </div>
  )}
</div>


            <Link 
              href="/certifications"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              
              Certifications
            </Link>
            <Link 
              href="/walking"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Walk-In Jobs
            </Link>
            <div className="relative">
  
</div>

            
            {/* <Link 
              href="/admin/login" 
              className="btn-primary"
            >
              Admin Login
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-2"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link 
                href="/government-jobs" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Government Jobs
              </Link>
              <Link 
                href="/internships" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Internships
              </Link>
              <Link 
                href="/certifications" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Certifications
              </Link>
              <Link 
                href="/walking" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Walking
              </Link>
              {/* <Link 
                href="/internships" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Internships
              </Link> */}
              {/* <Link 
                href="/sarkari-results" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Results
              </Link> */}
              {/* <Link 
                href="/admin/login" 
                className="btn-primary inline-block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}