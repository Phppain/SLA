// src/features/pins/pinSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  pins: [
    {
      id: 1,
      title: "Красивый закат",
      description: "Невероятный закат на море",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      author: { id: 1, username: "user1", avatar: null },
      likes_count: 42,
      comments_count: 8,
      saves_count: 15,
      is_liked: false,
      is_saved: false,
      category: "природа"
    },
    {
      id: 2,
      title: "Кофейня в Париже",
      description: "Уютная кофейня в центре Парижа",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=600&fit=crop",
      author: { id: 2, username: "user2", avatar: null },
      likes_count: 128,
      comments_count: 23,
      saves_count: 45,
      is_liked: true,
      is_saved: true,
      category: "путешествия"
    },
    {
      id: 3,
      title: "Минималистичный дизайн",
      description: "Современный минималистичный интерьер",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=600&fit=crop",
      author: { id: 1, username: "user1", avatar: null },
      likes_count: 89,
      comments_count: 12,
      saves_count: 67,
      is_liked: false,
      is_saved: false,
      category: "дизайн"
    },
    {
      id: 4,
      title: "Здоровый завтрак",
      description: "Питательный и вкусный завтрак",
      image: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=400&h=600&fit=crop",
      author: { id: 3, username: "user3", avatar: null },
      likes_count: 156,
      comments_count: 34,
      saves_count: 89,
      is_liked: true,
      is_saved: true,
      category: "еда"
    },
    {
      id: 5,
      title: "Горный пейзаж",
      description: "Величественные горы на рассвете",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      author: { id: 1, username: "user1", avatar: null },
      likes_count: 203,
      comments_count: 45,
      saves_count: 123,
      is_liked: false,
      is_saved: false,
      category: "природа"
    },
    {
      id: 6,
      title: "Модный образ",
      description: "Стильный наряд для вечера",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
      author: { id: 2, username: "user2", avatar: null },
      likes_count: 78,
      comments_count: 15,
      saves_count: 56,
      is_liked: true,
      is_saved: false,
      category: "мода"
    }
  ],
  savedPins: [
    {
      id: 2,
      title: "Кофейня в Париже",
      description: "Уютная кофейня в центре Парижа",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=600&fit=crop",
      author: { id: 2, username: "user2", avatar: null },
      likes_count: 128,
      comments_count: 23,
      saves_count: 45,
      is_liked: true,
      is_saved: true,
      category: "путешествия"
    },
    {
      id: 4,
      title: "Здоровый завтрак",
      description: "Питательный и вкусный завтрак",
      image: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=400&h=600&fit=crop",
      author: { id: 3, username: "user3", avatar: null },
      likes_count: 156,
      comments_count: 34,
      saves_count: 89,
      is_liked: true,
      is_saved: true,
      category: "еда"
    }
  ],
  loading: false,
  error: null,
};

// Получение всех пинов
export const fetchPins = createAsyncThunk(
  "pins/fetchPins",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/posts/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении пинов");
    }
  }
);

// Получение пинов пользователя
export const fetchUserPins = createAsyncThunk(
  "pins/fetchUserPins",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching user pins for user ID:", userId);
      const res = await api.get(`/posts/?author=${userId}`);
      console.log("🔍 User pins response:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error fetching user pins:", err);
      return rejectWithValue("Ошибка при получении пинов пользователя");
    }
  }
);

// Создание пина
export const createPin = createAsyncThunk(
  "pins/createPin",
  async (pinData, { rejectWithValue }) => {
    try {
      const res = await api.post("/posts/", pinData);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при создании пина");
    }
  }
);

// Обновление пина
export const updatePin = createAsyncThunk(
  "pins/updatePin",
  async ({ pinId, pinData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/posts/${pinId}/`, pinData);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при обновлении пина");
    }
  }
);

// Удаление пина
export const deletePin = createAsyncThunk(
  "pins/deletePin",
  async (pinId, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${pinId}/`);
      return pinId;
    } catch (err) {
      return rejectWithValue("Ошибка при удалении пина");
    }
  }
);

// Лайк/анлайк пина
export const toggleLike = createAsyncThunk(
  "pins/toggleLike",
  async (pinId, { rejectWithValue }) => {
    try {
      await api.post(`/like/${pinId}/`);
      return pinId;
    } catch (err) {
      return rejectWithValue("Ошибка при лайке пина");
    }
  }
);

// Сохранение/удаление пина
export const toggleSave = createAsyncThunk(
  "pins/toggleSave",
  async (pinId, { rejectWithValue }) => {
    try {
      await api.post(`/save/${pinId}/`);
      return pinId;
    } catch (err) {
      return rejectWithValue("Ошибка при сохранении пина");
    }
  }
);

// Получение сохраненных пинов
export const fetchSavedPins = createAsyncThunk(
  "pins/fetchSavedPins",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/saved-posts/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении сохраненных пинов");
    }
  }
);

// Поиск пинов
export const searchPins = createAsyncThunk(
  "pins/searchPins",
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get(`/search/posts/?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при поиске пинов");
    }
  }
);

const pinSlice = createSlice({
  name: "pins",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPins: (state) => {
      state.pins = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение пинов
      .addCase(fetchPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPins.fulfilled, (state, action) => {
        state.loading = false;
        state.pins = action.payload;
      })
      .addCase(fetchPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Получение пинов пользователя
      .addCase(fetchUserPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPins.fulfilled, (state, action) => {
        state.loading = false;
        state.pins = action.payload;
      })
      .addCase(fetchUserPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Создание пина
      .addCase(createPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPin.fulfilled, (state, action) => {
        state.loading = false;
        state.pins.unshift(action.payload);
      })
      .addCase(createPin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Обновление пина
      .addCase(updatePin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePin.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pins.findIndex((pin) => pin.id === action.payload.id);
        if (index !== -1) {
          state.pins[index] = action.payload;
        }
      })
      .addCase(updatePin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Удаление пина
      .addCase(deletePin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePin.fulfilled, (state, action) => {
        state.loading = false;
        state.pins = state.pins.filter((pin) => pin.id !== action.payload);
      })
      .addCase(deletePin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Лайк/анлайк
      .addCase(toggleLike.fulfilled, (state, action) => {
        const pin = state.pins.find((p) => p.id === action.payload);
        if (pin) {
          pin.is_liked = !pin.is_liked;
          pin.likes_count = pin.is_liked ? pin.likes_count + 1 : pin.likes_count - 1;
        }
      })
      // Сохранение/удаление
      .addCase(toggleSave.fulfilled, (state, action) => {
        const pin = state.pins.find((p) => p.id === action.payload);
        if (pin) {
          pin.is_saved = !pin.is_saved;
        }
      })
      // Получение сохраненных пинов
      .addCase(fetchSavedPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPins.fulfilled, (state, action) => {
        state.loading = false;
        state.savedPins = action.payload;
      })
      .addCase(fetchSavedPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Поиск пинов
      .addCase(searchPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPins.fulfilled, (state, action) => {
        state.loading = false;
        state.pins = action.payload;
      })
      .addCase(searchPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearPins } = pinSlice.actions;
export default pinSlice.reducer;
