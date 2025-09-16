
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPin } from "../features/pins/pinSlice";

const CreatePin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [category, setCategory] = useState("искусство");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageURL || !user) return;

    setLoading(true);
    
    try {
      const pinData = {
        title,
        description,
        image: imageURL,
        category,
        content: description || title
      };

      await dispatch(createPin(pinData)).unwrap();
      navigate("/pins");
    } catch (error) {
      console.error("Ошибка при создании пина:", error);
      alert("Ошибка при создании пина. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-600">Для создания пинов необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Создать новый пин</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Превью */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Превью</h3>
            <div className="relative">
              <img
                src={imageURL || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"}
                alt="Превью"
                className="rounded-lg w-full object-cover h-64 border-2 border-gray-200"
              />
              {!imageURL && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Добавьте ссылку на изображение</p>
                </div>
              )}
            </div>
            <input
              type="url"
              placeholder="Ссылка на изображение (URL)"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Вставьте прямую ссылку на изображение (например, с Unsplash)
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название пина *
              </label>
              <input
                type="text"
                placeholder="Введите название пина"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                placeholder="Расскажите о вашем пине..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="искусство">Искусство</option>
                <option value="дизайн">Дизайн</option>
                <option value="еда">Еда</option>
                <option value="путешествия">Путешествия</option>
                <option value="мода">Мода</option>
                <option value="технологии">Технологии</option>
                <option value="спорт">Спорт</option>
                <option value="природа">Природа</option>
                <option value="архитектура">Архитектура</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !title || !imageURL}
              className="bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Создание..." : "Создать пин"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
