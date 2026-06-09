import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ApplicantStatus, RepTier } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function getStatusColor(status: ApplicantStatus): string {
  const map: Record<ApplicantStatus, string> = {
    APPLIED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    CONTACTED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    INTERVIEW_SCHEDULED: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    INTERVIEW_COMPLETED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    HIRED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    TRAINING_1_SCHEDULED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    TRAINING_1_COMPLETE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    TRAINING_2_SCHEDULED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    TRAINING_2_COMPLETE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    TRAINING_3_SCHEDULED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    TRAINING_3_COMPLETE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    ACTIVE_REP: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    INACTIVE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    FIRED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[status] || 'bg-slate-100 text-slate-700';
}

export function getTierColor(tier: RepTier): string {
  const map: Record<RepTier, string> = {
    A_PLAYER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    B_PLAYER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    C_PLAYER: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  return map[tier];
}

export function computeAvgScore(score: { workEthic: number; coachability: number; communication: number; consistency: number; overallRating: number }): number {
  return (score.workEthic + score.coachability + score.communication + score.consistency + score.overallRating) / 5;
}

export function computeTier(avg: number): RepTier {
  if (avg >= 8) return 'A_PLAYER';
  if (avg >= 5) return 'B_PLAYER';
  return 'C_PLAYER';
}
