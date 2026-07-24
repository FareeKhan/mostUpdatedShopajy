import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const fetchFavoritesRemote = createAsyncThunk(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/favorites');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const toggleFavoriteRemote = createAsyncThunk(
  'favorites/toggleRemote',
  async ({ productId, isFavorite }, { rejectWithValue }) => {
    try {
      if (isFavorite) {
        await apiClient.delete(`/favorites/${productId}`);
      } else {
        await apiClient.post(`/favorites/${productId}`);
      }
      return { productId, isFavorite: !isFavorite };
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const initialState = {
  favorites: [],
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const product = action.payload;
      const exists = state.favorites.find(item => item.id === product.id);
      if (exists) {
        state.favorites = state.favorites.filter(item => item.id !== product.id);
      } else {
        state.favorites.push(product);
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter(item => item.id !== productId);
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload || [];
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchFavoritesRemote.fulfilled, (state, action) => {
      state.favorites = action.payload || [];
    });
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
