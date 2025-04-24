import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { resumeApi } from '../../utils/api';
import Button from '../UI/Button';
import { AnalysisResult, OptimizationResult } from '../../types/resume';

// Add these imports
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function ResumeItem({ resume, onDelete, jobDescriptions = [] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await resumeApi.analyze(resume.id);
      setAnalysisResult(response.data);
      setIsAnalyzeModalOpen(true);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze resume');
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!selectedJobId) {
      toast.error('Please select a job description');
      return;
    }

    setLoading(true);
    try {
      const response = await resumeApi.optimize(resume.id, selectedJobId);
      setOptimizationResult(response.data);
      setIsOptimizeModalOpen(true);
      toast.success('Resume optimized successfully!');
    } catch (error) {
      toast.error('Failed to optimize resume');
      console.error('Optimization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const AnalysisModal = () => (
    <Transition appear show={isAnalyzeModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsAnalyzeModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Resume Analysis Results
                </Dialog.Title>
                <div className="mt-4">
                  {analysisResult && (
                    <div className="space-y-4">
                      {/* Customize this based on your analysis result structure */}
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="font-medium">Strengths</h4>
                        <ul className="mt-2 list-disc pl-5">
                          {analysisResult.strengths?.map((strength, index) => (
                            <li key={index} className="text-green-600">
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="font-medium">Areas for Improvement</h4>
                        <ul className="mt-2 list-disc pl-5">
                          {analysisResult.improvements?.map((improvement, index) => (
                            <li key={index} className="text-amber-600">
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="font-medium">Score</h4>
                        <div className="mt-2 text-2xl font-bold text-blue-600">
                          {analysisResult.score}/100
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => setIsAnalyzeModalOpen(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  const OptimizeModal = () => (
    <Transition appear show={isOptimizeModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOptimizeModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Optimization Results
                </Dialog.Title>
                <div className="mt-4">
                  {optimizationResult && (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="font-medium">Suggested Changes</h4>
                        <div className="mt-2 whitespace-pre-wrap">
                          {optimizationResult.suggestions}
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <h4 className="font-medium">Optimized Content</h4>
                        <div className="mt-2 whitespace-pre-wrap">
                          {optimizationResult.optimized_content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => setIsOptimizeModalOpen(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium">{resume.title}</h3>
      <p className="mt-2 text-gray-600 truncate">{resume.content}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <Button
          onClick={() => router.push(`/resumes/${resume.id}`)}
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
        <Button
          onClick={() => setIsOptimizeModalOpen(true)}
          variant="primary"
          disabled={loading}
        >
          Optimize
        </Button>
        <Button
          onClick={onDelete}
          variant="danger"
          disabled={loading}
        >
          Delete
        </Button>
      </div>

      {/* Render Modals */}
      <AnalysisModal />
      <OptimizeModal />

      {/* Job Selection Modal */}
      <Transition appear show={isOptimizeModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOptimizeModalOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Select Job Description
                </Dialog.Title>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                >
                  <option value="">Select a job description...</option>
                  {jobDescriptions.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => setIsOptimizeModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleOptimize}
                    disabled={!selectedJobId || loading}
                  >
                    {loading ? 'Optimizing...' : 'Optimize'}
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}