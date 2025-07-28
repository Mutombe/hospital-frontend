// src/redux/slices/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authModal: {
    open: false,
    mode: 'login', 
    redirectPath: '/',
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.authModal.open = true;
      state.authModal.mode = action.payload.mode || 'login';
      state.authModal.redirectPath = action.payload.redirectPath || '/';
    },
    closeAuthModal: (state) => {
      state.authModal.open = false;
    },
    setAuthModalMode: (state, action) => {
      state.authModal.mode = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, setAuthModalMode } = modalSlice.actions;
export default modalSlice.reducer;