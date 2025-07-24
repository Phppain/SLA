
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${search}`);
  };

  return (
    <>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      <nav className="bg-white shadow p-4 flex flex-wrap justify-between items-center gap-2">
        <Link to="/" className="text-xl font-bold text-red-500">Pinterest</Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Поиск пинов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </form>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Link
                to="/create"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Создать пин
              </Link>
              <Link to="/chat" className="hover:underline">Чат</Link>
              <Link to="/profile" className="hover:underline">Профиль</Link>
              <Link to="/search-users" className="hover:underline">Найти друзей</Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:underline"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Войти
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="text-sm bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300"
              >
                Зарегистрироваться
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
