import { ApplicantStatus, STATUS_LABELS } from '@/types';
import { getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: ApplicantStatus }) {
  return (
    <span className={cn('status-badge', getStatusColor(status))}>
      {STATUS_LABELS[status]}
    </span>
  );
}
