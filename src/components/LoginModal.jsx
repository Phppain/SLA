
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

const LoginModal = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

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
    if (!username) return;
    dispatch(login({ username }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
        <h2 className="text-2xl font-bold mb-4">Вход</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя пользователя"
            className="w-full mb-2 p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full mb-2 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
            Войти
          </button>
        </form>
        <button onClick={() => setShow(false)} className="mt-4 text-sm text-gray-500 hover:underline">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
