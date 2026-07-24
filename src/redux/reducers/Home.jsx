// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import apiClient from '../../api/client';

// export const fetchHome = createAsyncThunk(
//   'home/fetch',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await apiClient.get('/home');
//       return data;
//     } catch (e) {
//       return rejectWithValue(e?.response?.data || { message: e.message });
//     }
//   },
// );

// const homeSlice = createSlice({
//   name: 'home',
//   initialState: {
//     banners: [],
//     categories: [],
//     featuredProducts: [],
//     promotion: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchHome.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchHome.fulfilled, (state, action) => {
//         state.loading = false;
//         state.banners = action.payload.banners || [];
//         state.categories = action.payload.categories || [];
//         state.featuredProducts = action.payload.featured_products || [];
//         state.promotion = action.payload.promotion || null;
//       })
//       .addCase(fetchHome.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || { message: 'Request failed' };
//       });
//   },
// });

// export default homeSlice.reducer;





import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchHome = createAsyncThunk(
  'home/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/home');
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || { message: e.message });
    }
  },
);

export const fetchCategories = createAsyncThunk(
  'home/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/categories');
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || { message: e.message });
    }
  },
);


export const fetchCategoryById = createAsyncThunk(
  'home/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/categories/${id}`);
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || { message: e.message });
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'home/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/products/${id}`);
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || { message: e.message });
    }
  }
);

export const fetchSubCategoryProducts = createAsyncThunk(
  'home/fetchSubCategoryProducts',
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/subCat/${subCategoryId}`);
      console.log('API DATA:', data);

      return data;
    } catch (e) {
      return rejectWithValue(
        e?.response?.data || { message: e.message }
      );
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    banners: [],
    categories: [],
    featuredProducts: [],
    promotion: null,

    // categories from /categories
    allCategories: [],

    loading: false,
    categoriesLoading: false,
    error: null,


    // fetchCategoryById
    selectedCategoryDetail: null,
    subCategories: [],
    selectedCategoryId: null,

    //subCategoryProducts
    subCategoryProducts: [],
    subCategoryProductsLoading: false,

    //fetchProductById
    selectedProduct: null,
    productLoading: false,

  },
  reducers: {
    setSelectedCategoryId: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Home
      .addCase(fetchHome.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHome.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.banners || [];
        state.categories = action.payload.categories || [];
        state.featuredProducts = action.payload.featured_products || [];
        state.promotion = action.payload.promotion || null;
      })
      .addCase(fetchHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Request failed' };
      })

      // Categories
      .addCase(fetchCategories.pending, state => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.allCategories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload || { message: 'Request failed' };
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategoryDetail = action.payload;
        state.subCategories =
          action.payload?.subcategories ||
          action.payload?.children ||
          [];
      })

      //subCategoryProducts
      .addCase(fetchSubCategoryProducts.pending, state => {
        state.subCategoryProductsLoading = true;
      })
      .addCase(fetchSubCategoryProducts.fulfilled, (state, action) => {
        state.subCategoryProductsLoading = false;
        state.subCategoryProducts = action.payload?.data || action.payload || [];
      })

      .addCase(fetchSubCategoryProducts.rejected, (state, action) => {
        state.subCategoryProductsLoading = false;
        state.error = action.payload || action.error;
      })


      //fetchProductById
      .addCase(fetchProductById.pending, state => {
        state.productLoading = true;
        state.selectedProduct = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload || action.error;
      })
  },
});
export const { setSelectedCategoryId } = homeSlice.actions;
export default homeSlice.reducer;