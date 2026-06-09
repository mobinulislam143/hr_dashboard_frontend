import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface Organization { id: string; name: string; slug: string; plan: string }

interface AuthState {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  organization: null,
  token: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; organization: Organization; token: string }>) => {
      state.user = action.payload.user;
      state.organization = action.payload.organization;
      state.token = action.payload.token;
      state.initialized = true;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('omira_token', action.payload.token);
        localStorage.setItem('omira_user', JSON.stringify(action.payload.user));
        localStorage.setItem('omira_org', JSON.stringify(action.payload.organization));
      }
    },
    initFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('omira_token');
        const user  = localStorage.getItem('omira_user');
        const org   = localStorage.getItem('omira_org');
        if (token && user) {
          state.token = token;
          state.user  = JSON.parse(user);
          state.organization = org ? JSON.parse(org) : null;
        }
      }
      state.initialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.organization = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('omira_token');
        localStorage.removeItem('omira_user');
        localStorage.removeItem('omira_org');
      }
    },
  },
});

export const { setCredentials, initFromStorage, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentOrg  = (state: { auth: AuthState }) => state.auth.organization;
export const selectToken        = (state: { auth: AuthState }) => state.auth.token;
export const selectInitialized  = (state: { auth: AuthState }) => state.auth.initialized;
