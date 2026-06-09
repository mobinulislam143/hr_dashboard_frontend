'use client';

import { useState } from 'react';
import { useGetApplicantsQuery } from '@/store/api/applicantApi';
import { Header } from '@/components/layout/Header';
import { ApplicantTable } from '@/components/applicants/ApplicantTable';
import { ApplicantFilters } from '@/components/applicants/ApplicantFilters';
import { AddApplicantModal } from '@/components/applicants/AddApplicantModal';
import { Plus } from '@/components/ui/Icons';
import { usePermissions } from '@/hooks/usePermissions';

export default function ApplicantsPage() {
  const { can } = usePermissions();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const { data, isLoading, refetch } = useGetApplicantsQuery({ ...filters, page, limit: 20 });

  return (
    <div>
      <Header
        title="Applicants"
        subtitle={`${data?.pagination?.total ?? 0} total applicants`}
        actions={
          can('canAddApplicant') ? (
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              <Plus className="w-4 h-4" />Add Applicant
            </button>
          ) : undefined
        }
      />

      <div className="p-6 space-y-4 animate-fade-in">
        <ApplicantFilters
          filters={filters}
          onChange={(f) => { setFilters(f); setPage(1); }}
        />
        <ApplicantTable
          applicants={data?.applicants ?? []}
          isLoading={isLoading}
          pagination={data?.pagination}
          page={page}
          onPageChange={setPage}
        />
      </div>

      {showAdd && (
        <AddApplicantModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); refetch(); }}
        />
      )}
    </div>
  );
}
