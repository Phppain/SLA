
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    dispatch(login({ username }));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
        >
          Login
        </button>
        <p className="text-sm mt-4 text-center">
          No account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
        </p>
        <p className="text-sm mt-2 text-center">
          <Link to="/reset-password" className="text-blue-500 hover:underline">Forgot password?</Link>
        </p>
      </form>
    </div>
  );
}
