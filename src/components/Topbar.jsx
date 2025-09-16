import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../features/search/searchSlice";
import SearchInput from "./SearchInput";
import { Link } from "react-router-dom";
import { FiUser, FiMenu } from "react-icons/fi";

const Topbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.searchQuery);
  const user = useSelector((state) => state.auth.user);

  const handleChange = (value) => {
    dispatch(setSearchQuery(value));
  };

  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-4">
      
      {/* Кнопка меню на мобилках */}
      <button
        className="lg:hidden text-gray-600 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-gray-100"
        onClick={toggleSidebar}
        title="Открыть меню"
      >
        <FiMenu size={24} />
      </button>

      {/* Логотип на мобилках */}
      <Link to="/" className="lg:hidden text-pink-600 text-xl font-bold">
        SLA
      </Link>

      {/* Поиск */}
      <div className="flex-1 max-w-full sm:max-w-[90%] md:max-w-2xl lg:max-w-xl">
        <SearchInput query={query} setQuery={(e) => handleChange(e)} />
      </div>

      {/* Профиль пользователя */}
      {user ? (
        <Link
          to="/profile"
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          title="Профиль"
        >
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FiUser size={16} className="text-pink-600" />
            )}
          </div>
          <span className="hidden lg:inline text-sm font-medium">
            {user.username}
          </span>
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { mode: "login" } }))}
            className="px-4 py-2 text-gray-700 hover:text-pink-600 transition-colors font-medium"
          >
            Войти
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { mode: "register" } }))}
            className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors font-medium"
          >
            Регистрация
          </button>
        </div>
      )}
    </div>
  );
};

export default Topbar;
