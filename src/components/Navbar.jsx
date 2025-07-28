import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiPlus,
  FiUsers,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiMessageCircle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../features/search/searchSlice";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const user = useSelector((state) => state.auth.user);

  const isSearchUsersPage = location.pathname === "/search-users";

  const handleChange = (e) => {
    dispatch(setQuery(e.target.value));
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
  };

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { mode: "login" } }));
  };

  const handleRegister = () => {
    window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { mode: "register" } }));
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md px-4 py-2 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-pink-600">
        SLA
      </Link>

      <div className="flex-1 mx-4">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={isSearchUsersPage ? "Поиск друзей..." : "Поиск пинов..."}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <nav className="flex items-center space-x-4">
        <Link to="/pins" className="text-gray-600 hover:text-pink-600 transition" title="Все пины">
          <FiSearch size={22} />
        </Link>
        <Link to="/create" className="text-gray-600 hover:text-pink-600 transition" title="Создать пин">
          <FiPlus size={22} />
        </Link>
        <Link to="/search-users" className="text-gray-600 hover:text-pink-600 transition" title="Найти друзей">
          <FiUsers size={22} />
        </Link>
        <Link to="/chat" className="text-gray-600 hover:text-pink-600 transition" title="Чат">
          <FiMessageCircle size={22} />
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="text-gray-600 hover:text-pink-600 transition" title="Профиль">
              <FiUser size={22} />
            </Link>
            <button
              onClick={handleLogout}
              title="Выйти"
              className="text-gray-600 hover:text-red-600 transition"
            >
              <FiLogOut size={22} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              title="Войти"
              className="text-gray-600 hover:text-green-600 transition"
            >
              <FiLogIn size={22} />
            </button>
            <button
              onClick={handleRegister}
              title="Зарегистрироваться"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <FiUserPlus size={22} />
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
