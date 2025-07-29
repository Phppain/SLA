import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("user"));
const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
const savedPolicy = JSON.parse(localStorage.getItem("policyAccepted"));

const initialState = {
  user: savedUser || null,
  users: savedUsers,
  policyAccepted: savedPolicy || false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action) => {
      const { username, email, password } = action.payload;
      const existingUser = state.users.find((u) => u.email === email);

      if (existingUser) {
        state.error = "Пользователь с такой почтой уже существует";
        return;
      }

      const newUser = { username, email, password };
      state.users.push(newUser);
      localStorage.setItem("users", JSON.stringify(state.users));

      state.user = { username, email };
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.removeItem("policyAccepted");

      state.policyAccepted = false;
      state.error = null;
    },

    login: (state, action) => {
      const { email, password } = action.payload;
      const foundUser = state.users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        state.error = "Неверный email или пароль";
        return;
      }

      state.user = { username: foundUser.username, email: foundUser.email };
      localStorage.setItem("user", JSON.stringify(state.user));
      state.policyAccepted = localStorage.getItem("policyAccepted") === "true";
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.policyAccepted = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("policyAccepted");
    },

    acceptPolicy: (state) => {
      state.policyAccepted = true;
      localStorage.setItem("policyAccepted", "true");
    },

    clearError: (state) => {
      state.error = null;
    },

    // ✅ Новый редьюсер для удаления аккаунта
    deleteAccount: (state) => {
      if (!state.user) return;

      // Удаляем пользователя из массива users
      const updatedUsers = state.users.filter(
        (u) => u.email !== state.user.email
      );
      state.users = updatedUsers;
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Сбрасываем всё, как при logout
      state.user = null;
      state.policyAccepted = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("policyAccepted");
    },
  },
});

// 👇 Обновляем экспорт
export const {
  register,
  login,
  logout,
  acceptPolicy,
  clearError,
  deleteAccount,
} = authSlice.actions;

export default authSlice.reducer;
