// src/features/modal/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    selectedPinId: null,
  },
  reducers: {
    openPinModal: (state, action) => {
      state.selectedPinId = action.payload;
    },
    closePinModal: (state) => {
      state.selectedPinId = null;
    },
  },
});

export const { openPinModal, closePinModal } = modalSlice.actions;
export default modalSlice.reducer;
