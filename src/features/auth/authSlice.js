// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const savedUser = JSON.parse(localStorage.getItem("user"));
const savedToken = localStorage.getItem("accessToken");
const savedPolicy = JSON.parse(localStorage.getItem("policyAccepted"));

// Начальное состояние
const initialState = {
  user: savedUser || null,
  accessToken: savedToken || null,
  policyAccepted: savedPolicy || false,
  error: null,
  loading: false,
};

// Регистрация
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      await api.post("/register/", { username, email, password });
      return { username, email };
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Ошибка при регистрации");
    }
  }
);

// Логин
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/token/", { username, password });
      const { access, username: userUsername, policy_accepted } = res.data;
      const user = { username: userUsername, policy_accepted };

      localStorage.setItem("accessToken", access);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, accessToken: access };
    } catch (err) {
      return rejectWithValue("Неверный логин или пароль");
    }
  }
);

// Получение данных пользователя
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/me/");
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении данных пользователя");
    }
  }
);

// Обновление профиля
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.patch("/me/", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при обновлении профиля");
    }
  }
);

// Принятие политики
export const acceptPolicyAPI = createAsyncThunk(
  "auth/acceptPolicyAPI",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/accept-policy/");
      return true;
    } catch (err) {
      return rejectWithValue("Ошибка при принятии политики");
    }
  }
);

// Выход
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/logout/", { refresh: refreshToken });
      }
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("policyAccepted");
      
      return null;
    } catch (err) {
      // Даже если запрос не удался, очищаем локальное хранилище
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("policyAccepted");
      return null;
    }
  }
);

// Сброс пароля
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, { rejectWithValue }) => {
    try {
      await api.post("/reset-password/", { email });
      return "Инструкции отправлены на email";
    } catch (err) {
      return rejectWithValue("Ошибка при сбросе пароля");
    }
  }
);

// Подтверждение сброса пароля
export const confirmResetPassword = createAsyncThunk(
  "auth/confirmResetPassword",
  async ({ uidb64, token, new_password }, { rejectWithValue }) => {
    try {
      await api.post("/reset-password-confirm/", {
        uidb64,
        token,
        new_password,
      });
      return "Пароль успешно изменен";
    } catch (err) {
      return rejectWithValue("Ошибка при изменении пароля");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    acceptPolicy: (state) => {
      state.policyAccepted = true;
      localStorage.setItem("policyAccepted", "true");
    },
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Логин
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Получение данных пользователя
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Обновление профиля
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Принятие политики
      .addCase(acceptPolicyAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptPolicyAPI.fulfilled, (state) => {
        state.loading = false;
        state.policyAccepted = true;
        localStorage.setItem("policyAccepted", "true");
      })
      .addCase(acceptPolicyAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Выход
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.policyAccepted = false;
        state.error = null;
      })
      // Сброс пароля
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Подтверждение сброса пароля
      .addCase(confirmResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmResetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(confirmResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, acceptPolicy } = authSlice.actions;
export default authSlice.reducer;
