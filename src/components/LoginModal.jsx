import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const LoginModal = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail.mode === "login") {
        setShow(true);
      }
    };
    window.addEventListener("openAuthModal", handleOpen);
    return () => window.removeEventListener("openAuthModal", handleOpen);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  const closeModal = () => {
    setShow(false);
    setEmail("");
    setPassword("");
  };

  const handleForgotPassword = () => {
    closeModal();
    navigate("/reset-password");
  };

  const switchToRegister = () => {
    closeModal();
    window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { mode: "register" } }));
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">Добро пожаловать</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Войти
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center space-y-2">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:underline"
          >
            Забыли пароль?
          </button>
          <button
            onClick={switchToRegister}
            className="text-sm text-gray-600 hover:underline"
          >
            Нет аккаунта? Зарегистрироваться
          </button>
        </div>

        <button
          onClick={closeModal}
          className="mt-4 block mx-auto text-xs text-gray-400 hover:text-gray-600 hover:underline"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
