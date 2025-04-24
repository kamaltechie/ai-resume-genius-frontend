import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { jobApi } from '../../utils/api';
import JobDescriptionItem from './JobDescriptionItem';
import Loading from '../UI/Loading';

export default function JobDescriptionList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobApi.getAll();
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to load job descriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await jobApi.delete(id);
      toast.success('Job description deleted successfully');
      setJobs(jobs.filter(job => job.id !== id));
    } catch (error) {
      toast.error('Failed to delete job description');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center">No job descriptions found</p>
      ) : (
        jobs.map(job => (
          <JobDescriptionItem
            key={job.id}
            job={job}
            onDelete={() => handleDelete(job.id)}
          />
        ))
      )}
    </div>
  );
}