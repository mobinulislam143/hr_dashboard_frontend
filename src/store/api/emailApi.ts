import { baseApi } from './baseApi';

export interface EmailConfig {
  id?: string;
  smtpUser: string;
  smtpPass?: string;
  _hasSmtpPass?: boolean;
  fromName: string;
  fromEmail: string;
  isEnabled: boolean;
  interviewReminder: boolean;
  trainingReminder: boolean;
  reminderHoursBefore: number;
}

export const emailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmailConfig: builder.query<EmailConfig | null, void>({
      query: () => '/api/email',
      transformResponse: (res: any) => res.data,
      providesTags: ['Email' as any],
    }),

    saveEmailConfig: builder.mutation<EmailConfig, Partial<EmailConfig>>({
      query: (body) => ({ url: '/api/email', method: 'POST', body }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ['Email' as any],
    }),

    sendTestEmail: builder.mutation<void, { to: string }>({
      query: (body) => ({ url: '/api/email/test-send', method: 'POST', body }),
    }),
  }),
});

export const {
  useGetEmailConfigQuery,
  useSaveEmailConfigMutation,
  useSendTestEmailMutation,
} = emailApi;
