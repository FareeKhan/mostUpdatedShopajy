import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const searchProducts = createAsyncThunk(
  'products/search',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/products', { params });
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchSimilar = createAsyncThunk(
  'products/similar',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/products/${productId}/similar`);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const RECENT_LIMIT = 8;

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    searchResults: [],
    searchLoading: false,
    similar: [],
    similarLoading: false,
    recentSearches: [],
    error: null,
  },
  reducers: {
    addRecentSearch: (state, action) => {
      const term = (action.payload || '').trim();
      if (!term) return;
      const next = [term, ...state.recentSearches.filter(t => t !== term)];
      state.recentSearches = next.slice(0, RECENT_LIMIT);
    },
    clearRecentSearches: state => {
      state.recentSearches = [];
    },
    clearSearchResults: state => {
      state.searchResults = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchProducts.pending, s => { s.searchLoading = true; s.error = null; })
      .addCase(searchProducts.fulfilled, (s, a) => {
        s.searchLoading = false;
        s.searchResults = a.payload?.data || [];
      })
      .addCase(searchProducts.rejected, (s, a) => { s.searchLoading = false; s.error = a.payload; })

      .addCase(fetchSimilar.pending, s => { s.similarLoading = true; })
      .addCase(fetchSimilar.fulfilled, (s, a) => {
        s.similarLoading = false;
        s.similar = a.payload || [];
      })
      .addCase(fetchSimilar.rejected, (s, a) => { s.similarLoading = false; s.error = a.payload; });
  },
});

export const { addRecentSearch, clearRecentSearches, clearSearchResults } = productsSlice.actions;
export default productsSlice.reducer;
