import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const applyInfluencer = createAsyncThunk(
  'influencer/apply',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/influencer/apply', payload);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchInfluencerMe = createAsyncThunk(
  'influencer/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/influencer/me');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchEarningsSummary = createAsyncThunk(
  'influencer/earnings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/earnings/summary');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchCommissions = createAsyncThunk(
  'influencer/commissions',
  async (period, { rejectWithValue }) => {
    try {
      const params = period && period !== 'all' ? { period } : {};
      const { data } = await apiClient.get('/earnings/commissions', { params });
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchMonthly = createAsyncThunk(
  'influencer/monthly',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/earnings/monthly');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const requestWithdraw = createAsyncThunk(
  'influencer/withdraw',
  async (amount, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/earnings/withdraw', { amount });
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const slice = createSlice({
  name: 'influencer',
  initialState: {
    isInfluencer: false,
    application: null,
    referral: null,
    summary: { paid: 0, pending: 0, total: 0 },
    commissions: [],
    monthly: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(applyInfluencer.pending, s => { s.submitting = true; s.error = null; })
      .addCase(applyInfluencer.fulfilled, (s, a) => { s.submitting = false; s.application = a.payload?.application; })
      .addCase(applyInfluencer.rejected, (s, a) => { s.submitting = false; s.error = a.payload; })

      .addCase(fetchInfluencerMe.fulfilled, (s, a) => {
        s.isInfluencer = !!a.payload?.is_influencer;
        s.application = a.payload?.application;
        s.referral = a.payload?.referral;
      })

      .addCase(fetchEarningsSummary.fulfilled, (s, a) => { s.summary = a.payload || s.summary; })
      .addCase(fetchCommissions.fulfilled, (s, a) => { s.commissions = a.payload || []; })
      .addCase(fetchMonthly.fulfilled, (s, a) => { s.monthly = a.payload || []; });
  },
});

export default slice.reducer;
