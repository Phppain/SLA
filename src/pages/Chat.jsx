import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchChatRooms, 
  fetchMessages, 
  sendMessage, 
  createChatRoom,
  setCurrentRoom,
  addMessage 
} from "../features/chat/chatSlice";
import { FiSend, FiUsers, FiMessageCircle, FiArrowLeft } from "react-icons/fi";

const Chat = () => {
  const dispatch = useDispatch();
  const { chatRooms, currentRoom, messages, loading, websocket } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);
  const [messageText, setMessageText] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRooms, setShowRooms] = useState(true);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchChatRooms());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedRoom) {
      dispatch(fetchMessages(selectedRoom.id));
    }
  }, [dispatch, selectedRoom]);

  useEffect(() => {
    // Подключение к WebSocket
    if (user && selectedRoom) {
      const token = localStorage.getItem("accessToken");
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${selectedRoom.id}/?token=${token}`);
      
      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        dispatch(addMessage(data));
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      wsRef.current = ws;

      return () => {
        ws.close();
      };
    }
  }, [user, selectedRoom, dispatch]);

  useEffect(() => {
    // Прокрутка к последнему сообщению
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedRoom && wsRef.current) {
      const messageData = {
        message: messageText,
        user_id: user.id
      };
      
      wsRef.current.send(JSON.stringify(messageData));
      setMessageText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setShowRooms(false);
    dispatch(setCurrentRoom(room));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FiMessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-600">Для доступа к чату необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      {/* Список чатов - мобильная версия */}
      <div className={`lg:block lg:w-80 border-r ${showRooms ? 'block w-full' : 'hidden'}`}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Сообщения</h2>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FiUsers size={32} className="mx-auto mb-2" />
              <p>Нет активных чатов</p>
            </div>
          ) : (
            chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomSelect(room)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedRoom?.id === room.id ? 'bg-pink-50 border-pink-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <FiUsers size={20} className="text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {room.participants
                          .filter(p => p.id !== user.id)
                          .map(p => p.username)
                          .join(', ')}
                      </h3>
                      {room.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {room.unread_count}
                        </span>
                      )}
                    </div>
                    {room.last_message && (
                      <p className="text-sm text-gray-500 truncate">
                        {room.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Чат - мобильная версия */}
      <div className={`flex-1 flex flex-col ${!showRooms ? 'block' : 'hidden lg:block'}`}>
        {selectedRoom ? (
          <>
            {/* Заголовок чата */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRooms(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <FiUsers size={20} className="text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedRoom.participants
                      .filter(p => p.id !== user.id)
                      .map(p => p.username)
                      .join(', ')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedRoom.participants.length} участников
                  </p>
                </div>
              </div>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === user.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === user.id ? 'text-pink-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите сообщение..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FiMessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Выберите чат</h2>
              <p className="text-gray-600">Начните общение с друзьями</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
