// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  searchResults: [],
  searchQuery: "",
  loading: false,
  error: null,
};

// Поиск пинов
export const searchPins = createAsyncThunk(
  "search/searchPins",
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/search/?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при поиске пинов");
    }
  }
);

// Поиск пользователей
export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/search/?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при поиске пользователей");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Поиск пинов
      .addCase(searchPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPins.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Поиск пользователей
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, clearSearchResults, clearError } = searchSlice.actions;
export default searchSlice.reducer;
