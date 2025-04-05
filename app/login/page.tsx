'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { showWelcomeToast } from '@/components/WelcomeToast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    
      if (error) {
        setError(error.message);
        toast.error('Login failed: ' + error.message);
      } else {
        showWelcomeToast();
        router.push('/');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="m-auto w-full max-w-md px-4 py-8 sm:px-0">
        <div className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-850 ring-1 ring-gray-200 dark:ring-gray-700">
          <div className="px-6 py-8 sm:px-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Welcome Back</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sign in to access your account
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              
              <div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
              

            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Create One!
                </Link>
              </p>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
}