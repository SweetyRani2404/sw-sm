import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Notices() {
  const { token } = useAuth();
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchNotices = async () => {
    try {
      const res = await axios.get("https://sw-sm.onrender.com/api/notices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data);
    } catch (err) {
      setError("Failed to fetch notices");
    }
  };

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(
        "https://sw-sm.onrender.com/api/notices",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Notice posted!");
      setTitle(""); setContent("");
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post notice");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notices</h2>
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Title"
            className="border px-2 py-1 rounded w-1/3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Content"
            className="border px-2 py-1 rounded w-2/3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Post</button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </form>
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice._id} className="bg-white rounded shadow p-4">
            <div className="font-bold text-lg">{notice.title}</div>
            <div className="text-gray-700 mb-2">{notice.content}</div>
            <div className="text-xs text-gray-500">By {notice.createdBy?.name || "Unknown"} ({notice.createdBy?.role}) on {new Date(notice.date).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Notices; 