'use client';

import Link from 'next/link';
import { Applicant, ApplicantStatus, STATUS_LABELS, BUSINESS_LABELS, ROLE_LABELS } from '@/types';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/lib/utils';
import { useUpdateApplicantStatusMutation } from '@/store/api/applicantApi';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2 } from '@/components/ui/Icons';

const STATUS_ORDER: ApplicantStatus[] = [
  'APPLIED','CONTACTED','INTERVIEW_SCHEDULED','INTERVIEW_COMPLETED',
  'HIRED','TRAINING_1_SCHEDULED','TRAINING_1_COMPLETE',
  'TRAINING_2_SCHEDULED','TRAINING_2_COMPLETE',
  'TRAINING_3_SCHEDULED','TRAINING_3_COMPLETE',
  'ACTIVE_REP','INACTIVE','FIRED',
];

interface Props {
  applicants: Applicant[];
  isLoading: boolean;
  pagination?: { page: number; total: number; pages: number; limit: number };
  page: number;
  onPageChange: (p: number) => void;
}

export function ApplicantTable({ applicants, isLoading, pagination, page, onPageChange }: Props) {
  const { can } = usePermissions();
  const [updateStatus, { isLoading: updating, originalArgs }] = useUpdateApplicantStatusMutation();

  const handleStatusChange = async (id: string, status: ApplicantStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="card flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center h-48 text-muted-foreground">
        <p className="font-medium">No applicants found</p>
        <p className="text-sm mt-1">Try adjusting your filters or add a new applicant</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Name', 'Business', 'Role', 'Status', 'Source', 'Applied', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applicants.map(a => {
              const isUpdating = updating && (originalArgs as any)?.id === a.id;
              return (
                <tr key={a.id} className="hover:bg-accent/40 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {a.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{a.fullName}</div>
                        <div className="text-xs text-muted-foreground">{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-foreground font-medium">{BUSINESS_LABELS[a.business]}</span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{ROLE_LABELS[a.role]}</td>
                  <td className="px-4 py-3.5">
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : can('canChangeStatus') ? (
                      <select
                        value={a.status}
                        onChange={e => handleStatusChange(a.id, e.target.value as ApplicantStatus)}
                        className="form-input py-1 text-xs max-w-[185px]"
                      >
                        {STATUS_ORDER.map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={a.status} />
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground capitalize">
                      {a.recruitingSource.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                    {formatDate(a.dateApplied)}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/applicants/${a.id}`}
                      className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors inline-flex opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Showing {((page - 1) * pagination.limit) + 1}–{Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
              className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-3 text-foreground font-medium">{page} / {pagination.pages}</span>
            <button onClick={() => onPageChange(page + 1)} disabled={page >= pagination.pages}
              className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
