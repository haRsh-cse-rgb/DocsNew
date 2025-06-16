'use client';

import { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterState {
  category: string;
  location: string;
  batch: string;
  tags: string;
}

export default function JobFilters() {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    location: '',
    batch: '',
    tags: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Categories based on the documentation
  const categories = [
    'Software',
    'HR',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Design',
    'Data Science',
    'Product Management'
  ];

  const locations = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Remote'
  ];

  const batches = ['2024', '2025', '2026', '2027'];

  const popularTags = [
    'React',
    'Node.js',
    'Python',
    'Java',
    'JavaScript',
    'AWS',
    'Docker',
    'Kubernetes',
    'Machine Learning',
    'Frontend',
    'Backend',
    'Full Stack'
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL parameters
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.pushState({}, '', url.toString());
    
    // Trigger update event
    window.dispatchEvent(new CustomEvent('filtersUpdate'));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      batch: '',
      tags: ''
    });
    
    // Clear URL parameters
    const url = new URL(window.location.href);
    ['category', 'location', 'batch', 'tags'].forEach(key => {
      url.searchParams.delete(key);
    });
    window.history.pushState({}, '', url.toString());
    
    window.dispatchEvent(new CustomEvent('filtersUpdate'));
  };

  // Initialize filters from URL on component mount
  useEffect(() => {
    const url = new URL(window.location.href);
    setFilters({
      category: url.searchParams.get('category') || '',
      location: url.searchParams.get('location') || '',
      batch: url.searchParams.get('batch') || '',
      tags: url.searchParams.get('tags') || ''
    });
  }, []);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      <div className="p-6 space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="input-field"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch Year
          </label>
          <select
            value={filters.batch}
            onChange={(e) => handleFilterChange('batch', e.target.value)}
            className="input-field"
          >
            <option value="">All Batches</option>
            {batches.map(batch => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills/Tags
          </label>
          <input
            type="text"
            placeholder="e.g., React, Python, AWS"
            value={filters.tags}
            onChange={(e) => handleFilterChange('tags', e.target.value)}
            className="input-field"
          />
          
          {/* Popular Tags */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Popular tags:</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.slice(0, isExpanded ? popularTags.length : 6).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange('tags', tag)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors duration-200 ${
                    filters.tags === tag
                      ? 'bg-primary-100 text-primary-800 border-primary-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {popularTags.length > 6 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                >
                  {isExpanded ? 'Show Less' : `+${popularTags.length - 6} more`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    <span className="capitalize">{key}:</span>
                    <span className="ml-1 font-medium">{value}</span>
                    <button
                      onClick={() => handleFilterChange(key as keyof FilterState, '')}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}