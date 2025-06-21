'use client';

import { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  CloudArrowUpIcon, 
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { Job } from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';

interface CVAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

interface WeaknessObject {
  originalLine: string;
  improvedLine: string;
}

interface ImprovementObject {
  suggestion: string;
}

interface AnalysisResult {
  compatibilityScore: number;
  strengths: string[];
  weaknesses: (string | WeaknessObject)[];
  improvements: (string | ImprovementObject)[];
  matchingSkills: string[];
  missingSkills: string[];
  error?: string;
}

interface SuggestedJob {
  jobId: string;
  role: string;
  companyName: string;
  location: string;
  matchScore: number;
}

export default function CVAnalysisModal({ isOpen, onClose, job }: CVAnalysisModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Please upload a PDF file');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);

      // Step 1: Get pre-signed URL
      const urlResponse = await axios.get('/api/s3/pre-signed-url?fileType=' + encodeURIComponent(file.type));
      const { uploadUrl, key } = urlResponse.data;

      // Step 2: Upload file to S3
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      setUploading(false);
      setAnalyzing(true);

      // Step 3: Analyze CV
      const analysisResponse = await axios.post('/api/ai/analyze-cv', {
        jobId: job.jobId,
        cvS3Key: key,
      });

      const analysisData = analysisResponse.data;
      setAnalysis(analysisData.analysis);
      setSuggestedJobs(analysisData.suggestedJobs || []);

      toast.success('CV analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        (typeof error.response.data === 'string' || error.response.data?.message)
      ) {
        toast.error(
          typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message
        );
      } else {
        toast.error(error instanceof Error ? error.message : 'Analysis failed');
      }
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setAnalysis(null);
    setSuggestedJobs([]);
    setUploading(false);
    setAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success-100';
    if (score >= 60) return 'bg-warning-100';
    return 'bg-error-100';
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                AI-Powered CV Analysis
              </Dialog.Title>
              <p className="text-sm text-gray-600 mt-1">
                Analyzing for: <span className="font-medium">{job.role}</span> at <span className="font-medium">{job.companyName}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {!analysis ? (
              /* Upload Section */
              <div className="space-y-6">
                <div className="text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Upload Your CV</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Get instant feedback on how well your CV matches this job
                  </p>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-400 transition-colors duration-200">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {file ? (
                    <div className="text-center">
                      <DocumentTextIcon className="mx-auto h-8 w-8 text-primary-600" />
                      <p className="mt-2 text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                      >
                        Choose different file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-primary"
                      >
                        Choose File
                      </button>
                      <p className="mt-2 text-xs text-gray-500">
                        Supports PDF (max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Analyze Button */}
                <div className="text-center">
                  <button
                    onClick={handleUploadAndAnalyze}
                    disabled={!file || uploading || analyzing}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                  >
                    <SparklesIcon className="h-5 w-5" />
                    <span>
                      {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Analyze CV'}
                    </span>
                  </button>
                </div>

                {/* Loading States */}
                {(uploading || analyzing) && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      <span>
                        {uploading ? 'Uploading your CV...' : 'AI is analyzing your CV...'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : analysis.error ? (
              <div className="text-center text-red-600 font-semibold py-8">
                {analysis.error}
                <div className="mt-6">
                  <button
                    onClick={resetModal}
                    className="btn-secondary"
                  >
                    Analyze Another CV
                  </button>
                </div>
              </div>
            ) : (
              /* Analysis Results */
              <div className="space-y-6">
                {/* Compatibility Score */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(analysis.compatibilityScore)} mb-4`}>
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.compatibilityScore)}`}>
                      {analysis.compatibilityScore}%
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Compatibility Score</h3>
                  <p className="text-sm text-gray-600">
                    {analysis.compatibilityScore >= 80 ? 'Excellent match!' : 
                     analysis.compatibilityScore >= 60 ? 'Good match with room for improvement' : 
                     'Consider strengthening your profile'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-success-600" />
                      <h4 className="font-semibold text-gray-900">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-success-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
                      <h4 className="font-semibold text-gray-900">Areas to Improve</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-warning-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span>
                            {typeof weakness === 'string'
                              ? weakness
                              : weakness.originalLine && weakness.improvedLine
                                ? <>
                                    <span className="font-semibold">Original:</span> {weakness.originalLine}<br/>
                                    <span className="font-semibold">Improved:</span> {weakness.improvedLine}
                                  </>
                                : typeof (weakness as any).suggestion === 'string'
                                  ? (weakness as any).suggestion
                                  : JSON.stringify(weakness)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Improvements */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <LightBulbIcon className="h-5 w-5 text-primary-600" />
                    <h4 className="font-semibold text-gray-900">Improvement Suggestions</h4>
                  </div>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{typeof improvement === 'string' ? improvement : improvement.suggestion || JSON.stringify(improvement)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Comparison */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Matching Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchingSkills.map((skill, index) => (
                        <span key={index} className="badge-success text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Missing Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map((skill, index) => (
                        <span key={index} className="badge-error text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggested Jobs */}
                {suggestedJobs.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Suggested Jobs Based on Your Profile</h4>
                    <div className="space-y-3">
                      {suggestedJobs.map((suggestedJob) => (
                        <div key={suggestedJob.jobId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h5 className="font-medium text-gray-900">{suggestedJob.role}</h5>
                            <p className="text-sm text-gray-600">{suggestedJob.companyName} • {suggestedJob.location}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">
                              {suggestedJob.matchScore} skill matches
                            </span>
                            <a
                              href={`/jobs/${suggestedJob.jobId}`}
                              className="btn-outline text-sm py-1 px-3"
                            >
                              View Job
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={resetModal}
                    className="btn-secondary flex-1"
                  >
                    Analyze Another CV
                  </button>
                  <a
                    href={job.originalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1 text-center"
                  >
                    Apply for This Job
                  </a>
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}