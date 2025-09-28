import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addNotification, fetchNotifications } from "../features/notifications/notificationsSlice";
import Navbar from "./Navbar";
import Topbar from "./Topbar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wsRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Глобальное подключение к WebSocket уведомлений
  useEffect(() => {
    if (user) {
      // Загружаем уведомления при входе пользователя
      dispatch(fetchNotifications());
      
      const token = localStorage.getItem('accessToken');
      if (token) {
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('🔔 Global notifications WebSocket connected');
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            console.log('🔔 Global notification received:', data.notification);
            dispatch(addNotification(data.notification));
          }
        };

        ws.onerror = (error) => {
          console.error('🔔 Global notifications WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('🔔 Global notifications WebSocket disconnected');
        };
      }
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [dispatch, user]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Мобильное меню */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleSidebar}></div>
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
          <Navbar isMobile={true} onClose={toggleSidebar} />
        </div>
      </div>

      {/* Десктопное меню */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="flex flex-col flex-1 lg:ml-20">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-gray-50 z-0 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
