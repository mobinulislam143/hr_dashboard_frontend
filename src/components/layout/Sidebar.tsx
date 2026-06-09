'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCheck, Calendar, Settings, Zap, LogOut, Menu, X } from '@/components/ui/Icons';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCurrentUser, selectCurrentOrg, logout } from '@/store/slices/authSlice';
import { cn } from '@/lib/utils';
import logo from '../../../public/omiralogo.png';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/applicants', icon: Users, label: 'Applicants' },
  { href: '/reps', icon: UserCheck, label: 'Active Reps' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const organization = useAppSelector(selectCurrentOrg);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden shrink-0">
            <Image src={logo} alt="logo" height={100} width={100} className="h-10 w-10 rounded-full object-cover hover:scale-105 transition-all duration-300" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-foreground">Omira</div>
            <div className="text-xs text-muted-foreground truncate">{organization?.name}</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn('sidebar-link', active && 'active')}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(v => !v)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        'md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 shadow-2xl',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 flex-shrink-0">
        <NavContent />
      </aside>
    </>
  );
}
