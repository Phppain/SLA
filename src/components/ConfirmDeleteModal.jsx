// src/components/ConfirmDeleteModal.jsx
import React from "react";

export default function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          Удалить аккаунт?
        </h2>
        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
