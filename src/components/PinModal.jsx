import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  toggleLike,
  deletePin,
} from "../features/pins/pinSlice";
import { addComment, fetchComments } from "../features/interactions/likeCommentSlice";
import {
  FiHeart,
  FiMessageCircle,
  FiEdit,
  FiTrash,
  FiX,
  FiSend,
  FiBookmark,
  FiShare2,
} from "react-icons/fi";

const PinModal = ({ pinId, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pin = useSelector((state) =>
    state.pins.pins.find((p) => p.id === pinId)
  );
  const currentUser = useSelector((state) => state.auth.user);
  const { comments, loading } = useSelector((state) => state.interactions);

  const [commentText, setCommentText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Показываем модалку + добавляем закрытие по Escape + загружаем комментарии
  useEffect(() => {
    const showTimeout = setTimeout(() => setIsVisible(true), 10);

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);

    // Загружаем комментарии при открытии модалки
    if (pinId) {
      dispatch(fetchComments(pinId));
    }

    return () => {
      clearTimeout(showTimeout);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [pinId, dispatch]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!pin || !currentUser) return null;

  const handleToggleLike = (e) => {
    e.stopPropagation();
    dispatch(toggleLike(pin.id));
  };

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить этот пин?")) {
      dispatch(deletePin(pin.id));
      handleClose();
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${pin.id}`);
    handleClose();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      try {
        await dispatch(addComment({ pinId: pin.id, content: commentText })).unwrap();
        setCommentText("");
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pin.title,
        text: pin.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Ссылка скопирована в буфер обмена!");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden flex flex-col md:flex-row relative transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
        >
          <FiX size={20} />
        </button>

        <div className="md:w-1/2 w-full relative">
          <img
            src={pin.image}
            alt={pin.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 md:w-1/2 w-full flex flex-col justify-between max-h-screen overflow-y-auto">
          <div className="flex-1">
            {/* Заголовок и описание */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{pin.title}</h2>
              <p className="text-gray-600 mb-2">{pin.description}</p>
              {pin.category && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {pin.category}
                </span>
              )}
            </div>

            {/* Автор */}
            {pin.author && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-pink-600">
                    {pin.author.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{pin.author.username}</p>
                  <p className="text-sm text-gray-500">
                    {formatTime(pin.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* Действия */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  pin.is_liked 
                    ? "text-red-600 bg-red-50" 
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                <FiHeart className={pin.is_liked ? "fill-current" : ""} />
                <span>{pin.likes_count || 0}</span>
              </button>
              
              <div className="flex items-center gap-2 text-gray-600">
                <FiMessageCircle />
                <span>{pin.comments_count || 0}</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
              >
                <FiShare2 />
                <span>Поделиться</span>
              </button>

              {currentUser.id === pin.author?.id && (
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    <FiEdit />
                    <span>Редактировать</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 rounded-lg transition-colors"
                  >
                    <FiTrash />
                    <span>Удалить</span>
                  </button>
                </div>
              )}
            </div>

            {/* Комментарии */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Комментарии</h3>
              
              <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                {loading ? (
                  <p className="text-gray-500 text-center py-4">Загрузка комментариев...</p>
                ) : comments?.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-pink-600">
                          {comment.author?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-sm text-gray-900">
                            {comment.author?.username}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {comment.content}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(comment.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Пока нет комментариев. Будьте первым!
                  </p>
                )}
              </div>

              {/* Форма комментария */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Оставить комментарий..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                >
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
