import { BusinessCount } from '@/types';
import { Building2 } from '@/components/ui/Icons';

interface BusinessRepsCardProps {
  data: BusinessCount[];
}

const businessColors: Record<string, string> = {
  VEXON: 'bg-brand-500',
  EASYSCALE: 'bg-violet-500',
  TELENZA: 'bg-emerald-500',
  SOLV_GLOBAL: 'bg-blue-500',
  CTC_COURTS: 'bg-amber-500',
};

export function BusinessRepsCard({ data }: BusinessRepsCardProps) {
  const total = data.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Building2 className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground text-sm">Active Reps by Business</h3>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm">No active reps yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map(b => (
            <div key={b.business}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${businessColors[b.business] || 'bg-brand-500'}`} />
                  <span className="text-sm font-medium text-foreground">{b.label}</span>
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums">{b.count}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${businessColors[b.business] || 'bg-brand-500'}`}
                  style={{ width: total > 0 ? `${(b.count / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
            <span>Total Active</span>
            <span className="font-bold text-foreground">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
