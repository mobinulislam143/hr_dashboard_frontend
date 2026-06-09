import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';

export type Permission =
  | 'canAddApplicant'
  | 'canEditApplicant'
  | 'canDeleteApplicant'
  | 'canChangeStatus'
  | 'canScoreRep'
  | 'canAddPerformance'
  | 'canRemoveRep'
  | 'canManageTeam'
  | 'canManageOrg'
  | 'canViewSuperAdmin';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  VIEWER: [],                                         // read-only
  MANAGER: [
    'canAddApplicant', 'canEditApplicant',
    'canScoreRep', 'canAddPerformance',
  ],
  ADMIN: [
    'canAddApplicant', 'canEditApplicant', 'canDeleteApplicant',
    'canChangeStatus', 'canScoreRep', 'canAddPerformance',
    'canRemoveRep', 'canManageTeam', 'canManageOrg',
  ],
  SUPER_ADMIN: [
    'canAddApplicant', 'canEditApplicant', 'canDeleteApplicant',
    'canChangeStatus', 'canScoreRep', 'canAddPerformance',
    'canRemoveRep', 'canManageTeam', 'canManageOrg', 'canViewSuperAdmin',
  ],
};

export function usePermissions() {
  const user = useAppSelector(selectCurrentUser);
  const role = user?.role ?? 'VIEWER';
  const perms = ROLE_PERMISSIONS[role] ?? [];

  const can = (permission: Permission): boolean => perms.includes(permission);

  return {
    can,
    isViewer:     role === 'VIEWER',
    isManager:    role === 'MANAGER',
    isAdmin:      role === 'ADMIN' || role === 'SUPER_ADMIN',
    isSuperAdmin: role === 'SUPER_ADMIN',
    role,
  };
}
