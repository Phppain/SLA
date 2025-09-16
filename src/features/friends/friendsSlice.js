
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  friends: [
    { id: 1, username: "user1", first_name: "Анна", avatar: null, posts_count: 15, followers_count: 120, following_count: 45, is_following: true },
    { id: 2, username: "user2", first_name: "Михаил", avatar: null, posts_count: 8, followers_count: 89, following_count: 23, is_following: true },
    { id: 3, username: "user3", first_name: "Елена", avatar: null, posts_count: 32, followers_count: 234, following_count: 67, is_following: false }
  ],
  followers: [
    { id: 1, username: "user1", first_name: "Анна", avatar: null, posts_count: 15, followers_count: 120, following_count: 45, is_following: true },
    { id: 2, username: "user2", first_name: "Михаил", avatar: null, posts_count: 8, followers_count: 89, following_count: 23, is_following: true },
    { id: 4, username: "user4", first_name: "Дмитрий", avatar: null, posts_count: 12, followers_count: 67, following_count: 34, is_following: false }
  ],
  following: [
    { id: 1, username: "user1", first_name: "Анна", avatar: null, posts_count: 15, followers_count: 120, following_count: 45, is_following: true },
    { id: 2, username: "user2", first_name: "Михаил", avatar: null, posts_count: 8, followers_count: 89, following_count: 23, is_following: true },
    { id: 5, username: "user5", first_name: "Ольга", avatar: null, posts_count: 25, followers_count: 156, following_count: 78, is_following: true }
  ],
  loading: false,
  error: null,
};

// Получение друзей
export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/friends/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении друзей");
    }
  }
);

// Получение подписчиков
export const fetchFollowers = createAsyncThunk(
  "friends/fetchFollowers",
  async (username, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${username}/followers/`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении подписчиков");
    }
  }
);

// Получение подписок
export const fetchFollowing = createAsyncThunk(
  "friends/fetchFollowing",
  async (username, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${username}/following/`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении подписок");
    }
  }
);

// Принять заявку в друзья
export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/friends/requests/${requestId}/accept/`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при принятии заявки");
    }
  }
);

// Отклонить заявку в друзья
export const rejectFriendRequest = createAsyncThunk(
  "friends/rejectFriendRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      await api.post(`/friends/requests/${requestId}/reject/`);
      return requestId;
    } catch (err) {
      return rejectWithValue("Ошибка при отклонении заявки");
    }
  }
);

// Отправить заявку в друзья
export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async (username, { rejectWithValue }) => {
    try {
      const res = await api.post(`/friends/requests/`, { to_user: username });
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при отправке заявки");
    }
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение друзей
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Получение подписчиков
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Получение подписок
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.following = action.payload;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Принятие заявки
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        // Обновляем список друзей
        state.friends.push(action.payload);
      })
      // Отклонение заявки
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        // Удаляем заявку из списка
        // Здесь можно добавить логику для удаления из pending requests
      })
      // Отправка заявки
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        // Заявка отправлена успешно
      });
  },
});

export const { clearError } = friendsSlice.actions;
export default friendsSlice.reducer;
