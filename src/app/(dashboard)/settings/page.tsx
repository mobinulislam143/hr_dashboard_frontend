'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Users, Shield, Building2, KeyRound, ChevronDown,
  UserCheck, UserX, Trash2, RefreshCw, Crown, Eye,
  BarChart3, Globe, Check, X, Plus, Lock, Mail,
  Send, Bell, BellOff, ExternalLink, Zap,
} from '@/components/ui/Icons';
import {
  useGetEmailConfigQuery,
  useSaveEmailConfigMutation,
  useSendTestEmailMutation,
} from '@/store/api/emailApi';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser, selectCurrentOrg } from '@/store/slices/authSlice';
import {
  useGetTeamQuery, useInviteUserMutation, useUpdateUserRoleMutation,
  useToggleUserStatusMutation, useDeleteUserMutation, useResetUserPasswordMutation,
  useChangePasswordMutation, useUpdateProfileMutation, useUpdateOrganizationMutation,
  useGetAllOrganizationsQuery, useGetPlatformStatsQuery,
} from '@/store/api/authApi';
import { User, UserRole } from '@/types';
import { cn, formatDate } from '@/lib/utils';

type Tab = 'team' | 'organization' | 'security' | 'email' | 'superadmin';

const USER_ROLE_OPTIONS: { value: UserRole; label: string; icon: React.ReactNode }[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin', icon: <Crown className="w-3.5 h-3.5" /> },
  { value: 'ADMIN',       label: 'Admin',       icon: <Shield className="w-3.5 h-3.5" /> },
  { value: 'MANAGER',     label: 'Manager',     icon: <UserCheck className="w-3.5 h-3.5" /> },
  { value: 'VIEWER',      label: 'Viewer',      icon: <Eye className="w-3.5 h-3.5" /> },
];
const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  ADMIN:       'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  MANAGER:     'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  VIEWER:      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

function RoleBadge({ role }: { role: UserRole }) {
  const opt = USER_ROLE_OPTIONS.find(o => o.value === role);
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', ROLE_COLORS[role])}>
      {opt?.icon}{opt?.label}
    </span>
  );
}

function RoleDropdown({ userId, currentRole, isSelf, isCurrentUserAdmin, isCurrentUserSuperAdmin }: {
  userId: string; currentRole: UserRole; isSelf: boolean;
  isCurrentUserAdmin: boolean; isCurrentUserSuperAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [updateRole, { isLoading }] = useUpdateUserRoleMutation();
  const available = USER_ROLE_OPTIONS.filter(o => isCurrentUserSuperAdmin ? true : o.value !== 'SUPER_ADMIN');

  const handleSelect = async (role: UserRole) => {
    if (role === currentRole) { setOpen(false); return; }
    try { await updateRole({ id: userId, role }).unwrap(); toast.success('Role updated'); }
    catch (e: any) { toast.error(e?.data?.message || 'Failed'); }
    setOpen(false);
  };

  // Only admins can change roles, and nobody can change their own
  if (isSelf || !isCurrentUserAdmin) return <RoleBadge role={currentRole} />;
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} disabled={isLoading}
        className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium hover:opacity-80 cursor-pointer', ROLE_COLORS[currentRole])}>
        {USER_ROLE_OPTIONS.find(o => o.value === currentRole)?.icon}
        {USER_ROLE_OPTIONS.find(o => o.value === currentRole)?.label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-card border border-border rounded-lg shadow-xl overflow-hidden min-w-[140px]">
          {available.map(opt => (
            <button key={opt.value} onClick={() => handleSelect(opt.value)}
              className={cn('w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors',
                opt.value === currentRole && 'bg-primary/10 text-primary font-semibold')}>
              {opt.icon}{opt.label}
              {opt.value === currentRole && <Check className="w-3 h-3 ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamMemberRow({ member, currentUser }: { member: User; currentUser: User }) {
  const [showResetPw, setShowResetPw] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [toggle,  { isLoading: toggling  }] = useToggleUserStatusMutation();
  const [remove,  { isLoading: removing  }] = useDeleteUserMutation();
  const [resetPw, { isLoading: resetting }] = useResetUserPasswordMutation();

  const isSelf  = member.id === currentUser.id;
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);

  const handleToggle = async () => {
    try { await toggle(member.id).unwrap(); toast.success(member.isActive ? 'Deactivated' : 'Activated'); }
    catch (e: any) { toast.error(e?.data?.message || 'Failed'); }
  };
  const handleRemove = async () => {
    if (!confirm(`Remove ${member.firstName} ${member.lastName}?`)) return;
    try { await remove(member.id).unwrap(); toast.success('User removed'); }
    catch (e: any) { toast.error(e?.data?.message || 'Failed'); }
  };
  const handleResetPw = async () => {
    if (!newPw || newPw.length < 8) { toast.error('Min 8 characters'); return; }
    try {
      await resetPw({ id: member.id, newPassword: newPw }).unwrap();
      toast.success('Password reset'); setShowResetPw(false); setNewPw('');
    } catch (e: any) { toast.error(e?.data?.message || 'Failed'); }
  };

  return (
    <div className={cn('p-4 rounded-xl border', member.isActive ? 'border-border bg-card' : 'border-border bg-muted/40 opacity-70')}>
      <div className="flex items-start gap-4">
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
          member.isActive ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground')}>
          {member.firstName[0]}{member.lastName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm text-foreground">
              {member.firstName} {member.lastName}
              {isSelf && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}
            </span>
            <RoleDropdown userId={member.id} currentRole={member.role} isSelf={isSelf}
              isCurrentUserAdmin={isAdmin}
              isCurrentUserSuperAdmin={currentUser.role === 'SUPER_ADMIN'} />
            {!member.isActive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">Inactive</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{member.email}</p>
          <p className="text-xs text-muted-foreground">Joined {formatDate(member.createdAt)}</p>
        </div>
        {isAdmin && !isSelf && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={handleToggle} disabled={toggling} title={member.isActive ? 'Deactivate' : 'Activate'}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              {member.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </button>
            <button onClick={() => setShowResetPw(!showResetPw)} title="Reset password"
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleRemove} disabled={removing}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {showResetPw && (
        <div className="mt-3 flex items-center gap-2 pl-14">
          <input type="password" placeholder="New password (min 8)" value={newPw}
            onChange={e => setNewPw(e.target.value)} className="form-input flex-1 text-sm py-1.5" />
          <button onClick={handleResetPw} disabled={resetting} className="btn-primary text-xs py-1.5 px-3">{resetting ? '…' : 'Set'}</button>
          <button onClick={() => { setShowResetPw(false); setNewPw(''); }} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
        </div>
      )}
    </div>
  );
}

function InviteUserForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'VIEWER', password: '' });
  const [invite, { isLoading }] = useInviteUserMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await invite(form as any).unwrap(); toast.success(`${form.firstName} added!`); onClose(); }
    catch (err: any) { toast.error(err?.data?.message || 'Failed'); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-border">
          <h3 className="font-bold text-lg">Add Team Member</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="form-label">First Name</label>
              <input className="form-input" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required /></div>
            <div><label className="form-label">Last Name</label>
              <input className="form-input" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required /></div>
          </div>
          <div><label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></div>
          <div><label className="form-label">Role</label>
            <select className="form-input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="VIEWER">Viewer</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option>
            </select></div>
          <div><label className="form-label">Initial Password</label>
            <input type="password" className="form-input" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={8} placeholder="Min 8 characters" /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={isLoading}>{isLoading ? 'Adding…' : 'Add Member'}</button>
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TeamTab({ currentUser }: { currentUser: User }) {
  const [showInvite, setShowInvite] = useState(false);
  const { data: team = [], isLoading } = useGetTeamQuery();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);
  const active   = team.filter(u => u.isActive);
  const inactive = team.filter(u => !u.isActive);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Team Members</h2>
          <p className="text-sm text-muted-foreground">{team.length} member{team.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowInvite(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />Add Member
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {active.map(m => <TeamMemberRow key={m.id} member={m} currentUser={currentUser} />)}
          {inactive.length > 0 && (
            <><p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-2">Inactive</p>
            {inactive.map(m => <TeamMemberRow key={m.id} member={m} currentUser={currentUser} />)}</>
          )}
        </div>
      )}
      {showInvite && <InviteUserForm onClose={() => setShowInvite(false)} />}
    </div>
  );
}

function OrganizationTab({ currentUser }: { currentUser: User }) {
  const currentOrg = useAppSelector(selectCurrentOrg);
  const [orgName, setOrgName] = useState(currentOrg?.name || '');
  const [updateOrg, { isLoading: updatingOrg }] = useUpdateOrganizationMutation();
  const [profileForm, setProfileForm] = useState({ firstName: currentUser.firstName, lastName: currentUser.lastName });
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Your Profile</h2>
        <form onSubmit={async e => {
          e.preventDefault();
          try { await updateProfile(profileForm).unwrap(); toast.success('Saved'); }
          catch { toast.error('Failed'); }
        }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">First Name</label>
              <input className="form-input" value={profileForm.firstName} onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))} required /></div>
            <div><label className="form-label">Last Name</label>
              <input className="form-input" value={profileForm.lastName} onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))} required /></div>
          </div>
          <div><label className="form-label">Email</label><input className="form-input opacity-60" value={currentUser.email} disabled /></div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary" disabled={updatingProfile}>{updatingProfile ? 'Saving…' : 'Save Profile'}</button>
            <span className="text-xs text-muted-foreground">Role: <RoleBadge role={currentUser.role} /></span>
          </div>
        </form>
      </div>
      {isAdmin && (
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" />Organization</h2>
          <div><label className="form-label">Organization Name</label>
            <input className="form-input" value={orgName} onChange={e => setOrgName(e.target.value)} /></div>
          <div><label className="form-label">Current Plan</label>
            <span className="text-sm font-semibold text-foreground px-3 py-1 bg-muted rounded-lg inline-block">{currentOrg?.plan}</span></div>
          <button onClick={async () => {
            try { await updateOrg({ name: orgName }).unwrap(); toast.success('Updated'); }
            catch { toast.error('Failed'); }
          }} className="btn-primary" disabled={updatingOrg}>{updatingOrg ? 'Saving…' : 'Save'}</button>
        </div>
      )}
    </div>
  );
}

function SecurityTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const match = form.confirmPassword && form.newPassword === form.confirmPassword && form.newPassword.length >= 8;
  const diff  = form.confirmPassword && form.newPassword !== form.confirmPassword;
  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-4 max-w-md">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Lock className="w-4 h-4 text-primary" />Change Password</h2>
        <form onSubmit={async e => {
          e.preventDefault();
          if (form.newPassword !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
          try {
            await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }).unwrap();
            toast.success('Password changed'); setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          } catch (e: any) { toast.error(e?.data?.message || 'Failed'); }
        }} className="space-y-4">
          <div><label className="form-label">Current Password</label>
            <input type="password" className="form-input" value={form.currentPassword} onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))} required /></div>
          <div><label className="form-label">New Password</label>
            <input type="password" className="form-input" value={form.newPassword} onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={8} placeholder="Min 8 characters" /></div>
          <div><label className="form-label">Confirm New Password</label>
            <input type="password" className="form-input" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
            {diff  && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><X className="w-3 h-3" />Do not match</p>}
            {match && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check className="w-3 h-3" />Passwords match</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>{isLoading ? 'Changing…' : 'Change Password'}</button>
        </form>
      </div>
      <div className="card p-6 max-w-md space-y-2">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2"><KeyRound className="w-4 h-4 text-primary" />Session Info</h2>
        <p className="text-sm text-muted-foreground">JWT stored in localStorage · expires in 7 days.</p>
      </div>
    </div>
  );
}

// ─── Email Tab (Gmail SMTP only) ──────────────────────────────────────────────
function EmailTab({ currentUser }: { currentUser: User }) {
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);
  const { data: existing, isLoading } = useGetEmailConfigQuery();
  const [saveConfig, { isLoading: saving }] = useSaveEmailConfigMutation();
  const [sendTest,   { isLoading: sending }] = useSendTestEmailMutation();
  const [testEmail,  setTestEmail] = useState('');
  const [savedOk,    setSavedOk]   = useState(false);

  const [form, setForm] = useState({
    smtpUser: '', smtpPass: '',
    fromName: '', fromEmail: '',
    isEnabled: true, interviewReminder: true, trainingReminder: true, reminderHoursBefore: 24,
  });

  const [initialized, setInitialized] = useState(false);
  if (existing && !initialized) {
    Object.assign(form, {
      smtpUser:            existing.smtpUser     || '',
      smtpPass:            existing.smtpPass      || '',
      fromName:            existing.fromName      || '',
      fromEmail:           existing.fromEmail     || '',
      isEnabled:           existing.isEnabled,
      interviewReminder:   existing.interviewReminder,
      trainingReminder:    existing.trainingReminder,
      reminderHoursBefore: existing.reminderHoursBefore || 24,
    });
    setTimeout(() => setInitialized(true), 0);
  }

  const update = (patch: Partial<typeof form>) => {
    setForm(f => ({ ...f, ...patch }));
    setSavedOk(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveConfig(form).unwrap();
      toast.success('Gmail SMTP saved!');
      setSavedOk(true);
    } catch (e: any) { toast.error(e?.data?.message || 'Failed to save'); }
  };

  const handleSendTest = async () => {
    if (!testEmail) { toast.error('Enter a recipient email'); return; }
    try {
      await sendTest({ to: testEmail }).unwrap();
      toast.success(`Test email sent to ${testEmail} ✅`);
    } catch (e: any) { toast.error(e?.data?.message || 'Check your Gmail credentials'); }
  };

  if (!isAdmin) return (
    <div className="card p-8 text-center space-y-3">
      <Mail className="w-10 h-10 text-muted-foreground mx-auto" />
      <p className="text-muted-foreground">Only Admins can manage email settings.</p>
    </div>
  );

  if (isLoading) return <div className="skeleton h-64 rounded-xl" />;

  return (
    <form onSubmit={handleSave} className="space-y-6">

      {/* Status banner */}
      {existing && (
        <div className={cn('flex items-center gap-3 p-4 rounded-xl border',
          existing.isEnabled
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
            : 'bg-muted border-border')}>
          <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse',
            existing.isEnabled ? 'bg-green-500' : 'bg-slate-400')} />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Reminders are {existing.isEnabled ? 'active' : 'disabled'}
            </p>
            {existing.isEnabled && (
              <p className="text-xs text-muted-foreground">
                Gmail · {existing.fromEmail} · {existing.reminderHoursBefore}h before events
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 1 — Gmail credentials */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
          <h2 className="text-base font-bold text-foreground">Gmail Credentials</h2>
        </div>

        {/* Setup guide */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <Zap className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <p className="font-semibold">How to get your App Password (2 minutes):</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Enable 2-Step Verification on your Google account if not already on</li>
              <li>Go to{' '}
                <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer"
                  className="underline font-semibold inline-flex items-center gap-0.5">
                  myaccount.google.com/apppasswords <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>App name: type <strong>OMIRA</strong> → click <strong>Create</strong></li>
              <li>Copy the 16-character password → paste below</li>
            </ol>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Gmail Address</label>
            <input type="email" className="form-input" placeholder="you@gmail.com"
              value={form.smtpUser} onChange={e => update({ smtpUser: e.target.value, fromEmail: e.target.value })}
              required />
            <p className="text-xs text-muted-foreground mt-1">Used as login + sender address</p>
          </div>
          <div>
            <label className="form-label">App Password <span className="text-muted-foreground font-normal">(16 chars, no spaces)</span></label>
            <input type="password" className="form-input font-mono tracking-widest"
              placeholder={existing?._hasSmtpPass ? '••••••••  (saved — leave blank to keep)' : 'xxxx xxxx xxxx xxxx'}
              value={form.smtpPass} onChange={e => update({ smtpPass: e.target.value })} />
            <p className="text-xs text-muted-foreground mt-1">Not your regular Gmail password</p>
          </div>
          <div>
            <label className="form-label">From Name</label>
            <input className="form-input" placeholder="Omira Recruiting"
              value={form.fromName} onChange={e => update({ fromName: e.target.value })} required />
          </div>
          <div>
            <label className="form-label">From Email</label>
            <input type="email" className="form-input"
              value={form.fromEmail} onChange={e => update({ fromEmail: e.target.value })} required />
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">✅ Auto-filled from Gmail address</p>
          </div>
        </div>
      </div>

      {/* Step 2 — Reminders */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
          <h2 className="text-base font-bold text-foreground">Reminder Settings</h2>
          <span className="text-xs text-muted-foreground">→ sent to all Admins &amp; Managers</span>
        </div>
        <div className="space-y-2">
          {([
            { key: 'interviewReminder', label: '📅 Interview Reminders', desc: 'Notify team before scheduled interviews' },
            { key: 'trainingReminder',  label: '📚 Training Reminders',  desc: 'Notify team before scheduled trainings' },
          ] as const).map(item => (
            <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/30">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button type="button"
                onClick={() => update({ [item.key]: !form[item.key as keyof typeof form] })}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  form[item.key] ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border text-muted-foreground')}>
                {form[item.key] ? <><Bell className="w-3.5 h-3.5" />On</> : <><BellOff className="w-3.5 h-3.5" />Off</>}
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-52">
            <label className="form-label">How early to send?</label>
            <select className="form-input" value={form.reminderHoursBefore}
              onChange={e => update({ reminderHoursBefore: parseInt(e.target.value) })}>
              <option value={1}>1 hour before</option>
              <option value={2}>2 hours before</option>
              <option value={6}>6 hours before</option>
              <option value={12}>12 hours before</option>
              <option value={24}>24 hours before (default)</option>
              <option value={48}>48 hours before</option>
            </select>
          </div>
          <div className="flex items-center justify-between flex-1 min-w-[200px] p-4 rounded-xl border-2 border-dashed border-border">
            <div>
              <p className="text-sm font-semibold text-foreground">Master Switch</p>
              <p className="text-xs text-muted-foreground">Disable all email sending</p>
            </div>
            <button type="button" onClick={() => update({ isEnabled: !form.isEnabled })}
              className={cn('px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                form.isEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border text-muted-foreground')}>
              {form.isEnabled ? '✅ On' : '⛔ Off'}
            </button>
          </div>
        </div>
      </div>

      {!savedOk && existing && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold px-1">
          ⚠️ You have unsaved changes — save before testing.
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save Gmail Settings'}
      </button>

      {/* Step 3 — Test */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">3</span>
          <h2 className="text-base font-bold text-foreground">Send a Test Email</h2>
        </div>
        {existing && savedOk
          ? <p className="text-xs text-green-600 dark:text-green-400 font-medium">✅ Gmail ready · sending from <strong>{existing.fromEmail}</strong></p>
          : <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠️ Save your settings first.</p>
        }
        <div className="flex gap-3 flex-wrap">
          <input type="email" className="form-input flex-1 min-w-[200px] max-w-sm"
            placeholder="you@example.com" value={testEmail} onChange={e => setTestEmail(e.target.value)} />
          <button type="button" onClick={handleSendTest}
            disabled={sending || !testEmail || (!existing && !savedOk)}
            className="btn-secondary flex items-center gap-2">
            <Send className="w-4 h-4" />{sending ? 'Sending…' : 'Send Test'}
          </button>
        </div>
      </div>
    </form>
  );
}

function SuperAdminTab() {
  const { data: stats, isLoading: statsLoading } = useGetPlatformStatsQuery();
  const { data: orgs = [], isLoading: orgsLoading } = useGetAllOrganizationsQuery();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-purple-500" />Platform Overview
        </h2>
        {statsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Organizations', value: stats.totalOrgs,       color: 'text-purple-600 dark:text-purple-400' },
              { label: 'Total Users',   value: stats.totalUsers,      color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Applicants',    value: stats.totalApplicants, color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Active Reps',   value: stats.totalActiveReps, color: 'text-green-600 dark:text-green-400' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <p className={cn('text-3xl font-black', s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-purple-500" />All Organizations
        </h2>
        {orgsLoading ? (
          <div className="space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-2">
            {orgs.map((org: any) => (
              <div key={org.id} className="card p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{org.name}</p>
                  <p className="text-xs text-muted-foreground">{org.slug} · {formatDate(org.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                  <span className="text-center"><p className="font-bold text-foreground">{org._count?.users}</p><p>Users</p></span>
                  <span className="text-center"><p className="font-bold text-foreground">{org._count?.applicants}</p><p>Apps</p></span>
                  <span className={cn('px-2 py-0.5 rounded-full font-semibold uppercase text-[10px]',
                    org.plan === 'FREE'  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                    org.plan === 'SCALE' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                  )}>{org.plan}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const currentUser = useAppSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<Tab>('team');
  if (!currentUser) return null;

  const isAdmin      = ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const tabs: { id: Tab; label: string; icon: React.ReactNode; highlight?: boolean }[] = [
    { id: 'team',         label: 'Team',         icon: <Users className="w-4 h-4" /> },
    { id: 'organization', label: 'Profile & Org', icon: <Building2 className="w-4 h-4" /> },
    { id: 'security',     label: 'Security',      icon: <Shield className="w-4 h-4" /> },
    ...(isAdmin      ? [{ id: 'email'      as Tab, label: 'Email',       icon: <Mail className="w-4 h-4" /> }] : []),
    ...(isSuperAdmin ? [{ id: 'superadmin' as Tab, label: 'Super Admin', icon: <Crown className="w-4 h-4" />, highlight: true }] : []),
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your team, profile, and organization</p>
      </div>
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              tab.highlight && 'text-purple-500'
            )}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'team'         && <TeamTab currentUser={currentUser} />}
      {activeTab === 'organization' && <OrganizationTab currentUser={currentUser} />}
      {activeTab === 'security'     && <SecurityTab />}
      {activeTab === 'email'        && <EmailTab currentUser={currentUser} />}
      {activeTab === 'superadmin'   && <SuperAdminTab />}
    </div>
  );
}
