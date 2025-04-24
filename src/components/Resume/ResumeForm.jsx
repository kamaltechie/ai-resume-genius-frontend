import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { resumeApi } from '../../utils/api';
import Button from '../UI/Button';
import Input from '../UI/Input';

export default function ResumeForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Log the data being sent
    console.log('Submitting resume data:', formData);

    try {
      if (initialData) {
        const response = await resumeApi.update(initialData.id, formData);
        console.log('Update response:', response);
        toast.success('Resume updated successfully!');
      } else {
        const response = await resumeApi.create(formData);
        console.log('Create response:', response);
        toast.success('Resume created successfully!');
      }
      router.push('/dashboard');
    } catch (error) {
      // Detailed error logging
      console.error('Error saving resume:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  // Add form validation
  const isFormValid = formData.title.trim() && formData.content.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        placeholder="Enter resume title"
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
          placeholder="Enter your resume content here..."
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard')}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !isFormValid}
        >
          {loading ? 'Saving...' : (initialData ? 'Update Resume' : 'Create Resume')}
        </Button>
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <p className="text-sm text-gray-600">Debug Info:</p>
        <pre className="text-xs mt-2">
          {JSON.stringify({ formData, loading }, null, 2)}
        </pre>
      </div>
    </form>
  );
}