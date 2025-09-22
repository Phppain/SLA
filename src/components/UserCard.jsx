import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toggleFollow } from "../features/users/userSlice";
import { createChatRoom } from "../features/chat/chatSlice";
import { FiUser, FiUserPlus, FiUserCheck, FiMessageCircle, FiHeart, FiUsers } from "react-icons/fi";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const isSelf = currentUser?.id === user.id;

  const handleToggleFollow = async () => {
    if (!currentUser) return;
    
    try {
      await dispatch(toggleFollow(user.username)).unwrap();
    } catch (error) {
      console.error("Ошибка при подписке/отписке:", error);
    }
  };

  const handleStartChat = async () => {
    if (!currentUser) return;
    
    try {
      console.log("Создаем чат с пользователем:", user);
      console.log("Текущий пользователь:", currentUser);
      
      // Создаем чат-комнату с участниками: текущий пользователь и выбранный пользователь
      const chatRoom = await dispatch(createChatRoom([currentUser.id, user.id])).unwrap();
      console.log("Чат создан:", chatRoom);
      
      // Перенаправляем в чат
      navigate('/chat');
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
      // Попробуем просто перейти в чат, если чат уже существует
      navigate('/chat');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Аватар и основная информация */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <FiUser size={24} className="text-pink-600" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link 
              to={`/user/${user.username}`}
              className="block hover:text-pink-600 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {user.username}
              </h3>
            </Link>
            
            {user.first_name && (
              <p className="text-sm text-gray-600 truncate">
                {user.first_name}
              </p>
            )}
            
            {user.bio && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {user.posts_count || 0}
            </div>
            <div className="text-xs text-gray-500">Пинов</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {user.followers_count || 0}
            </div>
            <div className="text-xs text-gray-500">Подписчиков</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {user.following_count || 0}
            </div>
            <div className="text-xs text-gray-500">Подписок</div>
          </div>
        </div>

        {/* Действия */}
        {!isSelf && currentUser && (
          <div className="flex gap-2">
            <button
              onClick={handleToggleFollow}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Начать чат"
            >
              <FiMessageCircle size={16} />
            </button>
          </div>
        )}

        {/* Индикатор подписки */}
        {user.is_following && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
            <FiUserCheck size={14} />
            <span>Вы подписаны</span>
          </div>
        )}

        {/* Дополнительная информация */}
        {user.location && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <FiUsers size={14} />
            <span>{user.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
