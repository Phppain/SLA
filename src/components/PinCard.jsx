import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLike, toggleSave } from "../features/pins/pinSlice";
import { openPinModal } from "../features/modal/modalSlice";
import { FiHeart, FiBookmark, FiShare2, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";

const PinCard = ({ pin }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (user) {
      dispatch(toggleLike(pin.id));
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (user) {
      dispatch(toggleSave(pin.id));
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: pin.title || 'Пин',
        text: pin.description || pin.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Можно добавить уведомление о копировании
    }
  };

  const handlePinClick = () => {
    dispatch(openPinModal(pin.id));
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handlePinClick}
    >
      {/* Изображение */}
      <div className="relative w-full aspect-square overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm">Изображение недоступно</p>
            </div>
          </div>
        ) : (
          <img
            src={pin.image}
            alt={pin.title || 'Пин'}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Overlay с действиями */}
        <div className={`absolute inset-0 bg-black transition-all duration-300 ${
          showActions ? 'bg-opacity-20' : 'bg-opacity-0'
        }`}>
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            showActions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            {/* Кнопка сохранения */}
            {user && (
              <button
                onClick={handleSave}
                className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                  pin.is_saved 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                title={pin.is_saved ? 'Удалить из сохраненных' : 'Сохранить'}
              >
                <FiBookmark size={20} className={pin.is_saved ? 'fill-current' : ''} />
              </button>
            )}

            {/* Кнопка поделиться */}
            <button
              onClick={handleShare}
              className="p-3 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
              title="Поделиться"
            >
              <FiShare2 size={20} />
            </button>

            {/* Кнопка "Еще" */}
            <button
              className="p-3 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
              title="Еще"
            >
              <FiMoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Информация о пине */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
          {pin.title || 'Без названия'}
        </h3>
        
        {pin.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {pin.description}
          </p>
        )}

        {/* Автор */}
        {pin.author && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
              {pin.author.avatar ? (
                <img 
                  src={pin.author.avatar} 
                  alt={pin.author.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-pink-600">
                  {pin.author.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-600">{pin.author.username}</span>
          </div>
        )}

        {/* Статистика */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>❤️ {pin.likes_count || 0}</span>
            <span>💬 {pin.comments_count || 0}</span>
            <span>📌 {pin.saves_count || 0}</span>
          </div>
          
          {/* Кнопка лайка */}
          {user && (
            <button
              onClick={handleLike}
              className={`p-1 rounded-full transition-colors ${
                pin.is_liked 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <FiHeart size={16} className={pin.is_liked ? 'fill-current' : ''} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinCard;
