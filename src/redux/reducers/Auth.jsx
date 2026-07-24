import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  } catch (e) {
    return rejectWithValue(extractError(e));
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  } catch (e) {
    return rejectWithValue(extractError(e));
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiClient.post('/auth/logout');
    return true;
  } catch (e) {
    return rejectWithValue(extractError(e));
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/auth/me');
    return data;
  } catch (e) {
    return rejectWithValue(extractError(e));
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.patch('/auth/profile', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (e) {
    return rejectWithValue(extractError(e));
  }
});

export const requestPasswordReset = createAsyncThunk('auth/forgot', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/auth/forgot-password', payload);
    return data;
  } catch (e) {
    return rejectWithValue(extractError(e));
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/auth/verify-otp', payload);
    return data;
  } catch (e) {
    return rejectWithValue(extractError(e));
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/auth/reset-password', payload);
    return data;
  } catch (e) {
    return rejectWithValue(extractError(e));
  }
});

const initialState = {
  token: null,
  user: null,
  resetEmail: null,
  resetToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    },
    setSession: (state, action) => {
      state.token = action.payload?.token || null;
      state.user = action.payload?.user || null;
    },
    clearSession: state => {
      state.token = null;
      state.user = null;
      state.resetEmail = null;
      state.resetToken = null;
    },
  },
  extraReducers: builder => {
    const credentialFulfilled = (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    };
    builder
      .addCase(login.pending, s => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, credentialFulfilled)
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(register.pending, s => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, credentialFulfilled)
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(logout.fulfilled, s => {
        s.token = null;
        s.user = null;
      })

      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(fetchMe.rejected, s => { s.user = null; s.token = null; })

      .addCase(updateProfile.pending, s => { s.loading = true; s.error = null; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(updateProfile.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(requestPasswordReset.pending, s => { s.loading = true; s.error = null; })
      .addCase(requestPasswordReset.fulfilled, (s, a) => {
        s.loading = false;
        s.resetEmail = a.meta?.arg?.email || s.resetEmail;
      })
      .addCase(requestPasswordReset.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(verifyOtp.pending, s => { s.loading = true; s.error = null; })
      .addCase(verifyOtp.fulfilled, (s, a) => {
        s.loading = false;
        s.resetToken = a.payload?.reset_token || null;
      })
      .addCase(verifyOtp.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(resetPassword.pending, s => { s.loading = true; s.error = null; })
      .addCase(resetPassword.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        s.resetEmail = null;
        s.resetToken = null;
      })
      .addCase(resetPassword.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearAuthError, setResetEmail, setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
