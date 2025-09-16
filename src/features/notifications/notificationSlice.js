import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  websocket: null,
};

// Получение уведомлений
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };
      
      const res = await axios.get(`${API_URL}/notifications/`, config);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении уведомлений");
    }
  }
);

// Отметить уведомления как прочитанные
export const markNotificationsRead = createAsyncThunk(
  "notifications/markNotificationsRead",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };
      
      await axios.post(`${API_URL}/mark-notifications-read/`, {}, config);
      return true;
    } catch (err) {
      return rejectWithValue("Ошибка при отметке уведомлений");
    }
  }
);

// Отметить одно уведомление как прочитанное
export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (notificationId, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };
      
      const res = await axios.patch(`${API_URL}/notifications/${notificationId}/`, {
        is_read: true
      }, config);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при отметке уведомления");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    setWebSocket: (state, action) => {
      state.websocket = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.is_read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.is_read = true);
        state.unreadCount = 0;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { addNotification, setWebSocket, clearError, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
