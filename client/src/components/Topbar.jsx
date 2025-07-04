import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3 border-b">
      <div className="font-bold text-lg text-blue-700">School Management System</div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">
          {user.name} <span className="text-xs text-gray-500">({user.role})</span>
        </span>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
export default Topbar; 