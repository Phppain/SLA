import React, { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Сброс пароля
        </h2>

        {submitted ? (
          <div className="text-center text-green-600 text-lg font-medium">
            Если такой email существует, мы отправим инструкцию на почту.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Введите ваш email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Сбросить пароль
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Вернуться на{" "}
          <a
            href="/"
            className="text-pink-600 hover:underline font-medium"
          >
            главную
          </a>
        </div>
      </div>
    </div>
  );
}
