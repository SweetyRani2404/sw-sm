import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function StudentNotices() {
  const { token } = useAuth();
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchNotices = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data);
    } catch (err) {
      setError("Failed to fetch notices");
    }
  }, [token, API_BASE_URL]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notices</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice._id} className="bg-white rounded shadow p-4">
            <div className="font-bold text-lg">{notice.title}</div>
            <div className="text-gray-700 mb-2">{notice.content}</div>
            <div className="text-xs text-gray-500">
              By {notice.createdBy?.name || "Unknown"} ({notice.createdBy?.role}) on {new Date(notice.date).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentNotices;