import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const fetchCartRemote = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/cart');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);


export const addCartRemote = createAsyncThunk(
  'cart/add',
  async (payload, { rejectWithValue }) => {

    console.log('thisisCArtt',payload)
    try {
      const { data } = await apiClient.post('/cart', payload);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);


export const updateCartRemote = createAsyncThunk(
  'cart/update',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(`/cart/${id}`, { quantity });
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const removeCartRemote = createAsyncThunk(
  'cart/remove',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/cart/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const clearCartRemote = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.delete('/cart');
      return true;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);


export const getShippingQuote = createAsyncThunk(
  'shipping/quote',
  async (payload, { rejectWithValue }) => {
    try {
      const { method, ...body } = payload;
      const url = method ? `/shipping/quote?method=${method}` : '/shipping/quote';
      const { data } = await apiClient.post(url, body);
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchShippingMethods = createAsyncThunk(
  'shipping/fetchMethods',
  async (_, { rejectWithValue }) => {
    try {
      const [dtd, alq] = await Promise.all([
        apiClient.get('/shipping/governorates?method=door_to_door'),
        apiClient.get('/shipping/governorates?method=al_qadmus')
      ]);
      return { door_to_door: dtd.data, al_qadmus: alq.data };
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  }
);

const initialState = {
  cart: [],
  shippingQuote: null,
  shippingLoading: false,
  shippingMethodsData: null,
  shippingError: null,
  shippingMethodsLoading: false,
};

// const matches = (a, b) =>
//   a.id === b.id && a.size === b.size && a.color === b.color;

const matches = (a, b) => {
  if (a.id !== b.id) return false;

  const getColorString = (target) => {
    if (!target) return '';
    return typeof target === 'object' ? target?.label?.toLowerCase() : String(target).toLowerCase();
  };

  const getSizeString = (target) => {
    if (!target) return '';
    // ✅ Fixed: Now checks target?.label?.toLowerCase() safely
    return typeof target === 'object' ? target?.label?.toLowerCase() : String(target).toLowerCase();
  };

  const colorA = getColorString(a.color);
  const colorB = getColorString(b.color);
  
  const sizeA = getSizeString(a.size);
  const sizeB = getSizeString(b.size);

  return colorA === colorB && sizeA === sizeB;
};

const CartProduct = createSlice({
  name: 'CartProduct',
  initialState,
  reducers: {
    productToCart: (state, action) => {




      const data = action.payload;
      const existing = state.cart.find(item => matches(item, data));
      if (existing) {
        existing.quantity = (existing.quantity || 1) + (data.quantity || 1);
      } else {
        state.cart.push({ ...data, quantity: data.quantity || 1 });
      }


    },
    incrementQuanity: (state, action) => {
      const id = action.payload;
      const item = state.cart.find(i => i.id === id);
      if (item) item.quantity += 1;
    },
    decrementQuanity: (state, action) => {
      const id = action.payload;
      const item = state.cart.find(i => i.id === id);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    // removeCartProduct: (state, action) => {
    //   const id = action.payload;
    //   state.cart = state.cart.filter(i => i.id !== id);
    // },
    removeCartProduct: (state, action) => {
      const target = action.payload;
      state.cart = state.cart.filter(i => !matches(i, target));

      console.log('apkokyaparhii',target)
    },
    emptyCart: state => {
      state.cart = [];
      state.shippingQuote = null;
    },
    setCartFromServer: (state, action) => {
      state.cart = (action.payload || []).map(item => ({
        id: item.product?.id || item.product_id,
        cartItemId: item.id,
        title: item.product?.title_en || item.product?.title_ar,
        image: item.product?.image,
        price: item.product?.price,
        discountPrice: item.product?.discount_price,
        usdEquivalent: item.product?.usd_equivalent,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        description: item.product?.description_en || item.product?.description_ar,
      }));
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCartRemote.fulfilled, (state, action) => {
      state.cart = (action.payload || []).map(item => ({
        id: item.product?.id || item.product_id,
        cartItemId: item.id,
        title: item.product?.title_en || item.product?.title_ar,
        image: item.product?.image,
        price: item.product?.price,
        discountPrice: item.product?.discount_price,
        usdEquivalent: item.product?.usd_equivalent,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        description: item.product?.description_en || item.product?.description_ar,
      }));
    });

    // 2. NEW: Handle getShippingQuote lifecycle cases
    builder
      .addCase(getShippingQuote.pending, (state) => {
        state.shippingLoading = true;
        state.shippingError = null;
      })
      .addCase(getShippingQuote.fulfilled, (state, action) => {
        state.shippingLoading = false;
        state.shippingQuote = action.payload; // Saves the response data from your server
      })
      .addCase(getShippingQuote.rejected, (state, action) => {
        state.shippingLoading = false;
        state.shippingError = action.payload || 'Failed to get shipping quote';
      })


      .addCase(fetchShippingMethods.pending, (state) => { state.shippingMethodsLoading = true; })
      .addCase(fetchShippingMethods.fulfilled, (state, action) => {
        state.shippingMethodsLoading = false;
        state.shippingMethodsData = action.payload;
      })
  },
});

export const {
  productToCart,
  removeCartProduct,
  incrementQuanity,
  decrementQuanity,
  emptyCart,
  setCartFromServer,
} = CartProduct.actions;
export default CartProduct.reducer;
