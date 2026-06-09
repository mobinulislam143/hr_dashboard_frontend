'use client';

import { useGetCalendarEventsQuery } from '@/store/api/calendarApi';
import { CalendarEvent } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Calendar, Video, BookOpen } from '@/components/ui/Icons';
import Link from 'next/link';

const eventStyles: Record<string, { bg: string; icon: React.ElementType; color: string }> = {
  interview: { bg: 'bg-violet-500/10', icon: Video,     color: 'text-violet-500' },
  training_1: { bg: 'bg-blue-500/10',  icon: BookOpen,  color: 'text-blue-500'  },
  training_2: { bg: 'bg-cyan-500/10',  icon: BookOpen,  color: 'text-cyan-500'  },
  training_3: { bg: 'bg-teal-500/10',  icon: BookOpen,  color: 'text-teal-500'  },
};

export function UpcomingEvents() {
  const from = new Date().toISOString();
  const to   = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data: events = [] } = useGetCalendarEventsQuery({ from, to });
  const upcoming = events.slice(0, 6);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Upcoming (Next 14 Days)</h3>
        </div>
        <Link href="/calendar" className="text-xs text-primary hover:underline font-medium">
          View calendar →
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-muted-foreground text-sm">No upcoming events scheduled.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {upcoming.map((event: CalendarEvent) => {
            const style = eventStyles[event.type] || eventStyles.interview;
            const Icon = style.icon;
            return (
              <Link
                key={event.id}
                href={`/applicants/${event.applicantId}`}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-accent transition-all"
              >
                <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${style.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(event.date)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
