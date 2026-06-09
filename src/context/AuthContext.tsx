'use client';

// Re-exports from Redux for convenience — keeps existing component imports working
export { useAppSelector as useAuthSelector, useAppDispatch as useAuthDispatch } from '@/store/hooks';
export { selectCurrentUser, selectCurrentOrg, selectToken, selectInitialized, logout } from '@/store/slices/authSlice';

// Convenience hook — replaces the old useAuth()
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCurrentUser, selectCurrentOrg, selectInitialized, logout } from '@/store/slices/authSlice';
import { setCredentials } from '@/store/slices/authSlice';
import { useLoginMutation, useRegisterMutation } from '@/store/api/authApi';

export function useAuth() {
  const dispatch   = useAppDispatch();
  const user       = useAppSelector(selectCurrentUser);
  const organization = useAppSelector(selectCurrentOrg);
  const initialized  = useAppSelector(selectInitialized);

  const [loginMutation]    = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const login = async (email: string, password: string) => {
    const result = await loginMutation({ email, password }).unwrap();
    dispatch(setCredentials({ user: result.user, organization: result.organization as any, token: result.token }));
  };

  const register = async (data: { orgName: string; firstName: string; lastName: string; email: string; password: string }) => {
    const result = await registerMutation(data).unwrap();
    dispatch(setCredentials({ user: result.user, organization: result.organization as any, token: result.token }));
  };

  const logoutUser = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return { user, organization, isLoading: !initialized, login, register, logout: logoutUser };
}
