import React from "react";
import { useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchInput = ({ query, setQuery }) => {
  const location = useLocation();
  const isSearchUsersPage = location.pathname === "/search-users";

  const placeholder = isSearchUsersPage
    ? "Найти друга по имени или логину..."
    : "Искать пины по названию...";

  return (
    <div className="relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <FiSearch size={18} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 transition text-sm"
      />
    </div>
  );
};

export default SearchInput;
