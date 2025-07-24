
import { useSelector, useDispatch } from "react-redux";
import { removeFriend } from "../features/friends/friendsSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const pins = useSelector((state) => state.pins.pins);
  const friends = useSelector((state) => state.friends.list);
  const dispatch = useDispatch();

  const userPins = pins.filter((pin) => pin.username === user?.username);

  const handleRemove = (friend) => {
    dispatch(removeFriend(friend));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Профиль: {user?.username}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Мои друзья:</h2>
        {friends.length > 0 ? (
          <ul className="space-y-2">
            {friends.map((f) => (
              <li key={f} className="flex justify-between items-center border px-4 py-2 rounded">
                <Link to={`/user/${f}`} className="text-blue-500 hover:underline">{f}</Link>
                <button
                  onClick={() => handleRemove(f)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">У вас пока нет друзей.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Мои пины:</h2>
        {userPins.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userPins.map((pin) => (
              <div key={pin.id} className="border rounded p-2">
                <img src={pin.image} alt={pin.title} className="w-full h-48 object-cover rounded" />
                <p className="mt-2 text-sm font-medium">{pin.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">У вас пока нет пинов.</p>
        )}
      </div>
    </div>
  );
}
