import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import { placeOrder } from './Orders';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const validateCoupon = createAsyncThunk(
  'checkout/validateCoupon',
  async ({ code, subtotal }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/coupons/validate', { code, subtotal });
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchShippingQuote = createAsyncThunk(
  'checkout/shippingQuote',
  async ({ subtotal, areaId, currency }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/shipping/quote', {
        subtotal,
        area_id: areaId || null,
        currency: currency || 'SYP',
      });
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const initialState = {
  coupon: null,        // { id, code, type, value, currency, discount_amount }
  couponError: null,
  validatingCoupon: false,
  shipping: null,      // { amount, currency, charge_mode, free_shipping_applied }
};

const slice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    clearCoupon: s => { s.coupon = null; s.couponError = null; },
    clearCheckout: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(validateCoupon.pending, s => { s.validatingCoupon = true; s.couponError = null; })
      .addCase(validateCoupon.fulfilled, (s, a) => {
        s.validatingCoupon = false;
        s.coupon = a.payload?.coupon || null;
      })
      .addCase(validateCoupon.rejected, (s, a) => {
        s.validatingCoupon = false;
        s.coupon = null;
        s.couponError = a.payload;
      })

      .addCase(fetchShippingQuote.fulfilled, (s, a) => { s.shipping = a.payload || null; })

      // order placed — coupon consumed, quote stale
      .addCase(placeOrder.fulfilled, () => initialState);
  },
});

export const { clearCoupon, clearCheckout } = slice.actions;
export default slice.reducer;
