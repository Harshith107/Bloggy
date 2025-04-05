'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
  
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      setError(error.message);
      toast.error('Signup failed: ' + error.message);
    } else {
      toast.success('Confirmation email sent! Please check your inbox.');
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 space-y-4 border rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" onClick={handleSignup}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}
