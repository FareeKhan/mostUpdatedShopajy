import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

export const fetchStories = createAsyncThunk(
  'stories/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/stories');
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || { message: e.message });
    }
  }
);

export const viewStory = createAsyncThunk(
  'stories/view',
  async (storyId, { rejectWithValue }) => {
        console.log('THUNK STARTED', storyId);

    try {
      const { data } = await apiClient.post(`/stories/${storyId}/view`);
      console.log('showmeViessssswData',data)
      return {
        storyId,
        data,
      };
    } catch (e) {
      console.log('eee',e)
      return rejectWithValue(e?.response?.data || { message: e.message });
    }
  }
);

const storiesSlice = createSlice({
  name: 'stories',
  initialState: {
    stories: [],
    loading: false,
    viewLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStories.pending, state => {
        state.loading = true;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload || [];
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // View Story
      .addCase(viewStory.pending, state => {
        state.viewLoading = true;
      })
      .addCase(viewStory.fulfilled, (state, action) => {
        state.viewLoading = false;
        const updated = action.payload?.data;

        const index = state.stories.findIndex(
          item => item.id === updated?.id
        );

        if (index !== -1) {
          state.stories[index] = updated;
        }
      })
      .addCase(viewStory.rejected, (state, action) => {
        state.viewLoading = false;
        state.error = action.payload;
      });
  },
});

export default storiesSlice.reducer;