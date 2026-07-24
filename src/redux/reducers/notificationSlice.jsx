import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPushNotification: false,
  isEmailEnable: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setPushNotification: (state, action) => {
      state.isPushNotification = action.payload;
    },
    setEmailNotification: (state, action) => {
      state.isEmailEnable = action.payload;
    },
  },
});

export const { setPushNotification, setEmailNotification } = notificationSlice.actions;
export default notificationSlice.reducer;