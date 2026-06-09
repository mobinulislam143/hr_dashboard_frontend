import Link from 'next/link';
import { ActiveRep, BUSINESS_LABELS, ROLE_LABELS, TIER_LABELS } from '@/types';
import { computeAvgScore, computeTier, getTierColor, formatDate, cn } from '@/lib/utils';
import { Phone, Mail, ExternalLink, TrendingUp } from '@/components/ui/Icons';

interface Props { rep: ActiveRep; }

export function RepCard({ rep }: Props) {
  const latestScore = rep.scores?.[0];
  const latestPerf = rep.performance?.[0];
  const avg = latestScore ? computeAvgScore(latestScore) : null;
  const tier = latestScore ? latestScore.tier : null;

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {rep.applicant.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{rep.applicant.fullName}</h3>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[rep.applicant.role]}</p>
          </div>
        </div>

        {tier && (
          <span className={cn('status-badge text-xs', getTierColor(tier))}>
            {TIER_LABELS[tier]}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{BUSINESS_LABELS[rep.applicant.business]}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3" />
          <span>{rep.applicant.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3" />
          <span className="truncate">{rep.applicant.email}</span>
        </div>
      </div>

      {/* Score bar */}
      {avg !== null && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Avg Score</span>
            <span className="font-semibold text-foreground">{avg.toFixed(1)} / 10</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-brand rounded-full transition-all duration-700"
              style={{ width: `${(avg / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Performance snapshot */}
      {latestPerf && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Calls', value: latestPerf.callsThisWeek },
            { label: 'Meetings', value: latestPerf.meetingsBooked },
            { label: 'Revenue', value: `$${(latestPerf.revenueThisMonth / 1000).toFixed(0)}k` },
          ].map(m => (
            <div key={m.label} className="text-center p-2 rounded-lg bg-muted">
              <div className="text-sm font-bold text-foreground">{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Hired {formatDate(rep.hireDate)}</span>
        <Link
          href={`/reps/${rep.id}`}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
