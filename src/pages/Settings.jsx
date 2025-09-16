import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiShield, FiHelpCircle, FiUser, FiBell, FiLock, FiTrash, FiDownload, FiMoon, FiSun } from "react-icons/fi";

const Settings = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  const user = useSelector((state) => state.auth.user);

  const settingsSections = [
    {
      title: "Профиль",
      icon: FiUser,
      items: [
        {
          label: "Редактировать профиль",
          description: "Изменить имя, аватар, био",
          action: () => console.log("Редактировать профиль"),
        },
        {
          label: "Изменить пароль",
          description: "Обновить пароль аккаунта",
          action: () => console.log("Изменить пароль"),
        },
      ],
    },
    {
      title: "Конфиденциальность",
      icon: FiShield,
      items: [
        {
          label: "Политика конфиденциальности",
          description: "Как мы используем ваши данные",
          action: () => setShowPrivacyModal(true),
        },
        {
          label: "Настройки приватности",
          description: "Управление видимостью профиля",
          action: () => console.log("Настройки приватности"),
        },
      ],
    },
    {
      title: "Уведомления",
      icon: FiBell,
      items: [
        {
          label: "Push-уведомления",
          description: "Уведомления в браузере",
          action: () => setNotifications(!notifications),
          toggle: true,
          value: notifications,
        },
        {
          label: "Email-уведомления",
          description: "Уведомления на почту",
          action: () => setEmailNotifications(!emailNotifications),
          toggle: true,
          value: emailNotifications,
        },
      ],
    },
    {
      title: "Поддержка",
      icon: FiHelpCircle,
      items: [
        {
          label: "Связаться с поддержкой",
          description: "Получить помощь",
          action: () => setShowSupportModal(true),
        },
        {
          label: "Экспорт данных",
          description: "Скачать ваши данные",
          action: () => console.log("Экспорт данных"),
        },
      ],
    },
    {
      title: "Аккаунт",
      icon: FiLock,
      items: [
        {
          label: "Удалить аккаунт",
          description: "Безвозвратно удалить аккаунт",
          action: () => console.log("Удалить аккаунт"),
          danger: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="text-gray-600 mt-2">
            Управляйте настройками вашего аккаунта
          </p>
        </div>

        {/* Переключатель темной темы */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <FiMoon className="text-gray-600" /> : <FiSun className="text-gray-600" />}
              <div>
                <h3 className="font-medium text-gray-900">Темная тема</h3>
                <p className="text-sm text-gray-600">Переключить темный режим</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-pink-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Секции настроек */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <section.icon className="text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${item.danger ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.toggle ? (
                          <button
                            onClick={item.action}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              item.value ? 'bg-pink-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                item.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        ) : (
                          <button
                            onClick={item.action}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              item.danger
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-pink-600 hover:bg-pink-50'
                            }`}
                          >
                            {item.danger ? 'Удалить' : 'Изменить'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Информация о версии */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Версия 1.0.0</p>
          <p className="mt-1">© 2024 SLA. Все права защищены.</p>
        </div>
      </div>

      {/* Модальное окно политики конфиденциальности */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FiShield className="text-pink-600" />
                Политика конфиденциальности
              </h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-4">
              <p>
                Добро пожаловать в SLA! Мы ценим вашу конфиденциальность и стремимся защищать ваши личные данные.
              </p>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Какие данные мы собираем:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Информация профиля (имя пользователя, email, аватар)</li>
                  <li>Контент, который вы создаете (пины, комментарии)</li>
                  <li>Данные об использовании сервиса</li>
                  <li>Техническая информация (IP-адрес, тип браузера)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Как мы используем ваши данные:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Для предоставления и улучшения наших услуг</li>
                  <li>Для персонализации контента</li>
                  <li>Для обеспечения безопасности аккаунта</li>
                  <li>Для связи с вами по важным вопросам</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ваши права:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Просматривать и редактировать свои данные</li>
                  <li>Удалить аккаунт в любое время</li>
                  <li>Отписаться от уведомлений</li>
                  <li>Обратиться к нам с вопросами о конфиденциальности</li>
                </ul>
              </div>
              <p>
                Продолжая использовать SLA, вы соглашаетесь с нашей политикой конфиденциальности и условиями использования.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно поддержки */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FiHelpCircle className="text-pink-600" />
                Поддержка
              </h2>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-4">
              <p>
                Нужна помощь? Мы здесь, чтобы помочь вам!
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiHelpCircle className="text-pink-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email поддержки</p>
                    <p className="text-sm text-gray-600">support@sla.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiHelpCircle className="text-pink-600" />
                  <div>
                    <p className="font-medium text-gray-900">Время работы</p>
                    <p className="text-sm text-gray-600">Пн-Пт, 9:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiHelpCircle className="text-pink-600" />
                  <div>
                    <p className="font-medium text-gray-900">FAQ</p>
                    <p className="text-sm text-gray-600">Часто задаваемые вопросы</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

