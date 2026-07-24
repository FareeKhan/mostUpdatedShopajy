import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/orders', { params });
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/orders/${id}`);
      console.log('sehjearer', data)
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/orders', payload || {});
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const submitOrderReview = createAsyncThunk(
  'orders/submitReview',
  async ({ orderItemId, rating, comment }, { rejectWithValue }) => {
    try {
      // POST payload expected by typical review endpoints
      const payload = { rating, comment };

      const { data } = await apiClient.post(`/orders/${orderItemId}/reviews`, payload);
      return { orderItemId, data: data?.data || data };
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

// export const submitPaymentProof = createAsyncThunk(
//   'orders/paymentProof',
//   async ({ orderId, transactionId, file }, { rejectWithValue }) => {
//     try {
//       const form = new FormData();
//       if (transactionId) form.append('transaction_id', transactionId);
//       if (file) {
//         form.append('receipt', {
//           uri: file.uri,
//           name: file.name || 'receipt.jpg',
//           type: file.type || 'image/jpeg',
//         });
//       }
//       const { data } = await apiClient.post(`/orders/${orderId}/payment-proof`, form, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return data;
//     } catch (e) {
//       return rejectWithValue(extractError(e));
//     }
//   },
// );

export const submitPaymentProof = createAsyncThunk(
  'orders/paymentProof',
  async ({ orderId, transactionId, file }, { rejectWithValue }) => {
    console.log('faaaa',orderId, transactionId, file)
    try {
      const form = new FormData();
      
      // 1. Append the text field
      if (transactionId) form.append('transaction_id', transactionId);
      
      // 2. Append the file dynamically
      if (file) {
        form.append('receipt', {
          uri: file.uri,
          name: file.name,
          type: file.type, // Use the dynamic type from the file object
        });
      }

      // 3. Send the request
      const { data } = await apiClient.post(`/orders/${orderId}/payment-proof`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/orders/${id}/cancel`);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    current: null,
    loading: false,
    placing: false,
    reviewing: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: state => { state.current = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, s => { s.loading = true; s.error = null; })
      .addCase(fetchOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload?.data || [];
      })
      .addCase(fetchOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // .addCase(fetchOrder.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(fetchOrder.pending, s => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchOrder.fulfilled, (s, a) => {
        s.loading = false;
        // If a response wraps it in .data use it, otherwise take the root payload
        s.current = a.payload?.data ? a.payload.data : a.payload;
      })
      .addCase(fetchOrder.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })



      .addCase(placeOrder.pending, s => { s.placing = true; s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => {
        s.placing = false;
        s.current = a.payload;
        s.list = [a.payload, ...s.list];
      })
      .addCase(placeOrder.rejected, (s, a) => { s.placing = false; s.error = a.payload; })

      .addCase(submitPaymentProof.fulfilled, (s, a) => {
        s.current = a.payload;
        s.list = s.list.map(o => o.id === a.payload.id ? a.payload : o);
      })

      .addCase(cancelOrder.fulfilled, (s, a) => {
        s.current = a.payload;
        s.list = s.list.map(o => o.id === a.payload.id ? a.payload : o);
      })



    // sdsadas
.addCase(submitOrderReview.pending, s => {
        s.reviewing = true;
        s.error = null;
      })
      .addCase(submitOrderReview.fulfilled, (s, a) => {
        s.reviewing = false;

        // 1. Update the matching item in the current active order detail view
        if (s.current) {
          const targetItems = s.current.items || s.current.order_items;
          if (targetItems) {
            const updated = targetItems.map(item =>
              item.id === a.payload.orderItemId ? { ...item, review: a.payload.data } : item
            );
            if (s.current.items) s.current.items = updated;
            if (s.current.order_items) s.current.order_items = updated;
          }
        }

        // 2. Sync the background lists so the main order history card updates instantly
        if (s.list && s.list.length > 0) {
          s.list = s.list.map(order => {
            const itemsList = order.items || order.order_items;
            if (!itemsList) return order;

            const containsTarget = itemsList.some(item => item.id === a.payload.orderItemId);
            if (!containsTarget) return order;

            return {
              ...order,
              items: order.items 
                ? order.items.map(i => i.id === a.payload.orderItemId ? { ...i, review: a.payload.data } : i)
                : undefined,
              order_items: order.order_items 
                ? order.order_items.map(i => i.id === a.payload.orderItemId ? { ...i, review: a.payload.data } : i)
                : undefined,
            };
          });
        }
      })
      .addCase(submitOrderReview.rejected, (s, a) => {
        s.reviewing = false;
        s.error = a.payload;
      });


},
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
