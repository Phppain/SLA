import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";

const RegisterModal = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail.mode === "register") {
        setShow(true);
      }
    };
    window.addEventListener("openAuthModal", handleOpen);
    return () => window.removeEventListener("openAuthModal", handleOpen);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    dispatch(register({ username, email, password }));
  };

  const handleClose = () => {
    setShow(false);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const switchToLogin = () => {
    handleClose();
    window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { mode: "login" } }));
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Регистрация</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Имя пользователя"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
          >
            Зарегистрироваться
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center space-y-2">
          <button
            onClick={switchToLogin}
            className="text-sm text-gray-600 hover:underline"
          >
            Уже есть аккаунт? Войти
          </button>
        </div>

        <button
          onClick={handleClose}
          className="mt-4 block mx-auto text-xs text-gray-400 hover:text-gray-600 hover:underline"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
