'use client';

import { useState } from 'react';
import { useGetRepsQuery } from '@/store/api/repApi';
import { Header } from '@/components/layout/Header';
import { RepCard } from '@/components/reps/RepCard';
import { BUSINESS_LABELS, Business } from '@/types';
import { Loader2, Users } from '@/components/ui/Icons';

export default function RepsPage() {
  const [business, setBusiness] = useState('');
  const [tier, setTier] = useState('');

  const { data, isLoading } = useGetRepsQuery({
    ...(business && { business }),
    ...(tier     && { tier }),
    limit: 100,
  });

  const reps = data?.reps ?? [];

  return (
    <div>
      <Header title="Active Reps" subtitle={`${reps.length} active reps`} />

      <div className="p-6 animate-fade-in">
        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
          <select value={business} onChange={e => setBusiness(e.target.value)} className="form-input w-auto min-w-[140px]">
            <option value="">All Businesses</option>
            {(Object.keys(BUSINESS_LABELS) as Business[]).map(b => (
              <option key={b} value={b}>{BUSINESS_LABELS[b]}</option>
            ))}
          </select>
          <select value={tier} onChange={e => setTier(e.target.value)} className="form-input w-auto min-w-[120px]">
            <option value="">All Tiers</option>
            <option value="A_PLAYER">⭐ A Player</option>
            <option value="B_PLAYER">🔵 B Player</option>
            <option value="C_PLAYER">🟡 C Player</option>
          </select>
          {(business || tier) && (
            <button onClick={() => { setBusiness(''); setTier(''); }} className="btn-secondary text-xs px-3 py-1.5">
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : reps.length === 0 ? (
          <div className="card flex flex-col items-center justify-center h-56 text-muted-foreground">
            <Users className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium">No active reps found</p>
            <p className="text-sm mt-1">Reps appear here once they reach Active Rep status</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {reps.map(rep => <RepCard key={rep.id} rep={rep} />)}
          </div>
        )}
      </div>
    </div>
  );
}
