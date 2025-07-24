
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import CreatePin from "./pages/CreatePin";
import Profile from "./pages/Profile";
import ChatPage from "./pages/Chat";
import SearchUsers from "./pages/SearchUsers";
import UserProfile from "./pages/UserProfile";
import { Navigate } from "react-router-dom";

export default function App() {
  return (
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
        </Route>
      </Routes>
  );
}
