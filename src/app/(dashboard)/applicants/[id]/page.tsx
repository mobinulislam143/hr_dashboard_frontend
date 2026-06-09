'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetApplicantQuery, useUpdateApplicantStatusMutation } from '@/store/api/applicantApi';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/applicants/StatusBadge';
import { InterviewSection } from '@/components/applicants/InterviewSection';
import { TrainingSection } from '@/components/applicants/TrainingSection';
import { formatDate } from '@/lib/utils';
import { BUSINESS_LABELS, ROLE_LABELS, SOURCE_LABELS, STATUS_LABELS, ApplicantStatus } from '@/types';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Calendar, ArrowLeft, Loader2, Eye } from '@/components/ui/Icons';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';

const STATUS_ORDER: ApplicantStatus[] = [
  'APPLIED','CONTACTED','INTERVIEW_SCHEDULED','INTERVIEW_COMPLETED',
  'HIRED','TRAINING_1_SCHEDULED','TRAINING_1_COMPLETE',
  'TRAINING_2_SCHEDULED','TRAINING_2_COMPLETE',
  'TRAINING_3_SCHEDULED','TRAINING_3_COMPLETE',
  'ACTIVE_REP','INACTIVE','FIRED',
];

export default function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { can, isViewer } = usePermissions();
  const [activeTab, setActiveTab] = useState<'overview' | 'interview' | 'training'>('overview');

  const { data: applicant, isLoading } = useGetApplicantQuery(id);
  const [updateStatus, { isLoading: updating }] = useUpdateApplicantStatusMutation();

  const handleStatusChange = async (status: ApplicantStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <p>Applicant not found.</p>
        <Link href="/applicants" className="btn-primary mt-4">Back to Applicants</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview',  label: 'Overview'  },
    { id: 'interview', label: 'Interview' },
    { id: 'training',  label: 'Training'  },
  ];

  return (
    <div>
      <Header
        title={applicant.fullName}
        subtitle={`${BUSINESS_LABELS[applicant.business]} · ${ROLE_LABELS[applicant.role]}`}
        actions={
          <Link href="/applicants" className="btn-secondary gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        }
      />

      <div className="p-6 space-y-6 animate-fade-in">
        {/* Viewer banner */}
        {isViewer && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
            <Eye className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm font-medium">View-only mode — you can read but not edit any details.</p>
          </div>
        )}
        {/* Info row */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Contact */}
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-foreground text-sm border-b border-border pb-3 mb-4">Contact Info</h3>
            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <a href={`tel:${applicant.phone}`} className="text-foreground hover:text-primary transition-colors">{applicant.phone}</a>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <a href={`mailto:${applicant.email}`} className="text-foreground hover:text-primary transition-colors truncate">{applicant.email}</a>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{applicant.city}, {applicant.state}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Applied {formatDate(applicant.dateApplied)}</span>
            </div>
          </div>

          {/* Position */}
          <div className="card p-5">
            <h3 className="font-semibold text-foreground text-sm border-b border-border pb-3 mb-4">Position</h3>
            <div className="space-y-3.5">
              {[
                { label: 'Business', value: BUSINESS_LABELS[applicant.business] },
                { label: 'Role',     value: ROLE_LABELS[applicant.role] },
                { label: 'Source',   value: SOURCE_LABELS[applicant.recruitingSource] },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className="font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="card p-5">
            <h3 className="font-semibold text-foreground text-sm border-b border-border pb-3 mb-4">Status</h3>
            <div className="mb-4">
              <StatusBadge status={applicant.status} />
            </div>
            {can('canChangeStatus') ? (
              <>
                <label className="form-label text-xs">Update Status</label>
                <select
                  value={applicant.status}
                  onChange={e => handleStatusChange(e.target.value as ApplicantStatus)}
                  disabled={updating}
                  className="form-input text-sm"
                >
                  {STATUS_ORDER.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                {updating && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Status changes require Manager access or above.</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-0">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`tab-btn ${activeTab === t.id ? 'active' : 'inactive'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'interview' && <InterviewSection applicantId={id} readOnly={!can('canEditApplicant')} />}
        {activeTab === 'training'  && <TrainingSection  applicantId={id} readOnly={!can('canEditApplicant')} />}
        {activeTab === 'overview'  && (
          <div className="card p-6 text-center text-muted-foreground">
            <p className="text-sm">Use the <strong className="text-foreground">Interview</strong> or <strong className="text-foreground">Training</strong> tabs to manage this applicant&apos;s progress.</p>
          </div>
        )}
      </div>
    </div>
  );
}
