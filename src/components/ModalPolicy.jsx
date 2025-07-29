import { useDispatch } from "react-redux";
import { acceptPolicy } from "../features/auth/authSlice";

export default function ModalPolicy() {
  const dispatch = useDispatch();

  const handleAccept = () => {
    dispatch(acceptPolicy());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[1000] flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-[90%]">
        <h2 className="text-2xl font-semibold mb-4 text-center text-pink-600">Политика конфиденциальности</h2>
        <p className="text-sm text-gray-700 mb-6 text-justify leading-relaxed">
          Мы используем данные только для улучшения качества сервиса. Нажимая «Принять», вы соглашаетесь
          с нашей политикой конфиденциальности. Без согласия доступ к функционалу сайта ограничен.
        </p>
        <div className="flex justify-center">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full transition"
            onClick={handleAccept}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
