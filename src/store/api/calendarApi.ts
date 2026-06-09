import { baseApi } from './baseApi';
import { CalendarEvent } from '@/types';

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarEvents: builder.query<CalendarEvent[], { from?: string; to?: string }>({
      query: (params) => ({ url: '/api/calendar/events', params }),
      transformResponse: (res: any) => res.data,
      providesTags: ['Calendar'],
    }),
  }),
});

export const { useGetCalendarEventsQuery } = calendarApi;
