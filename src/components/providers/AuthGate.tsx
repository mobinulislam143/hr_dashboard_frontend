'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initFromStorage } from '@/store/slices/authSlice';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}
