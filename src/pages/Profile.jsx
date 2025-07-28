
import { useSelector, useDispatch } from "react-redux";
import { removeFriend } from "../features/friends/friendsSlice";
import { Link } from "react-router-dom";
import { FiTrash, FiUser } from "react-icons/fi";

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
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center text-3xl text-white font-bold">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <div className="text-sm text-gray-500 mt-1">
            {userPins.length} пинов · {friends.length} друзей
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Мои друзья</h2>
        {friends.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.map((f) => (
              <div key={f} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                <Link to={`/user/${f}`} className="text-blue-600 hover:underline flex items-center gap-2">
                  <FiUser /> {f}
                </Link>
                <button
                  onClick={() => handleRemove(f)}
                  className="text-red-500 hover:text-red-700"
                  title="Удалить друга"
                >
                  <FiTrash />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">У вас пока нет друзей.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Мои пины</h2>
        {userPins.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userPins.map((pin) => (
              <div key={pin.id} className="bg-white shadow rounded-lg overflow-hidden">
                <img
                  src={pin.image}
                  alt={pin.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                />
                <div className="p-2 text-sm font-medium">{pin.title}</div>
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
