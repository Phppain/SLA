
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = { username: action.payload.username };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
    },
    register: (state, action) => {
      state.user = {
        username: action.payload.username,
        email: action.payload.email,
      };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
