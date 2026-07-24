import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const fetchPaymentMethods = createAsyncThunk(
  'payments/methods',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/payment-methods');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchCards = createAsyncThunk(
  'payments/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/cards');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const saveCard = createAsyncThunk(
  'payments/saveCard',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/cards', payload);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const deleteCard = createAsyncThunk(
  'payments/deleteCard',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/cards/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const setDefaultCard = createAsyncThunk(
  'payments/defaultCard',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/cards/${id}/default`);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const slice = createSlice({
  name: 'payments',
  initialState: {
    methods: [],
    cards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPaymentMethods.fulfilled, (s, a) => { s.methods = a.payload || []; })
      .addCase(fetchCards.fulfilled, (s, a) => { s.cards = a.payload || []; })
      .addCase(saveCard.fulfilled, (s, a) => {
        if (a.payload?.is_default) s.cards = s.cards.map(c => ({ ...c, is_default: false }));
        s.cards.unshift(a.payload);
      })
      .addCase(deleteCard.fulfilled, (s, a) => {
        s.cards = s.cards.filter(c => c.id !== a.payload);
      })
      .addCase(setDefaultCard.fulfilled, (s, a) => {
        s.cards = s.cards.map(c => ({ ...c, is_default: c.id === a.payload.id }));
      });
  },
});

export default slice.reducer;
