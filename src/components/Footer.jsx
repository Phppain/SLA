import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Pinterest Clone</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Политика конфиденциальности</a>
          <a href="#" className="hover:underline">Условия использования</a>
          <a href="#" className="hover:underline">Связаться с нами</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
