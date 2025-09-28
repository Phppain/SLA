
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, toggleFollow } from "../features/users/userSlice";
import { fetchPins, fetchUserPins } from "../features/pins/pinSlice";
import { openPinModal } from "../features/modal/modalSlice";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";
import { FiUser, FiMapPin, FiGlobe, FiHeart, FiMessageCircle, FiUsers, FiUserPlus, FiUserCheck, FiMessageCircle as FiChat } from "react-icons/fi";

const UserProfile = () => {
  console.log("🔍 UserProfile component START");
  
  const { username } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { users } = useSelector((state) => state.users);
  const { pins } = useSelector((state) => state.pins);
  
  const [activeTab, setActiveTab] = useState("pins"); // pins, saved, followers, following
  
  console.log("🔍 UserProfile component loaded", { username, currentUser, users: users.length, pins: pins.length });
  
  const user = users.find(u => u.username === username);
  const userPins = pins.filter((pin) => pin.author?.username === username);
  const isSelf = currentUser?.id === user?.id;

  useEffect(() => {
    console.log("🔍 UserProfile useEffect triggered", { currentUser, username });
    console.log("🔍 Dispatching fetchUsers");
    dispatch(fetchUsers());
    console.log("🔍 Dispatching fetchPins");
    dispatch(fetchPins());
  }, [dispatch, username]);

  const handleToggleFollow = async () => {
    if (!currentUser || !user) return;
    
    try {
      await dispatch(toggleFollow(user.username)).unwrap();
    } catch (error) {
      console.error("Ошибка при подписке/отписке:", error);
    }
  };

  const handleStartChat = () => {
    // Здесь можно добавить логику для начала чата
    console.log("Начать чат с", user?.username);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUser size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Пользователь не найден</h2>
          <p className="text-gray-600">Пользователь с таким именем не существует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок профиля */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Аватар */}
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <FiUser size={48} className="text-pink-600" />
              )}
            </div>

            {/* Информация о пользователе */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.first_name || user.username}
                  </h1>
                  <p className="text-gray-500">@{user.username}</p>
                </div>

                {/* Действия */}
                {!isSelf && currentUser && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleToggleFollow}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                        user.is_following
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-pink-600 text-white hover:bg-pink-700"
                      }`}
                    >
                      {user.is_following ? (
                        <>
                          <FiUserCheck size={16} />
                          Отписаться
                        </>
                      ) : (
                        <>
                          <FiUserPlus size={16} />
                          Подписаться
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleStartChat}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiChat size={16} />
                      Сообщение
                    </button>
                  </div>
                )}
              </div>

              {/* Био */}
              {user.bio && (
                <p className="text-gray-600 mb-4 max-w-2xl">
                  {user.bio}
                </p>
              )}

              {/* Дополнительная информация */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <FiMapPin size={14} />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700"
                  >
                    <FiGlobe size={14} />
                    <span>{user.website}</span>
                  </a>
                )}
              </div>

              {/* Статистика */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <FiHeart size={16} className="text-gray-400" />
                  <span className="font-medium">{user.posts_count || 0}</span>
                  <span className="text-gray-500">пинов</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiUsers size={16} className="text-gray-400" />
                  <span className="font-medium">{user.followers_count || 0}</span>
                  <span className="text-gray-500">подписчиков</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiUsers size={16} className="text-gray-400" />
                  <span className="font-medium">{user.following_count || 0}</span>
                  <span className="text-gray-500">подписок</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("pins")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "pins"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Пины
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "saved"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Сохраненные
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "followers"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Подписчики
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "following"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Подписки
            </button>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "pins" && (
          <div>
            {userPins.length > 0 ? (
              <Masonry
                breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {userPins.map((pin) => (
                  <div
                    key={pin.id}
                    onClick={() => dispatch(openPinModal(pin.id))}
                    className="cursor-pointer"
                  >
                    <PinCard pin={pin} />
                  </div>
                ))}
              </Masonry>
            ) : (
              <div className="text-center py-12">
                <FiHeart size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isSelf ? "У вас пока нет пинов" : "У пользователя пока нет пинов"}
                </h3>
                <p className="text-gray-600">
                  {isSelf ? "Создайте свой первый пин!" : "Пины появятся здесь, когда пользователь их создаст"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="text-center py-12">
            <FiHeart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Сохраненные пины</h3>
            <p className="text-gray-600">Здесь будут отображаться сохраненные пины</p>
          </div>
        )}

        {activeTab === "followers" && (
          <div className="text-center py-12">
            <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Подписчики</h3>
            <p className="text-gray-600">Здесь будут отображаться подписчики пользователя</p>
          </div>
        )}

        {activeTab === "following" && (
          <div className="text-center py-12">
            <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Подписки</h3>
            <p className="text-gray-600">Здесь будут отображаться подписки пользователя</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
