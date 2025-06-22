export interface Job {
  jobId: string;
  category: string;
  role: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary: string;
  jobDescription: string;
  originalLink: string;
  postedOn: string;
  expiresOn: string;
  tags?: string[];
  batch?: string[];
  status: 'active' | 'expired';
  experience?: string;
}

export interface SarkariJob {
  jobId: string;
  organization: string;
  postName: string;
  advertisementNo?: string;
  importantDates?: {
    applicationStart?: string;
    applicationEnd?: string;
    examDate?: string;
  };
  applicationFee?: string;
  vacancyDetails?: string;
  eligibility?: string;
  officialWebsite: string;
  notificationLink: string;
  applyLink?: string;
  resultLink?: string;
  status: 'active' | 'result-out' | 'closed';
  createdAt?: string;
}

export interface Admin {
  email: string;
  role: 'superadmin' | 'editor';
  createdAt: string;
}

export interface Subscription {
  email: string;
  category: string;
  subscribedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: PaginationInfo;
}

export interface SarkariJobsResponse {
  jobs: SarkariJob[];
  pagination: PaginationInfo;
}