import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchUsers, fetchUsers } from "../features/users/userSlice";
import UserCard from "../components/UserCard";
import { FiSearch, FiUsers, FiUserPlus, FiUserCheck } from "react-icons/fi";

const SearchUsers = () => {
  const dispatch = useDispatch();
  const { searchResults, users, loading } = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search"); // search, all, friends

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentUser]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      await dispatch(searchUsers(query));
    }
  };

  const getDisplayUsers = () => {
    switch (activeTab) {
      case "search":
        return searchResults;
      case "all":
        return users.filter(user => user.id !== currentUser?.id);
      case "friends":
        return users.filter(user => user.is_following);
      default:
        return [];
    }
  };

  const displayUsers = getDisplayUsers();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-600">Для поиска пользователей необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiUsers className="text-pink-600" />
            Найти друзей
          </h1>
          
          {/* Поиск */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Найти пользователя по имени или логину..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={!query.trim()}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Найти
              </button>
            </div>
          </form>

          {/* Табы */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "search"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Поиск
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "all"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Все пользователи
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "friends"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Мои друзья
            </button>
          </div>
        </div>

        {/* Результаты */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === "search" && query
                  ? "Пользователи не найдены"
                  : activeTab === "friends"
                  ? "У вас пока нет друзей"
                  : "Пользователи не найдены"
                }
              </h3>
              <p className="text-gray-600">
                {activeTab === "search" && query
                  ? "Попробуйте изменить поисковый запрос"
                  : activeTab === "friends"
                  ? "Начните добавлять друзей, чтобы они появились здесь"
                  : "Попробуйте поискать по-другому"
                }
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === "search" && query
                    ? `Результаты поиска: ${displayUsers.length}`
                    : activeTab === "friends"
                    ? `Мои друзья: ${displayUsers.length}`
                    : `Все пользователи: ${displayUsers.length}`
                  }
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Статистика */}
        {currentUser && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">
                  {users.filter(u => u.is_following).length}
                </div>
                <div className="text-sm text-gray-600">Подписок</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.followers_count > 0).length}
                </div>
                <div className="text-sm text-gray-600">Подписчиков</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {users.length - 1}
                </div>
                <div className="text-sm text-gray-600">Всего пользователей</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
