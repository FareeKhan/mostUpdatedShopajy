import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const fetchSettings = createAsyncThunk(
  'settings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/settings');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchCurrencies = createAsyncThunk(
  'settings/currencies',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/currencies');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const slice = createSlice({
  name: 'settings',
  initialState: {
    values: {},
    currencies: [],
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSettings.fulfilled, (s, a) => {
        s.values = a.payload || {};
        s.loaded = true;
      })
      .addCase(fetchCurrencies.fulfilled, (s, a) => {
        s.currencies = a.payload || [];
      });
  },
});

export default slice.reducer;
