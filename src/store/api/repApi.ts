import { baseApi } from './baseApi';
import { ActiveRep, RepScore, PerformanceEntry } from '@/types';

interface RepListParams { business?: string; tier?: string; managerId?: string; page?: number; limit?: number; }
interface RepListResponse { reps: ActiveRep[]; pagination: { page: number; limit: number; total: number } }

export interface AddRepPayload {
  fullName: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  business: string;
  role: string;
  recruitingSource?: string;
  hireDate?: string;
}

export const repApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addRep: builder.mutation<ActiveRep, AddRepPayload>({
      query: (body) => ({ url: '/api/reps', method: 'POST', body }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ['Rep', 'Dashboard'],
    }),

    getReps: builder.query<RepListResponse, RepListParams>({
      query: (params) => ({ url: '/api/reps', params }),
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result
          ? [...result.reps.map(({ id }) => ({ type: 'Rep' as const, id })), 'Rep']
          : ['Rep'],
    }),

    getRep: builder.query<ActiveRep, string>({
      query: (id) => `/api/reps/${id}`,
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Rep', id }],
    }),

    scoreRep: builder.mutation<RepScore, { id: string; scores: Record<string, number> }>({
      query: ({ id, scores }) => ({ url: `/api/reps/${id}/score`, method: 'POST', body: scores }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Rep', id }, 'Dashboard'],
    }),

    addPerformance: builder.mutation<PerformanceEntry, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({ url: `/api/reps/${id}/performance`, method: 'POST', body: data }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Rep', id }],
    }),

    removeRep: builder.mutation<void, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({ url: `/api/reps/${id}/remove`, method: 'POST', body: data }),
      invalidatesTags: ['Rep', 'Applicant', 'Dashboard'],
    }),

    assignManager: builder.mutation<void, { id: string; managerId: string }>({
      query: ({ id, managerId }) => ({ url: `/api/reps/${id}/manager`, method: 'PATCH', body: { managerId } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Rep', id }],
    }),
  }),
});

export const {
  useAddRepMutation,
  useGetRepsQuery,
  useGetRepQuery,
  useScoreRepMutation,
  useAddPerformanceMutation,
  useRemoveRepMutation,
  useAssignManagerMutation,
} = repApi;
