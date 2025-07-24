import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPin } from "../features/pins/pinSlice";
import { useNavigate } from "react-router-dom";

const categories = [
  "art",
  "beauty",
  "fitness",
  "fashion",
  "travel",
  "food",
  "gaming",
  "cars",
];

export default function CreatePin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((state) => state.auth.user?.username || "anon");

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !image || !category) return;
    dispatch(addPin(title, image, username, category));
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Создать новый пин</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Ссылка на изображение"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border rounded px-4 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-4 py-2"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Создать
        </button>
      </form>
    </div>
  );
}
