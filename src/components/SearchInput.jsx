import React from "react";
import { useLocation } from "react-router-dom";

const SearchInput = ({ query, setQuery }) => {
  const location = useLocation();
  const isSearchUsersPage = location.pathname === "/search-users";

  const placeholder = isSearchUsersPage
    ? "🔍 Найти друга по имени или логину..."
    : "🔍 Искать пины по названию...";

  return (
    <div className="w-full mb-6">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
};

export default SearchInput;
