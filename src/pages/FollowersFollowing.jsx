import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFollowers, fetchFollowing } from "../features/friends/friendsSlice";
import UserCard from "../components/UserCard";
import { FiUsers, FiUserPlus, FiUserCheck } from "react-icons/fi";

const FollowersFollowing = () => {
  const dispatch = useDispatch();
  const { followers, following, loading } = useSelector((state) => state.friends);
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("followers");

  useEffect(() => {
    if (user) {
      dispatch(fetchFollowers());
      dispatch(fetchFollowing());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-600">Для просмотра подписчиков необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FiUsers className="text-pink-600" />
            Подписчики и подписки
          </h1>
        </div>
      </div>

      {/* Табы */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("followers")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "followers"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FiUserPlus size={16} />
                Подписчики ({followers.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "following"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FiUserCheck size={16} />
                Подписки ({following.length})
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div>
            {activeTab === "followers" ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Люди, которые подписаны на вас
                </h2>
                {followers.length === 0 ? (
                  <div className="text-center py-12">
                    <FiUserPlus size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет подписчиков</h3>
                    <p className="text-gray-600 mb-6">
                      Когда люди подпишутся на вас, они появятся здесь
                    </p>
                    <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                      Найти друзей
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {followers.map((follower) => (
                      <UserCard key={follower.id} user={follower} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Люди, на которых вы подписаны
                </h2>
                {following.length === 0 ? (
                  <div className="text-center py-12">
                    <FiUserCheck size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет подписок</h3>
                    <p className="text-gray-600 mb-6">
                      Подпишитесь на людей, чтобы видеть их контент
                    </p>
                    <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                      Найти друзей
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {following.map((followed) => (
                      <UserCard key={followed.id} user={followed} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersFollowing;

