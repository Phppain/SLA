import React, { useState } from "react";
import { useSelector } from "react-redux";

const Chat = () => {
  const authUser = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;
    setMessages([...messages, { from: authUser.id, text }]);
    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Чат</h2>

      <div className="flex flex-col gap-2 mb-4 max-h-[300px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.from === authUser.id
                ? "bg-green-200 text-right ml-auto max-w-xs"
                : "bg-white text-left mr-auto max-w-xs"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Напиши сообщение..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;
