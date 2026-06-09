'use client';

import { useState } from 'react';
import { useGetCalendarEventsQuery } from '@/store/api/calendarApi';
import { Header } from '@/components/layout/Header';
import { CalendarEvent } from '@/types';
import { formatDateTime, cn } from '@/lib/utils';
import { Video, BookOpen, ChevronLeft, ChevronRight, Loader2 } from '@/components/ui/Icons';
import Link from 'next/link';

const eventConfig: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  interview: { label: 'Interview',  icon: Video,     cls: 'bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400' },
  training_1:{ label: 'Training 1', icon: BookOpen,  cls: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'         },
  training_2:{ label: 'Training 2', icon: BookOpen,  cls: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'          },
  training_3:{ label: 'Training 3', icon: BookOpen,  cls: 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400'          },
};

export default function CalendarPage() {
  const [offset, setOffset] = useState(0);

  const now    = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year   = target.getFullYear();
  const month  = target.getMonth();
  const label  = target.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const from = new Date(year, month, 1).toISOString();
  const to   = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const { data: events = [], isLoading } = useGetCalendarEventsQuery({ from, to });

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const eventsForDay = (day: number) =>
    events.filter((e: CalendarEvent) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });

  const isToday = (day: number) =>
    day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  return (
    <div>
      <Header title="Calendar" subtitle="Interviews and training schedule" />

      <div className="p-6 animate-fade-in">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-foreground text-lg">{label}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setOffset(0)} className="btn-secondary text-xs px-3 py-1.5">Today</button>
            <button onClick={() => setOffset(o => o - 1)} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button onClick={() => setOffset(o => o + 1)} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="card flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="card overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">{d}</div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                const dayEvents = day ? eventsForDay(day) : [];
                return (
                  <div
                    key={idx}
                    className={cn(
                      'min-h-[90px] p-1.5 border-b border-r border-border',
                      !day ? 'bg-muted/20' : 'hover:bg-accent/30 transition-colors',
                      idx % 7 === 6 && 'border-r-0',
                    )}
                  >
                    {day && (
                      <>
                        <span className={cn(
                          'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1',
                          isToday(day) ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'
                        )}>
                          {day}
                        </span>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 3).map((e: CalendarEvent) => {
                            const cfg = eventConfig[e.type] || eventConfig.interview;
                            const Icon = cfg.icon;
                            return (
                              <Link key={e.id} href={`/applicants/${e.applicantId}`}
                                className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border truncate hover:opacity-80 transition-opacity', cfg.cls)}
                              >
                                <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="truncate">{e.title.replace(/^(Interview|Training \d): /, '')}</span>
                              </Link>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <span className="text-xs text-muted-foreground px-1.5">+{dayEvents.length - 3} more</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {Object.entries(eventConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={key} className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border', cfg.cls)}>
                <Icon className="w-3 h-3" />
                {cfg.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
