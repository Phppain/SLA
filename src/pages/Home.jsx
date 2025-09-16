// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPins } from "../features/pins/pinSlice";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";
import { FiGrid, FiTrendingUp, FiHeart } from "react-icons/fi";

const HomePage = () => {
  const dispatch = useDispatch();
  const { pins, loading } = useSelector((state) => state.pins);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

  const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Добро пожаловать в SLA
            </h1>
            <p className="text-gray-600">
              Откройте для себя удивительные идеи и вдохновение
            </p>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
          ) : pins.length === 0 ? (
            <div className="text-center py-12">
              <FiGrid size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет пинов</h3>
              <p className="text-gray-600 mb-6">
                Пока нет пинов для отображения
              </p>
              {user && (
                <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                  Создать первый пин
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Статистика */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <FiGrid className="text-pink-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Всего пинов</p>
                      <p className="text-2xl font-bold text-gray-900">{pins.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FiTrendingUp className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Популярные</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {pins.filter(pin => pin.likes_count > 100).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <FiHeart className="text-red-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Лайков</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {pins.reduce((sum, pin) => sum + pin.likes_count, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Сетка пинов */}
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {pins.map((pin) => (
                  <div key={pin.id} className="mb-4">
                    <PinCard pin={pin} />
                  </div>
                ))}
              </Masonry>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
