import { useDispatch } from "react-redux";
import { acceptPolicy } from "../features/auth/authSlice";

export default function ModalPolicy() {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Политика конфиденциальности</h2>
        <p className="text-sm text-gray-700 mb-4">
          Мы используем данные только для улучшения сервиса. Продолжая, вы соглашаетесь с нашей политикой.
        </p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => dispatch(acceptPolicy())}
        >
          Принять
        </button>
      </div>
    </div>
  );
}
