import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiPlus,
  FiUsers,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiMessageCircle,
  FiBell,
  FiSettings,
  FiX,
  FiSearch,
  FiHeart,
  FiBookmark,
  FiMenu,
  FiGrid,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const IconWithTooltip = ({ to, icon: Icon, label, onClick, isMobile = false, badge = null }) => {
  if (isMobile) {
    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
        {to ? (
          <Link to={to} className="flex items-center space-x-3 text-gray-700 hover:text-pink-600">
            <div className="relative">
              <Icon size={20} />
              {badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ) : (
          <button
            onClick={onClick}
            className="flex items-center space-x-3 text-gray-700 hover:text-pink-600"
          >
            <div className="relative">
              <Icon size={20} />
              {badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      {to ? (
        <Link
          to={to}
          className="text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <div className="relative">
            <Icon size={24} />
            {badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </div>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <div className="relative">
            <Icon size={24} />
            {badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </div>
        </button>
      )}
      <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-50 whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </div>
  );
};

const Navbar = ({ isMobile = false, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { unreadCount } = useSelector((state) => state.notifications);

  const handleLogout = () => {
    dispatch(logout());
    if (onClose) onClose();
  };

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { mode: "login" } }));
    if (onClose) onClose();
  };

  const handleRegister = () => {
    window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { mode: "register" } }));
    if (onClose) onClose();
  };

  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Заголовок мобильного меню */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="text-pink-600 text-xl font-bold" onClick={onClose}>
            SLA
          </Link>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {/* Навигация */}
        <div className="flex-1 p-4 space-y-2">
          <IconWithTooltip to="/" icon={FiHome} label="Главная" isMobile={true} />
          <IconWithTooltip to="/pins" icon={FiGrid} label="Пины" isMobile={true} />
          <IconWithTooltip to="/search-users" icon={FiUsers} label="Найти друзей" isMobile={true} />
          
          {user && (
            <>
              <IconWithTooltip to="/create" icon={FiPlus} label="Создать пин" isMobile={true} />
              <IconWithTooltip to="/saved" icon={FiBookmark} label="Сохраненные" isMobile={true} />
              <IconWithTooltip to="/chat" icon={FiMessageCircle} label="Сообщения" isMobile={true} badge={unreadCount > 0 ? unreadCount : null} />
              <IconWithTooltip to="/notifications" icon={FiBell} label="Уведомления" isMobile={true} badge={unreadCount > 0 ? unreadCount : null} />
              <IconWithTooltip to="/settings" icon={FiSettings} label="Настройки" isMobile={true} />
            </>
          )}
        </div>

        {/* Авторизация */}
        <div className="p-4 border-t">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 text-red-600 hover:text-red-700 p-3 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={20} />
              <span className="text-sm font-medium">Выйти</span>
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleLogin}
                className="w-full flex items-center space-x-3 text-gray-700 hover:text-pink-600 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiLogIn size={20} />
                <span className="text-sm font-medium">Войти</span>
              </button>
              <button
                onClick={handleRegister}
                className="w-full flex items-center space-x-3 text-gray-700 hover:text-pink-600 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiUserPlus size={20} />
                <span className="text-sm font-medium">Регистрация</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white shadow-lg flex flex-col items-center py-6 space-y-8 z-40">
      {/* Логотип */}
      <Link to="/" className="text-pink-600 text-2xl font-bold mb-8">
        SLA
      </Link>

      {/* Основная навигация */}
      <div className="flex flex-col items-center space-y-6">
        <IconWithTooltip to="/" icon={FiHome} label="Главная" />
        <IconWithTooltip to="/pins" icon={FiGrid} label="Пины" />
        <IconWithTooltip to="/search-users" icon={FiUsers} label="Найти друзей" />
        
        {user && (
          <>
            <IconWithTooltip to="/create" icon={FiPlus} label="Создать пин" />
            <IconWithTooltip to="/saved" icon={FiBookmark} label="Сохраненные" />
            <IconWithTooltip to="/chat" icon={FiMessageCircle} label="Сообщения" badge={unreadCount > 0 ? unreadCount : null} />
            <IconWithTooltip to="/notifications" icon={FiBell} label="Уведомления" badge={unreadCount > 0 ? unreadCount : null} />
          </>
        )}
      </div>

      {/* Нижняя часть */}
      <div className="mt-auto">
        {user ? (
          <div className="flex flex-col items-center space-y-4">
            <IconWithTooltip to="/settings" icon={FiSettings} label="Настройки" />
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Выйти"
            >
              <FiLogOut size={24} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleLogin}
              className="text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              title="Войти"
            >
              <FiLogIn size={24} />
            </button>
            <button
              onClick={handleRegister}
              className="text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              title="Регистрация"
            >
              <FiUserPlus size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
