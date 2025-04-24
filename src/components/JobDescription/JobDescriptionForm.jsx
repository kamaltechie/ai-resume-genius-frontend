import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { jobApi } from '../../utils/api';
import Button from '../UI/Button';
import Input from '../UI/Input';

export default function JobDescriptionForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await jobApi.update(initialData.id, formData);
        toast.success('Job description updated successfully!');
      } else {
        await jobApi.create(formData);
        toast.success('Job description created successfully!');
      }
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to save job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : (initialData ? 'Update Job Description' : 'Create Job Description')}
      </Button>
    </form>
  );
}