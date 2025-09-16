import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Topbar from "./Topbar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
