import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const fetchPage = createAsyncThunk(
  'content/page',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/pages/${slug}`);
      return { slug, data };
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchOnboarding = createAsyncThunk(
  'content/onboarding',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/onboarding');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const submitSupportTicket = createAsyncThunk(
  'content/supportTicket',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/support/tickets', payload);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const slice = createSlice({
  name: 'content',
  initialState: {
    pages: {},
    onboarding: [],
    submitting: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPage.fulfilled, (s, a) => {
        s.pages[a.payload.slug] = a.payload.data;
      })
      .addCase(fetchOnboarding.fulfilled, (s, a) => {
        s.onboarding = a.payload || [];
      })
      .addCase(submitSupportTicket.pending, s => { s.submitting = true; s.error = null; })
      .addCase(submitSupportTicket.fulfilled, s => { s.submitting = false; })
      .addCase(submitSupportTicket.rejected, (s, a) => { s.submitting = false; s.error = a.payload; });
  },
});

export default slice.reducer;
