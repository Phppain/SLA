import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchChatRooms, 
  fetchMessages, 
  sendMessage, 
  createChatRoom,
  setCurrentRoom,
  addMessage,
  clearMessages,
  markChatNotificationsRead
} from "../features/chat/chatSlice";
import { markChatNotificationsRead as markChatNotificationsReadGlobal, fetchNotifications } from "../features/notifications/notificationsSlice";
import { FiSend, FiUsers, FiMessageCircle, FiArrowLeft } from "react-icons/fi";

const Chat = () => {
  const dispatch = useDispatch();
  const { chatRooms, currentRoom, messages, loading } = useSelector((state) => state.chat);
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

  // Обновляем список чатов при смене выбранной комнаты
  useEffect(() => {
    if (selectedRoom) {
      // Небольшая задержка чтобы дать время API обновиться
      const timer = setTimeout(() => {
        dispatch(fetchChatRooms());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedRoom, dispatch]);

  useEffect(() => {
    if (selectedRoom) {
      console.log("🔍 Fetching messages for room:", selectedRoom.id);
      dispatch(fetchMessages(selectedRoom.id)).then((result) => {
        if (result.payload) {
          console.log("📥 Received messages:", result.payload);
          console.log("📥 Messages count:", result.payload.length);
          if (result.payload.length > 0) {
            console.log("📥 First message:", result.payload[0]);
            console.log("📥 Message chat_rooms:", result.payload.map(m => m.chat_room));
          }
        }
      });
    }
  }, [dispatch, selectedRoom]);

  useEffect(() => {
    // Подключение к WebSocket
    if (user && selectedRoom) {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        console.error("No access token found");
        return;
      }

      const wsUrl = `ws://127.0.0.1:8000/ws/chat/${selectedRoom.id}/?token=${token}`;
      console.log("Connecting to WebSocket:", wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log("✅ WebSocket connected to room", selectedRoom.id);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Received message:", data);
          
          if (data.type === 'message' && data.message) {
            // Добавляем сообщение в стор только если оно из текущей комнаты
            dispatch(addMessage({
              id: data.message.id,
              content: data.message.content,
              sender: data.message.sender,
              created_at: data.message.created_at,
              chat_room: selectedRoom.id
            }));
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("🔌 WebSocket disconnected. Code:", event.code, "Reason:", event.reason);
        
        // Коды ошибок аутентификации
        if (event.code === 4001) {
          console.error("Authentication failed: No token provided");
        } else if (event.code === 4002) {
          console.error("Authentication failed: User not found");
        } else if (event.code === 4003) {
          console.error("Access denied: Not a participant of this chat");
        } else if (event.code === 4004) {
          console.error("Authentication failed: Invalid token");
        }
      };

      wsRef.current = ws;

      return () => {
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
          console.log("Closing WebSocket connection");
          ws.close();
        }
      };
    }
  }, [user, selectedRoom, dispatch]);

  useEffect(() => {
    // Прокрутка к последнему сообщению
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedRoom) return;

    // Пробуем отправить через WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        const messageData = {
          message: messageText.trim()
        };
        
        console.log("📤 Sending message via WebSocket:", messageData);
        wsRef.current.send(JSON.stringify(messageData));
        setMessageText("");
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
      }
    } else {
      // Fallback: отправляем через HTTP API если WebSocket не работает
      console.log("📤 WebSocket not connected, using HTTP fallback");
      try {
        await dispatch(sendMessage({
          roomId: selectedRoom.id,
          content: messageText.trim()
        }));
        setMessageText("");
        // Обновляем сообщения после отправки
        setTimeout(() => {
          dispatch(fetchMessages(selectedRoom.id));
        }, 100);
      } catch (error) {
        console.error("Ошибка при отправке сообщения через HTTP:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRoomSelect = async (room) => {
    console.log("🏠 Selecting room:", room);
    // Очищаем сообщения при смене чата
    dispatch(clearMessages());
    // Устанавливаем текущую комнату в store
    dispatch(setCurrentRoom(room));
    setSelectedRoom(room);
    setShowRooms(false);
    
    // Отмечаем уведомления этого чата как прочитанные
    try {
      console.log("🔔 Attempting to mark notifications as read for chat:", room.id);
      const result = await dispatch(markChatNotificationsRead(room.id)).unwrap();
      console.log("🔔 Backend result:", result);
      
      // Обновляем локальное состояние уведомлений
      dispatch(markChatNotificationsReadGlobal(room.id));
      
      // Принудительно обновляем список чатов и уведомлений
      await dispatch(fetchChatRooms()).unwrap();
      await dispatch(fetchNotifications()).unwrap();
      
      // Дополнительно обновляем уведомления через небольшой таймаут
      setTimeout(() => {
        dispatch(fetchNotifications());
      }, 100);
      
      console.log("✅ Chat notifications marked as read and rooms refreshed");
    } catch (error) {
      console.error("❌ Error marking notifications as read:", error);
    }
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
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => {
                // Получаем ID из localStorage если user не определен
                const senderId = message.sender?.id;
                let userId = user?.id;
                
                if (!userId) {
                  // Пробуем получить ID из токена
                  const token = localStorage.getItem('accessToken');
                  if (token) {
                    try {
                      const payload = JSON.parse(atob(token.split('.')[1]));
                      userId = payload.user_id;
                    } catch (e) {
                      console.error('Error parsing token:', e);
                    }
                  }
                }
                
                const isMyMessage = senderId === userId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                        isMyMessage
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-200 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isMyMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
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
