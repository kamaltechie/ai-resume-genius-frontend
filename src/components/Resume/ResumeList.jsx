// src/components/Resume/ResumeList.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { resumeApi } from '../../utils/api';
import ResumeItem from './ResumeItem';
import Loading from '../UI/Loading';

export default function ResumeList({ jobDescriptions = [] }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumeApi.getAll();
      setResumes(response.data);
    } catch (error) {
      console.error('Error loading resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await resumeApi.delete(id);
      toast.success('Resume deleted successfully');
      setResumes(resumes.filter(resume => resume.id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const handleAnalysisComplete = (resumeId, analysisData) => {
    // Update the resume with analysis data if needed
    setResumes(resumes.map(resume => 
      resume.id === resumeId 
        ? { ...resume, analysis: analysisData }
        : resume
    ));
  };

  const handleOptimizationComplete = (resumeId, optimizedData) => {
    // Update the resume with optimized data if needed
    setResumes(resumes.map(resume => 
      resume.id === resumeId 
        ? { ...resume, optimized: optimizedData }
        : resume
    ));
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {resumes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No resumes found</p>
          <p className="text-gray-400 mt-2">
            Create your first resume to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map(resume => (
            <ResumeItem
              key={resume.id}
              resume={resume}
              jobDescriptions={jobDescriptions}
              onDelete={() => handleDelete(resume.id)}
              onAnalysisComplete={(data) => handleAnalysisComplete(resume.id, data)}
              onOptimizationComplete={(data) => handleOptimizationComplete(resume.id, data)}
            />
          ))}
        </div>
      )}
    </div>
  );
}