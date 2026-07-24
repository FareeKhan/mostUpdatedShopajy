import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
  onBoard: true,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      console.log('fareed',action.payload)
      state.language = action.payload;
    },
    handleOnboard: (state, action) => {
      state.onBoard = false
    },
  },
});

export const { setLanguage ,handleOnboard} = languageSlice.actions;
export default languageSlice.reducer;