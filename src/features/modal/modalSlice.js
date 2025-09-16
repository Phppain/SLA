// src/features/modal/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginModal: false,
  showRegisterModal: false,
  showPinModal: false,
  selectedPinId: null,
  showPolicyModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.showLoginModal = true;
    },
    closeLoginModal: (state) => {
      state.showLoginModal = false;
    },
    openRegisterModal: (state) => {
      state.showRegisterModal = true;
    },
    closeRegisterModal: (state) => {
      state.showRegisterModal = false;
    },
    openPinModal: (state, action) => {
      state.showPinModal = true;
      state.selectedPinId = action.payload;
    },
    closePinModal: (state) => {
      state.showPinModal = false;
      state.selectedPinId = null;
    },
    openPolicyModal: (state) => {
      state.showPolicyModal = true;
    },
    closePolicyModal: (state) => {
      state.showPolicyModal = false;
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  openPinModal,
  closePinModal,
  openPolicyModal,
  closePolicyModal,
} = modalSlice.actions;

export default modalSlice.reducer;
