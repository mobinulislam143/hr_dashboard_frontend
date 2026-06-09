'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetRepQuery, useScoreRepMutation, useAddPerformanceMutation, useRemoveRepMutation } from '@/store/api/repApi';
import { Header } from '@/components/layout/Header';
import { BUSINESS_LABELS, ROLE_LABELS, TIER_LABELS, REMOVAL_REASON_LABELS, RemovalReason } from '@/types';
import { formatDate, formatCurrency, getTierColor, computeAvgScore, cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, Star, Trash2, TrendingUp, AlertTriangle, Lock } from '@/components/ui/Icons';
import Link from 'next/link';

const SCORE_DIMS = [
  { key: 'overallRating', label: 'Overall Rating', required: true  },
  { key: 'workEthic',     label: 'Work Ethic',     required: false },
  { key: 'coachability',  label: 'Coachability',   required: false },
  { key: 'communication', label: 'Communication',  required: false },
  { key: 'consistency',   label: 'Consistency',    required: false },
] as const;

export default function RepDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { can, isViewer } = usePermissions();
  const [activeTab, setActiveTab] = useState<'scores' | 'performance' | 'remove'>('scores');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [perf, setPerf] = useState({ callsThisWeek: '', meetingsBooked: '', revenueThisMonth: '' });
  const [removal, setRemoval] = useState({ reason: '', notes: '' });

  const { data: rep, isLoading } = useGetRepQuery(id);
  const [scoreRep,       { isLoading: scoring  }] = useScoreRepMutation();
  const [addPerformance, { isLoading: logging  }] = useAddPerformanceMutation();
  const [removeRep,      { isLoading: removing }] = useRemoveRepMutation();

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!rep)      return <div className="p-6 text-muted-foreground">Rep not found.</div>;

  const latestScore = rep.scores?.[0];
  const avg = latestScore ? computeAvgScore(latestScore) : null;

  const handleScore = async () => {
    if (!scores['overallRating']) { toast.error('Overall Rating is required'); return; }
    try {
      await scoreRep({ id, scores }).unwrap();
      toast.success('Score saved');
      setScores({});
    } catch { toast.error('Failed to save score'); }
  };

  const handlePerf = async () => {
    try {
      await addPerformance({ id, data: { ...perf, weekOf: new Date().toISOString() } }).unwrap();
      toast.success('Performance logged');
      setPerf({ callsThisWeek: '', meetingsBooked: '', revenueThisMonth: '' });
    } catch { toast.error('Failed to log performance'); }
  };

  const handleRemove = async () => {
    if (!removal.reason) { toast.error('Select a reason'); return; }
    try {
      await removeRep({ id, data: { ...removal, newStatus: 'FIRED' } }).unwrap();
      toast.success('Rep removed');
    } catch { toast.error('Failed to remove rep'); }
  };

  // Tabs — hide destructive tabs from viewers/managers
  const tabs = [
    { id: 'scores',      label: 'Quality Score', show: true },
    { id: 'performance', label: 'Performance',   show: true },
    { id: 'remove',      label: 'Remove Rep',    show: can('canRemoveRep') },
  ].filter(t => t.show);

  return (
    <div>
      <Header
        title={rep.applicant.fullName}
        subtitle={`${BUSINESS_LABELS[rep.applicant.business]} · ${ROLE_LABELS[rep.applicant.role]}`}
        actions={<Link href="/reps" className="btn-secondary gap-2"><ArrowLeft className="w-4 h-4" /> Back</Link>}
      />

      <div className="p-6 space-y-6 animate-fade-in">
        {/* Viewer banner */}
        {isViewer && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
            <Lock className="w-4 h-4 flex-shrink-0" />
            You have view-only access. Contact an Admin to make changes.
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Score',    value: avg ? avg.toFixed(1) + ' / 10' : '—' },
            { label: 'Current Tier', value: latestScore ? TIER_LABELS[latestScore.tier] : '—' },
            { label: 'Hire Date',    value: formatDate(rep.hireDate) },
            { label: 'Status',       value: rep.isActive ? 'Active ✓' : 'Removed' },
          ].map(({ label, value }) => (
            <div key={label} className="card p-4">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                className={`tab-btn ${activeTab === t.id ? 'active' : 'inactive'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scores ───────────────────────────────────────────────── */}
        {activeTab === 'scores' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Score form */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground">Rate Rep Quality</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  * Overall Rating required
                </span>
              </div>
              <div className="space-y-5">
                {SCORE_DIMS.map(({ key, label, required }) => {
                  const val = scores[key] ?? (key === 'overallRating' ? 5 : 0);
                  const isSet = scores[key] !== undefined;
                  return (
                    <div key={key} className={cn(!required && !isSet && 'opacity-60')}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-1">
                          {label}
                          {required && <span className="text-red-500 text-xs">*</span>}
                          {!required && !isSet && <span className="text-xs text-muted-foreground">(optional)</span>}
                        </label>
                        <span className={cn('text-sm font-bold w-16 text-right', isSet || required ? 'text-primary' : 'text-muted-foreground')}>
                          {isSet || required ? `${val} / 10` : '—'}
                        </span>
                      </div>
                      <input
                        type="range" min={required ? 1 : 0} max={10}
                        value={val}
                        onChange={e => {
                          const v = parseInt(e.target.value);
                          if (!required && v === 0) {
                            setScores(p => { const n = { ...p }; delete n[key]; return n; });
                          } else {
                            setScores(p => ({ ...p, [key]: v }));
                          }
                        }}
                        className="w-full accent-brand-500 cursor-pointer"
                        disabled={!can('canScoreRep')}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{required ? '1 — Poor' : '0 — Skip'}</span><span>10 — Excellent</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {can('canScoreRep') ? (
                <button onClick={handleScore} disabled={scoring || !scores['overallRating']} className="btn-primary mt-6 w-full">
                  {scoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Score
                </button>
              ) : (
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <Lock className="w-4 h-4" />View only — you cannot score reps
                </div>
              )}
            </div>

            {/* Score history */}
            <div className="card p-6">
              <h3 className="font-semibold text-foreground mb-5">Score History</h3>
              {rep.scores.length === 0 ? (
                <p className="text-muted-foreground text-sm">No scores yet.</p>
              ) : (
                <div className="space-y-3">
                  {rep.scores.slice(0, 6).map(s => {
                    const a = computeAvgScore(s);
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <span className={cn('status-badge text-xs', getTierColor(s.tier))}>{TIER_LABELS[s.tier]}</span>
                          <div className="text-xs text-muted-foreground mt-1.5">{formatDate(s.scoredAt)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground text-lg">{a.toFixed(1)}</div>
                          <div className="flex justify-end gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.round(a / 2) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Performance ───────────────────────────────────────────── */}
        {activeTab === 'performance' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-foreground mb-5">Log This Week</h3>
              <div className="space-y-4">
                {[
                  { key: 'callsThisWeek',    label: 'Calls This Week',       placeholder: '0' },
                  { key: 'meetingsBooked',   label: 'Meetings Booked',        placeholder: '0' },
                  { key: 'revenueThisMonth', label: 'Revenue This Month ($)', placeholder: '0.00' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input
                      type="number" placeholder={f.placeholder}
                      value={(perf as any)[f.key]}
                      onChange={e => setPerf(p => ({ ...p, [f.key]: e.target.value }))}
                      className="form-input"
                      disabled={!can('canAddPerformance')}
                    />
                  </div>
                ))}
              </div>
              {can('canAddPerformance') ? (
                <button onClick={handlePerf} disabled={logging} className="btn-primary mt-5">
                  {logging ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                  Log Performance
                </button>
              ) : (
                <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <Lock className="w-4 h-4" />View only
                </div>
              )}
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-foreground mb-5">Performance History</h3>
              {rep.performance.length === 0 ? (
                <p className="text-muted-foreground text-sm">No performance logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {rep.performance.slice(0, 8).map(p => (
                    <div key={p.id} className="p-3.5 rounded-lg bg-muted/50 border border-border">
                      <div className="text-xs font-medium text-muted-foreground mb-2.5">Week of {formatDate(p.weekOf)}</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-md bg-card">
                          <div className="font-bold text-foreground">{p.callsThisWeek}</div>
                          <div className="text-xs text-muted-foreground">Calls</div>
                        </div>
                        <div className="p-2 rounded-md bg-card">
                          <div className="font-bold text-foreground">{p.meetingsBooked}</div>
                          <div className="text-xs text-muted-foreground">Meetings</div>
                        </div>
                        <div className="p-2 rounded-md bg-card">
                          <div className="font-bold text-foreground">{formatCurrency(p.revenueThisMonth)}</div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Remove ───────────────────────────────────────────────── */}
        {activeTab === 'remove' && can('canRemoveRep') && (
          <div className="card p-6 border-destructive/20 max-w-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold text-foreground">Remove Rep</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-5">
              This marks the rep as removed and logs the reason permanently.
            </p>
            <div className="space-y-4">
              <div>
                <label className="form-label">Reason *</label>
                <select value={removal.reason} onChange={e => setRemoval(r => ({ ...r, reason: e.target.value }))} className="form-input">
                  <option value="">Select reason</option>
                  {(Object.keys(REMOVAL_REASON_LABELS) as RemovalReason[]).map(r => (
                    <option key={r} value={r}>{REMOVAL_REASON_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Additional Notes</label>
                <textarea value={removal.notes} onChange={e => setRemoval(r => ({ ...r, notes: e.target.value }))}
                  rows={3} placeholder="Additional context..." className="form-input resize-none" />
              </div>
              <button onClick={handleRemove} disabled={!removal.reason || removing} className="btn-danger">
                {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Confirm Remove Rep
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
