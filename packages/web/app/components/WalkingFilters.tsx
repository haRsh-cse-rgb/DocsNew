'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FilterState {
  category: string;
  location: string;
}

interface WalkingFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function WalkingFilters({ filters, onFilterChange }: WalkingFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.india-jobs.in/api/v1/walking/filters`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories || []);
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
    
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
    const newFilters = {
      category: '',
      location: ''
    };
    onFilterChange(newFilters);
    
    // Clear URL parameters
    const url = new URL(window.location.href);
    ['category', 'location'].forEach(key => {
      url.searchParams.delete(key);
    });
    window.history.pushState({}, '', url.toString());
    
    window.dispatchEvent(new CustomEvent('filtersUpdate'));
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600 ml-2">Loading filters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Filters in one row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  <span className="capitalize">{key}:</span>
                  <span className="ml-1 font-medium">{value}</span>
                  <button
                    onClick={() => handleFilterChange(key as keyof FilterState, '')}
                    className="ml-2 hover:text-blue-600"
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
  );
} 