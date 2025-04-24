import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useProtectedRoute } from '../../utils/auth';
import { resumeApi } from '../../utils/api';
import ResumeForm from '../../components/Resume/ResumeForm';
import Loading from '../../components/UI/Loading';

export default function EditResume() {
  useProtectedRoute();
  const router = useRouter();
  const { id } = router.query;
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && id !== 'new') {
      loadResume();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadResume = async () => {
    try {
      const response = await resumeApi.getById(id);
      setResume(response.data);
    } catch (error) {
      toast.error('Failed to load resume');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {id === 'new' ? 'Create New Resume' : 'Edit Resume'}
      </h1>
      <ResumeForm initialData={resume} />
    </div>
  );
}