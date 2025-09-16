import { useSelector, useDispatch } from "react-redux";
import { logout, updateProfile } from "../features/auth/authSlice";
import { fetchPins, fetchSavedPins } from "../features/pins/pinSlice";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash, FiUser, FiUserX, FiEdit, FiSave, FiX, FiHeart, FiMessageCircle, FiBookmark, FiGrid, FiPlus, FiBookmark as FiSaved } from "react-icons/fi";
import { useState, useEffect } from "react";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PinCard from "../components/PinCard";
import Masonry from "react-masonry-css";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const { pins, savedPins, loading } = useSelector((state) => state.pins);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("pins");
  const [editForm, setEditForm] = useState({
    first_name: user?.first_name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || ""
  });

  const userPins = pins.filter((pin) => pin.author?.id === user?.id);
  const userCreatedPins = userPins.filter((pin) => !pin.is_saved);

  useEffect(() => {
    if (user) {
      dispatch(fetchPins());
      dispatch(fetchSavedPins());
    }
  }, [dispatch, user]);

  const handleRemove = (friend) => {
    // TODO: Implement remove friend functionality
    console.log("Remove friend:", friend);
  };

  const handleDeleteAccount = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Вместо удаления аккаунта просто выходим из системы
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Ошибка при выходе из аккаунта:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile(editForm)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      first_name: user?.first_name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || ""
    });
    setIsEditing(false);
  };

  const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    1100: 2,
    700: 1,
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-600">Для просмотра профиля необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Профиль пользователя */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center text-3xl text-white font-bold flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.first_name || user.username}
                </h1>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiEdit size={16} className="inline mr-2" />
                    Редактировать
                  </button>
                  
                  <Link
                    to="/settings"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Настройки
                  </Link>
                </div>
              </div>

              {/* Информация о пользователе */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      О себе
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Местоположение
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Веб-сайт
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      <FiSave size={16} className="inline mr-2" />
                      Сохранить
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiX size={16} className="inline mr-2" />
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {user.first_name && (
                    <p className="text-gray-600 mb-2">{user.first_name}</p>
                  )}
                  {user.bio && (
                    <p className="text-gray-700 mb-2">{user.bio}</p>
                  )}
                  {user.location && (
                    <p className="text-gray-500 text-sm mb-1">📍 {user.location}</p>
                  )}
                  {user.website && (
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 text-sm"
                    >
                      🌐 {user.website}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{userPins.length}</div>
              <div className="text-gray-600">Пинов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-gray-600">Подписчиков</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-gray-600">Подписок</div>
            </div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("pins")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "pins"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FiGrid size={16} />
                Пины ({userPins.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("created")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "created"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FiPlus size={16} />
                Созданные ({userCreatedPins.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "saved"
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FiSaved size={16} />
                Сохраненные ({savedPins.length})
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div>
            {activeTab === "pins" && (
              <div>
                {userPins.length > 0 ? (
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {userPins.map((pin) => (
                      <div key={pin.id} className="mb-4">
                        <PinCard pin={pin} />
                      </div>
                    ))}
                  </Masonry>
                ) : (
                  <div className="text-center py-12">
                    <FiGrid size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет пинов</h3>
                    <p className="text-gray-600 mb-6">Создайте свой первый пин</p>
                    <Link
                      to="/create"
                      className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Создать пин
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "created" && (
              <div>
                {userCreatedPins.length > 0 ? (
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {userCreatedPins.map((pin) => (
                      <div key={pin.id} className="mb-4">
                        <PinCard pin={pin} />
                      </div>
                    ))}
                  </Masonry>
                ) : (
                  <div className="text-center py-12">
                    <FiPlus size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет созданных пинов</h3>
                    <p className="text-gray-600 mb-6">Создайте свой первый пин</p>
                    <Link
                      to="/create"
                      className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Создать пин
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div>
                {savedPins.length > 0 ? (
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
                ) : (
                  <div className="text-center py-12">
                    <FiSaved size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет сохраненных пинов</h3>
                    <p className="text-gray-600 mb-6">Сохраняйте пины, которые вам нравятся</p>
                    <Link
                      to="/pins"
                      className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Найти пины
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Кнопка выхода из аккаунта */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="text-center">
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiTrash size={16} className="inline mr-2" />
            Выйти из аккаунта
          </button>
        </div>
      </div>

      {/* Модальное окно подтверждения */}
      <ConfirmDeleteModal
        isOpen={showConfirm}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Выйти из аккаунта"
        message="Вы уверены, что хотите выйти из аккаунта? Это действие нельзя отменить."
      />
    </div>
  );
}
