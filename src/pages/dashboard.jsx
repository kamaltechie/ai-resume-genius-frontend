// src/pages/dashboard.jsx
import { useState, useEffect } from 'react';
import { useProtectedRoute } from '../utils/auth';
import ResumeList from '../components/Resume/ResumeList';
import JobDescriptionList from '../components/JobDescription/JobDescriptionList';
import Button from '../components/UI/Button';
import { useRouter } from 'next/router';
import { jobApi } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  useProtectedRoute();
  const router = useRouter();
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  const fetchJobDescriptions = async () => {
    try {
      const response = await jobApi.getAll();
      setJobDescriptions(response.data);
    } catch (error) {
      toast.error('Failed to fetch job descriptions');
      console.error('Error fetching job descriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Button
            onClick={() => router.push('/resumes/new')}
            variant="primary"
          >
            Create Resume
          </Button>
          <Button
            onClick={() => router.push('/job-descriptions/new')}
            variant="secondary"
          >
            Add Job Description
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
          <ResumeList jobDescriptions={jobDescriptions} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Job Descriptions</h2>
          <JobDescriptionList 
            jobDescriptions={jobDescriptions}
            setJobDescriptions={setJobDescriptions}
          />
        </section>
      </div>
    </div>
  );
}