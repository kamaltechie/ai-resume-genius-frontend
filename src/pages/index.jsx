import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Button from '../components/UI/Button';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Resume Builder Genius
      </h1>
      <p className="text-xl mb-8">
        Create, analyze, and optimize your resume with AI
      </p>
      {session ? (
        <Button onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </Button>
      ) : (
        <div className="space-x-4">
          <Button onClick={() => router.push('/login')} variant="secondary">
            Login
          </Button>
          <Button onClick={() => router.push('/register')}>
            Register
          </Button>
        </div>
      )}
    </div>
  );
}