import { IconComponent } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: IconComponent;
  color: 'brand' | 'green' | 'violet' | 'emerald' | 'blue' | 'amber' | 'red' | 'orange';
}

const colorMap = {
  brand:   { bg: 'bg-brand-500/10 dark:bg-brand-500/15',   icon: 'text-brand-500',   border: 'border-brand-500/20' },
  green:   { bg: 'bg-green-500/10 dark:bg-green-500/15',   icon: 'text-green-500',   border: 'border-green-500/20' },
  violet:  { bg: 'bg-violet-500/10 dark:bg-violet-500/15', icon: 'text-violet-500',  border: 'border-violet-500/20' },
  emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', icon: 'text-emerald-500', border: 'border-emerald-500/20' },
  blue:    { bg: 'bg-blue-500/10 dark:bg-blue-500/15',     icon: 'text-blue-500',    border: 'border-blue-500/20' },
  amber:   { bg: 'bg-amber-500/10 dark:bg-amber-500/15',   icon: 'text-amber-500',   border: 'border-amber-500/20' },
  red:     { bg: 'bg-red-500/10 dark:bg-red-500/15',       icon: 'text-red-500',     border: 'border-red-500/20' },
  orange:  { bg: 'bg-orange-500/10 dark:bg-orange-500/15', icon: 'text-orange-500',  border: 'border-orange-500/20' },
};

export function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const c = colorMap[color];

  return (
    <div className={cn('metric-card border', c.border)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground mb-2 leading-tight">{title}</p>
          <p className="text-2xl font-extrabold text-foreground tabular-nums">
            {value}
          </p>
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', c.bg)}>
          <Icon className={cn('w-5 h-5', c.icon)} />
        </div>
      </div>
    </div>
  );
}
