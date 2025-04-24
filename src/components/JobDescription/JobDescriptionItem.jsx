import { useRouter } from 'next/router';
import Button from '../UI/Button';

export default function JobDescriptionItem({ job, onDelete }) {
  const router = useRouter();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium">{job.title}</h3>
      <p className="mt-2 text-gray-600 truncate">{job.content}</p>
      <div className="mt-4 flex space-x-4">
        <Button
          onClick={() => router.push(`/job-descriptions/${job.id}`)}
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          onClick={onDelete}
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}