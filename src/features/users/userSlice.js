import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  users: [],
  searchResults: [],
  loading: false,
  error: null,
};

// Получение всех пользователей
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении пользователей");
    }
  }
);

// Поиск пользователей
export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get(`/search/users/?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при поиске пользователей");
    }
  }
);

// Подписка/отписка от пользователя
export const toggleFollow = createAsyncThunk(
  "users/toggleFollow",
  async (username, { rejectWithValue }) => {
    try {
      await api.post(`/follow/${username}/`);
      return username;
    } catch (err) {
      return rejectWithValue("Ошибка при подписке/отписке");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение пользователей
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
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
      })
      // Подписка/отписка
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const username = action.payload;
        // Обновляем статус подписки в списке пользователей
        const user = state.users.find(u => u.username === username);
        if (user) {
          user.is_following = !user.is_following;
        }
        // Обновляем статус подписки в результатах поиска
        const searchUser = state.searchResults.find(u => u.username === username);
        if (searchUser) {
          searchUser.is_following = !searchUser.is_following;
        }
      });
  },
});

export const { clearError, clearSearchResults } = userSlice.actions;
export default userSlice.reducer;
