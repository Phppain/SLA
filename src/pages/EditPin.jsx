
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editPin } from "../features/pins/pinSlice";
import { useLocation, useNavigate } from "react-router-dom";

const EditPin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: pin } = useLocation();

  const [title, setTitle] = useState(pin?.title || "");
  const [image, setImage] = useState(pin?.image || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editPin({ id: pin.id, title, image }));
    navigate("/");
  };

  if (!pin) return <p className="text-center mt-10 text-red-500">Пин не найден</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Редактировать пин</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Ссылка на изображение"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
};

export default EditPin;
