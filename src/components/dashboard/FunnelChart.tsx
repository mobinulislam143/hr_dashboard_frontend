'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FunnelStage } from '@/types';

const COLORS = ['#6366f1', '#7c3aed', '#8b5cf6', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', '#22c55e'];

interface FunnelChartProps {
  data: FunnelStage[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{payload[0].payload.stage}</p>
      <p className="text-lg font-bold text-foreground">{payload[0].value}</p>
    </div>
  );
};

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <div className="card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-foreground">Recruiting Funnel</h3>
        <p className="text-muted-foreground text-xs mt-1">Applicants at each stage of the pipeline</p>
      </div>

      {data.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
          No data yet. Add your first applicant to see the funnel.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 10, fill: 'rgb(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'rgb(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgb(var(--accent))' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
