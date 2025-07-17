import Link from 'next/link';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { SarkariJob } from '../types';

export default function GovernmentJobCard({ job }: { job: SarkariJob }) {
  return (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {job.postName}
              </h3>
              <p className="text-lg text-gray-700 font-medium">{job.organization}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="badge-secondary capitalize">{job.status}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <span>Advt No: {job.advertisementNo || '-'}</span>
            <span>Fee: {job.applicationFee || '-'}</span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {job.eligibility || 'No eligibility info.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/government-jobs/${job.jobId}`}
              className="btn-secondary flex items-center justify-center flex-1"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 