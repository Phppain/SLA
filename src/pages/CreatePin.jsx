
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPin } from "../features/pins/pinSlice";
import { v4 as uuidv4 } from "uuid";

const CreatePin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [category, setCategory] = useState("Искусство");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !imageURL) return;

    const newPin = {
      id: uuidv4(),
      title,
      description,
      image: imageURL,
      category,
      likes: 0,
      comments: [],
    };

    dispatch(addPin(newPin));
    navigate("/pins");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mt-8 grid md:grid-cols-2 gap-6">
      {/* Превью */}
      <div>
        <img
          src={imageURL || "https://via.placeholder.com/400x300?text=Превью"}
          alt="Превью"
          className="rounded-lg w-full object-cover h-64 border"
        />
        <input
          type="text"
          placeholder="Ссылка на изображение"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          className="mt-4 w-full p-2 border rounded"
        />
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Название пина"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option>Искусство</option>
          <option>Красота</option>
          <option>Фитнес</option>
          <option>Мода</option>
          <option>Путешествия</option>
          <option>Еда</option>
          <option>Игры</option>
          <option>Автомобили</option>
        </select>
        <button
          type="submit"
          className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition"
        >
          Создать пин
        </button>
      </form>
    </div>
  );
};

export default CreatePin;
