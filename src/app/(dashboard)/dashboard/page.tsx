'use client';

import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { BusinessRepsCard } from '@/components/dashboard/BusinessRepsCard';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { useGetMetricsQuery, useGetFunnelQuery, useGetBusinessRepsQuery } from '@/store/api/dashboardApi';
import { Users, UserCheck, UserX, Calendar, CheckCircle2, Clock, TrendingUp, Flame } from '@/components/ui/Icons';

export default function DashboardPage() {
  const { data: metrics } = useGetMetricsQuery();
  const { data: funnel  } = useGetFunnelQuery();
  const { data: businesses } = useGetBusinessRepsQuery();

  const inPipeline = metrics
    ? metrics.totalApplicants - (metrics.activeReps + metrics.firedReps + metrics.inactiveReps)
    : 0;

  return (
    <div>
      <Header title="Dashboard" subtitle="Recruiting pipeline overview" />

      <div className="p-6 space-y-6 animate-fade-in">
        {/* Row 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Applicants"      value={metrics?.totalApplicants   ?? '—'} icon={Users}       color="brand"   />
          <MetricCard title="Active Reps"           value={metrics?.activeReps        ?? '—'} icon={UserCheck}   color="green"   />
          <MetricCard title="Interviews Scheduled"  value={metrics?.interviewsScheduled ?? '—'} icon={Calendar} color="violet"  />
          <MetricCard title="Hired This Month"      value={metrics?.hiredThisMonth    ?? '—'} icon={TrendingUp}  color="emerald" />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Interviews Completed"  value={metrics?.interviewsCompleted ?? '—'} icon={CheckCircle2} color="blue"   />
          <MetricCard title="Inactive Reps"         value={metrics?.inactiveReps       ?? '—'} icon={Clock}     color="amber"   />
          <MetricCard title="Fired / Removed"       value={metrics?.firedReps          ?? '—'} icon={UserX}     color="red"     />
          <MetricCard title="In Pipeline"           value={inPipeline || '—'}                   icon={Flame}     color="orange"  />
        </div>

        {/* Funnel + Businesses */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FunnelChart data={funnel ?? []} />
          </div>
          <BusinessRepsCard data={businesses ?? []} />
        </div>

        {/* Upcoming events */}
        <UpcomingEvents />
      </div>
    </div>
  );
}
