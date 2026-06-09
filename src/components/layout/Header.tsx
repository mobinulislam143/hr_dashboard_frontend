'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Bell } from '@/components/ui/Icons';
import { useEffect, useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="font-semibold text-foreground text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-xs mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        <button
          className="p-2 rounded-lg hover:bg-accent transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </button>

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4 text-muted-foreground" />
              : <Moon className="w-4 h-4 text-muted-foreground" />
            }
          </button>
        )}
      </div>
    </header>
  );
}
