import { Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobFilters from './components/JobFilters';
import JobGrid from './components/JobGrid';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <Suspense fallback={<LoadingSpinner />}>
                <JobFilters />
              </Suspense>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <JobGrid />
            </Suspense>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}