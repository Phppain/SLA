// src/components/ModalPolicy.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { acceptPolicyAPI } from "../features/auth/authSlice";

const ModalPolicy = () => {
  const dispatch = useDispatch();

  const handleAccept = () => {
    dispatch(acceptPolicyAPI());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Политика конфиденциальности</h2>
        <div className="text-sm text-gray-600 mb-6 space-y-3 max-h-60 overflow-y-auto">
          <p>
            Добро пожаловать в SLA! Мы ценим вашу конфиденциальность и стремимся защищать ваши личные данные.
          </p>
          <p>
            <strong>Какие данные мы собираем:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Информация профиля (имя пользователя, email, аватар)</li>
            <li>Контент, который вы создаете (пины, комментарии)</li>
            <li>Данные об использовании сервиса</li>
            <li>Техническая информация (IP-адрес, тип браузера)</li>
          </ul>
          <p>
            <strong>Как мы используем ваши данные:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Для предоставления и улучшения наших услуг</li>
            <li>Для персонализации контента</li>
            <li>Для обеспечения безопасности аккаунта</li>
            <li>Для связи с вами по важным вопросам</li>
          </ul>
          <p>
            <strong>Ваши права:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Просматривать и редактировать свои данные</li>
            <li>Удалить аккаунт в любое время</li>
            <li>Отписаться от уведомлений</li>
            <li>Обратиться к нам с вопросами о конфиденциальности</li>
          </ul>
          <p>
            Продолжая использовать SLA, вы соглашаетесь с нашей политикой конфиденциальности и условиями использования.
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAccept}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Принять и продолжить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPolicy;
