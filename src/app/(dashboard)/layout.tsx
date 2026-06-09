'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser, selectInitialized } from '@/store/slices/authSlice';
import { Loader2 } from '@/components/ui/Icons';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user        = useAppSelector(selectCurrentUser);
  const initialized = useAppSelector(selectInitialized);
  const router      = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    }
  }, [user, initialized, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
