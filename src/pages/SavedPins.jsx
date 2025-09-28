import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSavedPins } from "../features/pins/pinSlice";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";
import { FiBookmark, FiFilter, FiGrid, FiList } from "react-icons/fi";

const SavedPins = () => {
  const dispatch = useDispatch();
  const { savedPins, loading } = useSelector((state) => state.pins);
  const user = useSelector((state) => state.auth.user);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchSavedPins());
    }
  }, [dispatch, user]);

  const breakpointColumnsObj = {
    default: viewMode === 'grid' ? 4 : 1,
    1400: viewMode === 'grid' ? 3 : 1,
    1100: viewMode === 'grid' ? 2 : 1,
    700: 1,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiBookmark size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-600">Для просмотра сохраненных пинов необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок и фильтры */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FiBookmark className="text-pink-600" />
                Сохраненные пины
              </h1>
              <p className="text-gray-600 mt-1">
                {savedPins.length} {savedPins.length === 1 ? 'сохраненный пин' : 'сохраненных пинов'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Фильтры */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors"
              >
                <FiFilter size={16} />
                <span className="hidden sm:inline">Фильтры</span>
              </button>

              {/* Переключение вида */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-pink-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-pink-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Фильтры */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="">Все категории</option>
                    <option value="art">Искусство</option>
                    <option value="beauty">Красота</option>
                    <option value="fitness">Фитнес</option>
                    <option value="fashion">Мода</option>
                    <option value="travel">Путешествия</option>
                    <option value="food">Еда</option>
                    <option value="games">Игры</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сортировка
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="recent">Недавно сохраненные</option>
                    <option value="oldest">Сначала старые</option>
                    <option value="popular">По популярности</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : savedPins.length === 0 ? (
          <div className="text-center py-12">
            <FiBookmark size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет сохраненных пинов</h3>
            <p className="text-gray-600 mb-6">
              Сохраняйте пины, которые вам нравятся, чтобы найти их позже
            </p>
            <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
              Найти пины
            </button>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {savedPins.map((pin) => (
              <div key={pin.id} className="mb-4">
                <PinCard pin={pin} />
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
};

export default SavedPins;







