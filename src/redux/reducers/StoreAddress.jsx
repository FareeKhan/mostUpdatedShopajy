import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const fetchAddressesRemote = createAsyncThunk(
  'address/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/addresses');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const buildFormData = payload => {
  const fd = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'photo' && typeof value === 'object' && value.uri) {
      fd.append('photo', {
        uri: value.uri,
        type: value.type || 'image/jpeg',
        name: value.name || 'photo.jpg',
      });
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? '1' : '0');
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
};

const hasFile = payload => payload?.photo && typeof payload.photo === 'object' && payload.photo.uri;

export const createAddressRemote = createAsyncThunk(
  'address/create',
  async (payload, { rejectWithValue }) => {
    try {
      const config = hasFile(payload)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
      const body = hasFile(payload) ? buildFormData(payload) : payload;
      const { data } = await apiClient.post('/addresses', body, config);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const updateAddressRemote = createAsyncThunk(
  'address/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const config = hasFile(payload)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
      const body = hasFile(payload) ? buildFormData(payload) : payload;
      const { data } = await apiClient.post(`/addresses/${id}`, body, config);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchGovernorates = createAsyncThunk(
  'address/governorates',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/governorates');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const deleteAddressRemote = createAsyncThunk(
  'address/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/addresses/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const setDefaultAddressRemote = createAsyncThunk(
  'address/setDefault',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/addresses/${id}/default`);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const initialState = {
  address: [],
    governorates: [],
  loading: false,
    governoratesLoading: false,
  error: null,
};

const StoreAddress = createSlice({
  name: 'StoreAddress',
  initialState,
  reducers: {
    userAddress: (state, action) => {
      const { defaultAddress } = action.payload;
      if (defaultAddress) {
        state.address = state.address.map(add => ({ ...add, defaultAddress: false }));
      }
      state.address.push(action.payload);
    },
    updateDefault: (state, action) => {
      const address = action.payload;
      state.address = state.address.map(item => ({
        ...item,
        defaultAddress: item?.address === address,
      }));
    },
    deleteAddress: (state, action) => {
      const id = action.payload;
      state.address = state.address.filter(item => item?.id !== id);
    },
    emptyAddress: state => {
      state.address = [];
    },

    // governate
    
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAddressesRemote.pending, s => { s.loading = true; })
      .addCase(fetchAddressesRemote.fulfilled, (s, a) => {
        s.loading = false;
        s.address = a.payload || [];
      })
      .addCase(fetchAddressesRemote.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createAddressRemote.fulfilled, (s, a) => {
        if (a.payload?.is_default) {
          s.address = s.address.map(it => ({ ...it, is_default: false }));
        }
        s.address.unshift(a.payload);
      })

      .addCase(updateAddressRemote.fulfilled, (s, a) => {
        if (a.payload?.is_default) {
          s.address = s.address.map(it => ({ ...it, is_default: false }));
        }
        const idx = s.address.findIndex(it => it.id === a.payload.id);
        if (idx >= 0) s.address[idx] = a.payload;
      })

      .addCase(deleteAddressRemote.fulfilled, (s, a) => {
        s.address = s.address.filter(it => it.id !== a.payload);
      })

      .addCase(setDefaultAddressRemote.fulfilled, (s, a) => {
        s.address = s.address.map(it => ({ ...it, is_default: it.id === a.payload.id }));
      })


      // governates
  .addCase(fetchGovernorates.pending, state => {
  state.governoratesLoading = true;
})
.addCase(fetchGovernorates.fulfilled, (state, action) => {
  state.governoratesLoading = false;
  state.governorates = action.payload || [];
})
.addCase(fetchGovernorates.rejected, (state, action) => {
  state.governoratesLoading = false;
  state.error = action.payload;
})
  },
});

export const { userAddress, deleteAddress, emptyAddress, updateDefault } = StoreAddress.actions;
export default StoreAddress.reducer;
