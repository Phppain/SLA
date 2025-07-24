import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePin, editPin } from "../features/pins/pinSlice";

const PinModal = ({ pin, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pin.title);
  const [image, setImage] = useState(pin.image);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleDelete = () => {
    dispatch(deletePin(pin.id));
    onClose();
  };

  const handleEdit = () => {
    dispatch(editPin({ id: pin.id, title, image }));
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (comment.trim() !== "") {
      setComments([...comments, { user: user?.username, text: comment }]);
      setComment("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Сохранить
            </button>
          </div>
        ) : (
          <>
            <img
              src={pin.image}
              alt={pin.title}
              className="max-h-[400px] w-full object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{pin.title}</h2>
            <p className="text-sm text-gray-600 mb-4">
              Автор: {pin.username || "неизвестен"}
            </p>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
              >
                ✏️ Редактировать
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                🗑 Удалить
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">💬 Комментарии</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
                {comments.length === 0 && (
                  <p className="text-sm text-gray-400">Пока нет комментариев</p>
                )}
                {comments.map((c, i) => (
                  <div key={i} className="text-sm border-b pb-1">
                    <strong>{c.user || "Гость"}:</strong> {c.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Оставьте комментарий..."
                  className="flex-1 border px-3 py-2 rounded"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  ➕
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PinModal;