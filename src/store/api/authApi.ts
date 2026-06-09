import { baseApi } from './baseApi';
import { User } from '@/types';

interface LoginRequest    { email: string; password: string }
interface RegisterRequest { orgName: string; firstName: string; lastName: string; email: string; password: string }
interface InviteRequest   { email: string; firstName: string; lastName: string; role: string; password: string }
interface UpdateRoleRequest    { id: string; role: string }
interface ResetPasswordRequest { id: string; newPassword: string }
interface ChangePasswordRequest { currentPassword: string; newPassword: string }
interface UpdateProfileRequest  { firstName: string; lastName: string }
interface UpdateOrgRequest      { name: string }

interface AuthResponse {
  token: string;
  user: User;
  organization: { id: string; name: string; slug: string; plan: string };
}

interface PlatformStats {
  totalOrgs: number;
  totalUsers: number;
  totalApplicants: number;
  totalActiveReps: number;
}

interface OrgWithCount {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
  _count: { users: number; applicants: number };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Auth ───────────────────────────────────────────────────────────────
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/api/auth/login', method: 'POST', body }),
      transformResponse: (res: any) => res.data,
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/api/auth/register', method: 'POST', body }),
      transformResponse: (res: any) => res.data,
    }),

    getMe: builder.query<User, void>({
      query: () => '/api/auth/me',
      transformResponse: (res: any) => res.data,
    }),

    // ─── Own account ─────────────────────────────────────────────────────────
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({ url: '/api/auth/profile', method: 'PATCH', body }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ['Team'],
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({ url: '/api/auth/password', method: 'PATCH', body }),
      transformResponse: (res: any) => res.data,
    }),

    // ─── Team ────────────────────────────────────────────────────────────────
    inviteUser: builder.mutation<User, InviteRequest>({
      query: (body) => ({ url: '/api/auth/invite', method: 'POST', body }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ['Team'],
    }),

    getTeam: builder.query<User[], void>({
      query: () => '/api/auth/team',
      transformResponse: (res: any) => res.data,
      providesTags: ['Team'],
    }),

    // ─── User management (ADMIN+) ─────────────────────────────────────────────
    updateUserRole: builder.mutation<User, UpdateRoleRequest>({
      query: ({ id, role }) => ({ url: `/api/auth/users/${id}/role`, method: 'PATCH', body: { role } }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ['Team'],
    }),

    toggleUserStatus: builder.mutation<{ id: string; isActive: boolean }, string>({
      query: (id) => ({ url: `/api/auth/users/${id}/toggle`, method: 'PATCH' }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ['Team'],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/auth/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Team'],
    }),

    resetUserPassword: builder.mutation<void, ResetPasswordRequest>({
      query: ({ id, newPassword }) => ({ url: `/api/auth/users/${id}/reset-password`, method: 'PATCH', body: { newPassword } }),
      transformResponse: (res: any) => res.data,
    }),

    // ─── Organization ─────────────────────────────────────────────────────────
    updateOrganization: builder.mutation<any, UpdateOrgRequest>({
      query: (body) => ({ url: '/api/auth/org', method: 'PATCH', body }),
      transformResponse: (res: any) => res.data,
    }),

    // ─── Super Admin ──────────────────────────────────────────────────────────
    getAllOrganizations: builder.query<OrgWithCount[], void>({
      query: () => '/api/auth/admin/orgs',
      transformResponse: (res: any) => res.data,
    }),

    getPlatformStats: builder.query<PlatformStats, void>({
      query: () => '/api/auth/admin/stats',
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useInviteUserMutation,
  useGetTeamQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
  useResetUserPasswordMutation,
  useUpdateOrganizationMutation,
  useGetAllOrganizationsQuery,
  useGetPlatformStatsQuery,
} = authApi;
