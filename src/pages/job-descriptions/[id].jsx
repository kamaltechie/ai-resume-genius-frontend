import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useProtectedRoute } from '../../utils/auth';
import { jobApi } from '../../utils/api';
import JobDescriptionForm from '../../components/JobDescription/JobDescriptionForm';
import Loading from '../../components/UI/Loading';

export default function EditJobDescription() {
  useProtectedRoute();
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && id !== 'new') {
      loadJob();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await jobApi.getById(id);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to load job description');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {id === 'new' ? 'Create New Job Description' : 'Edit Job Description'}
      </h1>
      <JobDescriptionForm initialData={job} />
    </div>
  );
}