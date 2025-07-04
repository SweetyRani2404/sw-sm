import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function StudentNotices() {
  const { token } = useAuth();
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");

  const fetchNotices = async () => {
    try {
      const res = await axios.get("https://sw-sm.onrender.com/api/notices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data);
    } catch (error) {
      setError("Error fetching notices");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [token]);

  return (
    <div>
      {/* Render your notices component here */}
    </div>
  );
}

export default StudentNotices;