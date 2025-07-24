
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriend } from "../features/friends/friendsSlice";

const mockUsers = ["demo", "admin", "newuser", "jane", "jack", "maria"];

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends.list);
  const currentUser = useSelector((state) => state.auth.user);

  const filtered = mockUsers.filter(
    (user) =>
      user !== currentUser?.username &&
      user.toLowerCase().includes(query.toLowerCase()) &&
      !friends.includes(user)
  );

  const handleAdd = (username) => {
    dispatch(addFriend(username));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Найти друзей</h2>
      <input
        type="text"
        placeholder="Поиск по имени"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-4"
      />
      <ul className="space-y-2">
        {filtered.map((user) => (
          <li key={user} className="flex justify-between items-center border px-4 py-2 rounded">
            <span>{user}</span>
            <button
              onClick={() => handleAdd(user)}
              className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Добавить
            </button>
          </li>
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-500">Никого не найдено</p>}
      </ul>
    </div>
  );
}
