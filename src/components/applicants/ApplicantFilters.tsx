'use client';

import { Search, Filter } from '@/components/ui/Icons';
import { Business, RepRole, ApplicantStatus, RecruitingSource, BUSINESS_LABELS, ROLE_LABELS, STATUS_LABELS, SOURCE_LABELS } from '@/types';

interface Props {
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
}

export function ApplicantFilters({ filters, onChange }: Props) {
  const update = (key: string, value: string) => {
    const next = { ...filters };
    if (value) next[key] = value;
    else delete next[key];
    onChange(next);
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={filters.search || ''}
            onChange={e => update('search', e.target.value)}
            placeholder="Search by name, email, phone..."
            className="input pl-9"
          />
        </div>

        {/* Business */}
        <select value={filters.business || ''} onChange={e => update('business', e.target.value)} className="input w-auto min-w-[130px]">
          <option value="">All Businesses</option>
          {(Object.keys(BUSINESS_LABELS) as Business[]).map(b => (
            <option key={b} value={b}>{BUSINESS_LABELS[b]}</option>
          ))}
        </select>

        {/* Role */}
        <select value={filters.role || ''} onChange={e => update('role', e.target.value)} className="input w-auto min-w-[130px]">
          <option value="">All Roles</option>
          {(Object.keys(ROLE_LABELS) as RepRole[]).map(r => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>

        {/* Status */}
        <select value={filters.status || ''} onChange={e => update('status', e.target.value)} className="input w-auto min-w-[160px]">
          <option value="">All Statuses</option>
          {(Object.keys(STATUS_LABELS) as ApplicantStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>

        {/* Source */}
        <select value={filters.source || ''} onChange={e => update('source', e.target.value)} className="input w-auto min-w-[120px]">
          <option value="">All Sources</option>
          {(Object.keys(SOURCE_LABELS) as RecruitingSource[]).map(s => (
            <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
          ))}
        </select>

        {Object.keys(filters).length > 0 && (
          <button onClick={() => onChange({})} className="btn-secondary text-xs px-3 py-1.5 text-muted-foreground">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
