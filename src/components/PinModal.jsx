import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleLike,
  deletePin,
  addComment,
  editComment,
  deleteComment,
} from "../features/pins/pinSlice";
import {
  FiHeart,
  FiMessageCircle,
  FiEdit,
  FiTrash,
  FiX,
  FiSend,
} from "react-icons/fi";

const PinModal = ({ pinId, onClose }) => {
  const dispatch = useDispatch();
  const pin = useSelector((state) =>
    state.pins.pins.find((p) => p.id === pinId)
  );
  const currentUser = useSelector((state) => state.auth.user);

  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Показываем модалку + добавляем закрытие по Escape
  useEffect(() => {
    const showTimeout = setTimeout(() => setIsVisible(true), 10);

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);

    return () => {
      clearTimeout(showTimeout);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!pin || !currentUser) return null;

  const hasLiked = Array.isArray(pin.likes) && pin.likes.includes(currentUser.id);

  const handleToggleLike = () =>
    dispatch(toggleLike({ pinId: pin.id, userId: currentUser.id }));

  const handleDelete = () => {
    dispatch(deletePin(pin.id));
    handleClose();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      dispatch(
        addComment({
          id: pin.id,
          comment: {
            text: commentText,
            userId: currentUser.id,
            userName: currentUser.name || currentUser.username,
          },
        })
      );
      setCommentText("");
    }
  };

  const handleEditComment = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditingText(text);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingText.trim()) {
      dispatch(
        editComment({
          pinId: pin.id,
          commentId: editingCommentId,
          newText: editingText,
        })
      );
      setEditingCommentId(null);
      setEditingText("");
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({ pinId: pin.id, commentId }));
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
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FiX size={24} />
        </button>

        <div className="md:w-1/2 w-full">
          <img
            src={pin.image}
            alt={pin.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 md:w-1/2 w-full flex flex-col justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{pin.title}</h2>
            <p className="text-gray-600 mb-4">{pin.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1 ${
                  hasLiked ? "text-pink-600" : "text-gray-500"
                } hover:text-pink-800 transition`}
              >
                <FiHeart /> {pin.likes.length}
              </button>
              <div className="flex items-center gap-1 text-blue-600">
                <FiMessageCircle /> {pin.comments?.length || 0}
              </div>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
                title="Удалить пин"
              >
                <FiTrash />
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto mb-2 space-y-2 pr-1">
              {pin.comments?.map((c) => (
                <div
                  key={c.id}
                  className="text-sm text-gray-700 border-b py-1 flex justify-between items-start"
                >
                  {editingCommentId === c.id ? (
                    <form
                      onSubmit={handleEditSubmit}
                      className="w-full flex items-center gap-2"
                    >
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        type="submit"
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiSend />
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-medium text-pink-600">{c.userName}</span>
                      <span>{c.text}</span>
                    </div>
                  )}
                  {c.userId === currentUser.id && editingCommentId !== c.id && (
                    <div className="flex gap-2 pl-2">
                      <button
                        onClick={() => handleEditComment(c.id, c.text)}
                        className="text-yellow-600"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-red-600"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Оставить комментарий..."
                className="flex-1 px-3 py-2 border rounded-full text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 text-sm"
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
