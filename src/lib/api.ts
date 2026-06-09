import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://hr-dashbaord-backend-six.vercel.app',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('omira_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('omira_token');
      localStorage.removeItem('omira_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { orgName: string; firstName: string; lastName: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
  invite: (data: { email: string; firstName: string; lastName: string; role: string; password: string }) =>
    api.post('/api/auth/invite', data),
  team: () => api.get('/api/auth/team'),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  metrics: () => api.get('/api/dashboard/metrics'),
  funnel: () => api.get('/api/dashboard/funnel'),
  businesses: () => api.get('/api/dashboard/businesses'),
};

// ─── Applicants ───────────────────────────────────────────────────────────────
export const applicantApi = {
  list: (params?: Record<string, string>) => api.get('/api/applicants', { params }),
  get: (id: string) => api.get(`/api/applicants/${id}`),
  create: (data: Record<string, unknown>) => api.post('/api/applicants', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/api/applicants/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/api/applicants/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/api/applicants/${id}`),
  getInterview: (applicantId: string) => api.get(`/api/applicants/${applicantId}/interview`),
  saveInterview: (applicantId: string, data: Record<string, unknown>) => api.put(`/api/applicants/${applicantId}/interview`, data),
  getTrainings: (applicantId: string) => api.get(`/api/applicants/${applicantId}/trainings`),
  saveTraining: (applicantId: string, data: Record<string, unknown>) => api.put(`/api/applicants/${applicantId}/trainings`, data),
};

// ─── Reps ─────────────────────────────────────────────────────────────────────
export const repApi = {
  list: (params?: Record<string, string>) => api.get('/api/reps', { params }),
  get: (id: string) => api.get(`/api/reps/${id}`),
  score: (id: string, data: Record<string, unknown>) => api.post(`/api/reps/${id}/score`, data),
  addPerformance: (id: string, data: Record<string, unknown>) => api.post(`/api/reps/${id}/performance`, data),
  remove: (id: string, data: Record<string, unknown>) => api.post(`/api/reps/${id}/remove`, data),
  assignManager: (id: string, managerId: string) => api.patch(`/api/reps/${id}/manager`, { managerId }),
};

// ─── Calendar ─────────────────────────────────────────────────────────────────
export const calendarApi = {
  events: (params?: { from?: string; to?: string }) => api.get('/api/calendar/events', { params }),
};
