import { useState, useEffect } from 'react';  // Added useEffect
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { authApi } from '../../utils/api';
import Button from '../UI/Button';
import Input from '../UI/Input';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Debug: Log API URL when component mounts
  useEffect(() => {
    console.log('API URL:', {
      url: process.env.NEXT_PUBLIC_API_URL,
      isDefined: !!process.env.NEXT_PUBLIC_API_URL
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    // Debug: Log registration attempt
    console.log('Attempting registration with:', {
      email: formData.email,
      passwordLength: formData.password.length,
      apiUrl: process.env.NEXT_PUBLIC_API_URL
    });

    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
      });

      // Debug: Log successful response
      console.log('Registration response:', response);

      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      // Debug: Log detailed error information
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      // More specific error messages
      if (error.response?.status === 409) {
        toast.error('Email already registered');
      } else if (error.response?.status === 422) {
        toast.error('Invalid email or password format');
      } else {
        toast.error(
          error.response?.data?.detail || 
          'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        placeholder="Enter your email"
        className="w-full"
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        minLength={6}
        placeholder="Enter your password"
        className="w-full"
      />
      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        required
        minLength={6}
        placeholder="Confirm your password"
        className="w-full"
      />
      <Button 
        type="submit" 
        disabled={loading}
        className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>

      {/* Add a link to login */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}