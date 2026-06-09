import { baseApi } from './baseApi';
import { Applicant, Interview, Training, ApplicantStatus } from '@/types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  business?: string;
  role?: string;
  status?: string;
  source?: string;
  from?: string;
  to?: string;
}

interface ListResponse {
  applicants: Applicant[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const applicantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List
    getApplicants: builder.query<ListResponse, ListParams>({
      query: (params) => ({ url: '/api/applicants', params }),
      transformResponse: (res: any) => res.data,
      providesTags: (result) =>
        result
          ? [...result.applicants.map(({ id }) => ({ type: 'Applicant' as const, id })), 'Applicant']
          : ['Applicant'],
    }),

    // Single
    getApplicant: builder.query<Applicant, string>({
      query: (id) => `/api/applicants/${id}`,
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Applicant', id }],
    }),

    // Create
    createApplicant: builder.mutation<Applicant, Partial<Applicant>>({
      query: (body) => ({ url: '/api/applicants', method: 'POST', body }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ['Applicant', 'Dashboard'],
    }),

    // Update
    updateApplicant: builder.mutation<Applicant, { id: string; data: Partial<Applicant> }>({
      query: ({ id, data }) => ({ url: `/api/applicants/${id}`, method: 'PATCH', body: data }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Applicant', id }],
    }),

    // Update status
    updateApplicantStatus: builder.mutation<Applicant, { id: string; status: ApplicantStatus }>({
      query: ({ id, status }) => ({ url: `/api/applicants/${id}/status`, method: 'PATCH', body: { status } }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Applicant', id }, 'Dashboard'],
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        // Optimistic update in list
        const patch = dispatch(
          applicantApi.util.updateQueryData('getApplicants', {} as any, (draft) => {
            const a = draft.applicants.find(x => x.id === id);
            if (a) a.status = status;
          })
        );
        try { await queryFulfilled; }
        catch { patch.undo(); }
      },
    }),

    // Delete
    deleteApplicant: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/applicants/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Applicant', 'Dashboard'],
    }),

    // Interview
    getInterview: builder.query<Interview | null, string>({
      query: (applicantId) => `/api/applicants/${applicantId}/interview`,
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, applicantId) => [{ type: 'Interview', id: applicantId }],
    }),

    saveInterview: builder.mutation<Interview, { applicantId: string; data: Partial<Interview> }>({
      query: ({ applicantId, data }) => ({
        url: `/api/applicants/${applicantId}/interview`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { applicantId }) => [{ type: 'Interview', id: applicantId }],
    }),

    // Trainings
    getTrainings: builder.query<Training[], string>({
      query: (applicantId) => `/api/applicants/${applicantId}/trainings`,
      transformResponse: (res: any) => res.data,
      providesTags: (_r, _e, applicantId) => [{ type: 'Training', id: applicantId }],
    }),

    saveTraining: builder.mutation<Training, { applicantId: string; data: Record<string, unknown> }>({
      query: ({ applicantId, data }) => ({
        url: `/api/applicants/${applicantId}/trainings`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_r, _e, { applicantId }) => [
        { type: 'Training', id: applicantId },
        { type: 'Applicant', id: applicantId },
      ],
    }),
  }),
});

export const {
  useGetApplicantsQuery,
  useGetApplicantQuery,
  useCreateApplicantMutation,
  useUpdateApplicantMutation,
  useUpdateApplicantStatusMutation,
  useDeleteApplicantMutation,
  useGetInterviewQuery,
  useSaveInterviewMutation,
  useGetTrainingsQuery,
  useSaveTrainingMutation,
} = applicantApi;
