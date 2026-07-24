import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

const extractError = err =>
  err?.response?.data || { message: err?.message || 'Network error' };

export const fetchReels = createAsyncThunk(
  'reels/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/reels');
      return data;
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const toggleReelLike = createAsyncThunk(
  'reels/toggleLike',
  async ({ reelId, isLiked }, { rejectWithValue }) => {
    try {
      const { data } = isLiked
        ? await apiClient.delete(`/reels/${reelId}/like`)
        : await apiClient.post(`/reels/${reelId}/like`);
      return { reelId, ...data };
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  },
);

export const fetchReelComments = createAsyncThunk(
  'reels/fetchComments',
  async (reelId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/reels/${reelId}/comments`);
      return { reelId, comments: data?.data || [] };
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  }
);

export const postReelComment = createAsyncThunk(
  'reels/postComment',
  async ({ reelId, body }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/reels/${reelId}/comments`, { body });
      return { reelId, comment: data }; // Assumes your server returns the created comment object
    } catch (e) {
      return rejectWithValue(extractError(e));
    }
  }
);

const slice = createSlice({
  name: 'reels',
  initialState: {
    list: [],
    loading: false,
    error: null,
    comments: {},
    commentsLoading: false,
  },
  reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(fetchReels.pending, s => { s.loading = true; s.error = null; })
//       .addCase(fetchReels.fulfilled, (s, a) => {
//         s.loading = false;
//         s.list = a.payload?.data || [];
//       })
//       .addCase(fetchReels.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
//       .addCase(toggleReelLike.fulfilled, (s, a) => {
//         s.list = s.list.map(r => r.id === a.payload.reelId
//           ? { ...r, is_liked: !!a.payload.liked, like_count: a.payload.like_count }
//           : r);
//       });




// .addCase(fetchReelComments.pending, s => { s.commentsLoading = true; })
//       .addCase(fetchReelComments.fulfilled, (s, a) => {
//         s.commentsLoading = false;
//         s.comments[a.payload.reelId] = a.payload.comments;
//       })
//       .addCase(fetchReelComments.rejected, s => { s.commentsLoading = false; })
//       .addCase(postReelComment.fulfilled, (s, a) => {
//         if (!s.comments[a.payload.reelId]) s.comments[a.payload.reelId] = [];
//         s.comments[a.payload.reelId].unshift(a.payload.comment); // Pushes new comment to top
//       });



      
//   },

extraReducers: builder => {
  builder
    .addCase(fetchReels.pending, s => { s.loading = true; s.error = null; })
    .addCase(fetchReels.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload?.data || [];
    })
    .addCase(toggleReelLike.fulfilled, (s, a) => {
      s.list = s.list.map(r => r.id === a.payload.reelId
        ? { ...r, is_liked: !!a.payload.liked, like_count: a.payload.like_count }
        : r);
    })
    .addCase(fetchReelComments.pending, s => { s.commentsLoading = true; })
    .addCase(fetchReelComments.fulfilled, (s, a) => {
      s.commentsLoading = false;
      s.comments[a.payload.reelId] = a.payload.comments;
    })
    .addCase(fetchReelComments.rejected, s => { s.commentsLoading = false; })
    .addCase(postReelComment.fulfilled, (s, a) => {
      if (!s.comments[a.payload.reelId]) s.comments[a.payload.reelId] = [];
      
      // 👈 FIX: Extracted payload data variant check safely
      const cleanComment = a.payload.comment?.data || a.payload.comment;
      
      if (cleanComment) {
          s.comments[a.payload.reelId].unshift(cleanComment);
      }
    });
}
});

export default slice.reducer;
