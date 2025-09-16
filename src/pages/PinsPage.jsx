import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPins } from "../features/pins/pinSlice";
import { setSearchQuery } from "../features/search/searchSlice";
import { setSelectedCategory } from "../features/category/categorySlice";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";
import { FiGrid, FiFilter, FiSearch, FiX } from "react-icons/fi";

const PinsPage = () => {
  const dispatch = useDispatch();
  const { pins, loading } = useSelector((state) => state.pins);
  const query = useSelector((state) => state.search.searchQuery)?.toLowerCase() || "";
  const selectedCategory = useSelector((state) => state.category.selectedCategory);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchPins());
  }, [dispatch]);

  const breakpointColumnsObj = {
    default: viewMode === 'grid' ? 4 : 1,
    1400: viewMode === 'grid' ? 3 : 1,
    1100: viewMode === 'grid' ? 2 : 1,
    700: 1,
  };

  // Фильтрация пинов
  const filteredPins = pins.filter((pin) => {
    const matchesQuery = !query || 
      pin.title?.toLowerCase().includes(query) ||
      pin.description?.toLowerCase().includes(query) ||
      pin.author?.username?.toLowerCase().includes(query);
    
    const matchesCategory = !selectedCategory || pin.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });

  const categories = [
    { id: "all", name: "Все", icon: "🌟" },
    { id: "природа", name: "Природа", icon: "🌿" },
    { id: "путешествия", name: "Путешествия", icon: "✈️" },
    { id: "дизайн", name: "Дизайн", icon: "🎨" },
    { id: "еда", name: "Еда", icon: "🍕" },
    { id: "мода", name: "Мода", icon: "👗" },
    { id: "технологии", name: "Технологии", icon: "💻" },
    { id: "спорт", name: "Спорт", icon: "⚽" },
  ];

  const clearFilters = () => {
    dispatch(setSearchQuery(""));
    dispatch(setSelectedCategory(""));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок и фильтры */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FiGrid className="text-pink-600" />
                Все пины
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredPins.length} {filteredPins.length === 1 ? 'пин найден' : 'пинов найдено'}
                {query && ` по запросу "${query}"`}
                {selectedCategory && ` в категории "${selectedCategory}"`}
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
                  <FiSearch size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Поиск */}
          <div className="mt-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск пинов..."
                value={query}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {query && (
                <button
                  onClick={() => dispatch(setSearchQuery(""))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Категории */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => dispatch(setSelectedCategory(category.id === "all" ? "" : category.id))}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  (category.id === "all" && !selectedCategory) || category.id === selectedCategory
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Активные фильтры */}
          {(query || selectedCategory) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Активные фильтры:</span>
              {query && (
                <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                  Поиск: {query}
                </span>
              )}
              {selectedCategory && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Категория: {selectedCategory}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Очистить все
              </button>
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
        ) : filteredPins.length === 0 ? (
          <div className="text-center py-12">
            <FiGrid size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Пины не найдены</h3>
            <p className="text-gray-600 mb-6">
              {query || selectedCategory 
                ? "Попробуйте изменить параметры поиска" 
                : "Пока нет пинов для отображения"
              }
            </p>
            {(query || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Очистить фильтры
              </button>
            )}
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredPins.map((pin) => (
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

export default PinsPage;
