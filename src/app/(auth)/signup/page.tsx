'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Zap, Loader2, CheckCircle2 } from '@/components/ui/Icons';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

const schema = z.object({
  orgName:   z.string().min(2, 'Organization name required'),
  firstName: z.string().min(1, 'First name required'),
  lastName:  z.string().min(1, 'Last name required'),
  email:     z.string().email('Valid email required'),
  password:  z.string().min(8, 'Minimum 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const { register: reg, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await register(data).unwrap();
      dispatch(setCredentials({ user: result.user, organization: result.organization as any, token: result.token }));
      toast.success('Organization created! Welcome to Omira.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(99,102,241,0.15),transparent)]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">Omira</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your workspace</h1>
          <p className="text-dark-400">Set up your recruiting dashboard in minutes</p>
        </div>

        <div className="bg-dark-900 border border-dark-700/80 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label text-dark-200">Organization Name</label>
              <input {...reg('orgName')} placeholder="Acme Sales Group"
                className="form-input bg-dark-800 border-dark-600 text-white placeholder:text-dark-500 focus:border-brand-500" />
              {errors.orgName && <p className="text-red-400 text-xs mt-1">{errors.orgName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label text-dark-200">First Name</label>
                <input {...reg('firstName')} placeholder="John"
                  className="form-input bg-dark-800 border-dark-600 text-white placeholder:text-dark-500 focus:border-brand-500" />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="form-label text-dark-200">Last Name</label>
                <input {...reg('lastName')} placeholder="Smith"
                  className="form-input bg-dark-800 border-dark-600 text-white placeholder:text-dark-500 focus:border-brand-500" />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="form-label text-dark-200">Work Email</label>
              <input {...reg('email')} type="email" placeholder="you@company.com"
                className="form-input bg-dark-800 border-dark-600 text-white placeholder:text-dark-500 focus:border-brand-500" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label text-dark-200">Password</label>
              <div className="relative">
                <input {...reg('password')} type={showPw ? 'text' : 'password'} placeholder="Min 8 characters"
                  className="form-input bg-dark-800 border-dark-600 text-white placeholder:text-dark-500 focus:border-brand-500 pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3 mt-2">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Creating workspace...' : 'Create Free Account'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-dark-700 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-dark-500">Free to get started. No credit card required. Upgrade anytime.</p>
          </div>

          <p className="text-center text-dark-400 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
