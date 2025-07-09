import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, { email, password });
      login(res.data.user, res.data.token);
      // Redirect based on role
      if (res.data.user.role === "admin") navigate("/admin-dashboard");
      else if (res.data.user.role === "teacher") navigate("/teacher-dashboard");
      else if (res.data.user.role === "student") navigate("/student-dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleDevLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/dev-auto-login`);
      login(res.data.user, res.data.token);
      navigate("/admin-dashboard");
    } catch (err) {
      setError("Dev login failed");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: 'url(/login.webp)' }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div className="relative z-10 bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 flex flex-col items-center">
        {/* Logo placeholder */}
        <div className="mb-6">
          <img src="/logo192.png" alt="Logo" className="w-16 h-16 mx-auto rounded-full shadow-lg" />
        </div>
        <h1 className="text-3xl font-extrabold mb-4 text-blue-700 tracking-tight">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 text-gray-800 placeholder-gray-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 text-gray-800 placeholder-gray-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition"
          >
            Login
          </button>
        </form>
        <button
          type="button"
          onClick={handleDevLogin}
          className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white py-2 rounded-lg font-semibold shadow mt-4 hover:from-green-600 hover:to-green-500 transition"
        >
          Dev Login (Bypass)
        </button>
      </div>
    </div>
  );
}
export default LoginPage; 