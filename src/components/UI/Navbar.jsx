import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './Button';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Resume Builder
            </Link>
            {session && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-900">
                  Dashboard
                </Link>
                <Link href="/resumes" className="px-3 py-2 text-sm font-medium text-gray-900">
                  Resumes
                </Link>
                <Link href="/job-descriptions" className="px-3 py-2 text-sm font-medium text-gray-900">
                  Job Descriptions
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {session ? (
              <Button onClick={() => signOut()} variant="secondary">
                Sign Out
              </Button>
            ) : (
              <div className="space-x-4">
                <Link href="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}