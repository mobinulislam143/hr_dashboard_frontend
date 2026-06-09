import { baseApi } from './baseApi';
import { DashboardMetrics, FunnelStage, BusinessCount } from '@/types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<DashboardMetrics, void>({
      query: () => '/api/dashboard/metrics',
      transformResponse: (res: any) => res.data,
      providesTags: ['Dashboard'],
    }),
    getFunnel: builder.query<FunnelStage[], void>({
      query: () => '/api/dashboard/funnel',
      transformResponse: (res: any) => res.data,
      providesTags: ['Dashboard'],
    }),
    getBusinessReps: builder.query<BusinessCount[], void>({
      query: () => '/api/dashboard/businesses',
      transformResponse: (res: any) => res.data,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetMetricsQuery, useGetFunnelQuery, useGetBusinessRepsQuery } = dashboardApi;
