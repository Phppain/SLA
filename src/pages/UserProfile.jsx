
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const { username } = useParams();
  const pins = useSelector((state) => state.pins.pins);
  const userPins = pins.filter((pin) => pin.username === username);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Профиль пользователя: {username}</h1>
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
        <p className="text-sm text-gray-500">У пользователя нет пинов.</p>
      )}
    </div>
  );
}
