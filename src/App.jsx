import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import CreatePin from "./pages/CreatePin";
import Profile from "./pages/Profile";
import ChatPage from "./pages/Chat";
import SearchUsers from "./pages/SearchUsers";
import UserProfile from "./pages/UserProfile";
import CategoryPage from "./pages/CategoryPage";
import PinsPage from "./pages/PinsPage";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import PinModal from "./components/PinModal";
import { closePinModal } from "./features/modal/modalSlice";
import { useSelector, useDispatch } from "react-redux";

export default function App() {
  const selectedPinId = useSelector(state => state.modal.selectedPinId);
  const dispatch = useDispatch();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/create" element={<CreatePin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/search-users" element={<SearchUsers />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/pins" element={<PinsPage />} />
        </Route>
      </Routes>

      {/* Глобальные модалки */}
      <LoginModal />
      <RegisterModal />
      {selectedPinId && (
        <PinModal pinId={selectedPinId} onClose={() => dispatch(closePinModal())} />
      )}
    </>
  );
}
