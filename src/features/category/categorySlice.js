// src/features/category/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  categories: [
    { id: 1, name: "природа", icon: "🌿" },
    { id: 2, name: "путешествия", icon: "✈️" },
    { id: 3, name: "дизайн", icon: "🎨" },
    { id: 4, name: "еда", icon: "🍕" },
    { id: 5, name: "мода", icon: "👗" },
    { id: 6, name: "технологии", icon: "💻" },
    { id: 7, name: "спорт", icon: "⚽" },
    { id: 8, name: "искусство", icon: "🎭" },
  ],
  selectedCategory: "",
  loading: false,
  error: null,
};

// Получение всех категорий
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/categories/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении категорий");
    }
  }
);

// Создание категории
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await api.post("/categories/", categoryData);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при создании категории");
    }
  }
);

// Обновление категории
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/categories/${categoryId}/`, categoryData);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при обновлении категории");
    }
  }
);

// Удаление категории
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${categoryId}/`);
      return categoryId;
    } catch (err) {
      return rejectWithValue("Ошибка при удалении категории");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = "";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение категорий
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Создание категории
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Обновление категории
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Удаление категории
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((cat) => cat.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory, clearSelectedCategory, clearError } = categorySlice.actions;
export default categorySlice.reducer;