import { useState } from "react";

export default function ModalComment({ onClose, pin }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(pin.comments || []);

  const handleAdd = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-md">
        <h3 className="font-bold mb-2">Комментарии</h3>
        <div className="max-h-40 overflow-y-auto mb-2">
          {comments.map((c, i) => <p key={i} className="text-sm border-b py-1">{c}</p>)}
        </div>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          placeholder="Добавить комментарий"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-sm text-gray-500">Закрыть</button>
          <button onClick={handleAdd} className="text-sm text-blue-500">Отправить</button>
        </div>
      </div>
    </div>
  );
}