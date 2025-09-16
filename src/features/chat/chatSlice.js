
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  chatRooms: [],
  currentRoom: null,
  messages: [],
  loading: false,
  error: null,
};

// Получение чат-комнат
export const fetchChatRooms = createAsyncThunk(
  "chat/fetchChatRooms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/chat-rooms/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении чат-комнат");
    }
  }
);

// Создание чат-комнаты
export const createChatRoom = createAsyncThunk(
  "chat/createChatRoom",
  async (participantIds, { rejectWithValue }) => {
    try {
      const res = await api.post("/chat-rooms/", { participants: participantIds });
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при создании чат-комнаты");
    }
  }
);

// Получение сообщений
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (roomId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/chat-rooms/${roomId}/messages/`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении сообщений");
    }
  }
);

// Отправка сообщения
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ roomId, content }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/chat-rooms/${roomId}/messages/`, { content });
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при отправке сообщения");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение чат-комнат
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.chatRooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Создание чат-комнаты
      .addCase(createChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.chatRooms.unshift(action.payload);
        state.currentRoom = action.payload;
      })
      .addCase(createChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Получение сообщений
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Отправка сообщения
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { clearError, setCurrentRoom, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
