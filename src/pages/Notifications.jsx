import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchNotifications, 
  markAllAsRead, 
  markAsRead
} from "../features/notifications/notificationsSlice";
import { FiBell, FiHeart, FiMessageCircle, FiUserPlus, FiAtSign, FiCheck } from "react-icons/fi";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, unreadCount } = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleMarkRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FiHeart className="text-red-500" />;
      case 'comment':
        return <FiMessageCircle className="text-blue-500" />;
      case 'follow':
        return <FiUserPlus className="text-green-500" />;
      case 'mention':
        return <FiAtSign className="text-purple-500" />;
      case 'message':
        return <FiMessageCircle className="text-indigo-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const getNotificationText = (type) => {
    switch (type) {
      case 'like':
        return 'лайкнул ваш пин';
      case 'comment':
        return 'прокомментировал ваш пин';
      case 'follow':
        return 'подписался на вас';
      case 'mention':
        return 'упомянул вас в комментарии';
      case 'message':
        return 'отправил вам сообщение';
      default:
        return 'взаимодействовал с вашим контентом';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FiBell size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-600">Для просмотра уведомлений необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Уведомления</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Все уведомления прочитаны'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Отметить все как прочитанные
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Список уведомлений */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <FiBell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет уведомлений</h3>
            <p className="text-gray-600">Когда появятся новые уведомления, они отобразятся здесь</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg p-4 shadow-sm border-l-4 transition-all duration-200 ${
                  notification.is_read 
                    ? 'border-gray-200 opacity-75' 
                    : 'border-pink-500 bg-pink-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Аватар отправителя */}
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {notification.sender.avatar ? (
                      <img 
                        src={notification.sender.avatar} 
                        alt={notification.sender.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-pink-600">
                        {notification.sender.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Содержимое уведомления */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{notification.sender.username}</span>
                          {' '}
                          {getNotificationText(notification.notification_type)}
                        </p>
                        {notification.content && (
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.content}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>

                      {/* Иконка типа уведомления */}
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        
                        {/* Кнопка отметки как прочитанное */}
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Отметить как прочитанное"
                          >
                            <FiCheck size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

