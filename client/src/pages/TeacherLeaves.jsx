import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function TeacherLeaves() {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/leave/teacher/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    } catch (err) {
      setLeaves([]);
    }
  };

  useEffect(() => { fetchLeaves(); }, [token, fetchLeaves]);

  const handleReview = async (leaveId, status) => {
    setError(""); setSuccess("");
    try {
      await axios.patch(
        `http://localhost:5001/api/leave/teacher/leave/${leaveId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Leave reviewed!");
      fetchLeaves();
    } catch (err) {
      setError("Failed to review leave");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Leave Requests</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Student</th>
            <th className="py-2 px-4">From</th>
            <th className="py-2 px-4">To</th>
            <th className="py-2 px-4">Reason</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="border-t">
              <td className="py-2 px-4">{leave.student?.name}</td>
              <td className="py-2 px-4">{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{new Date(leave.toDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{leave.reason}</td>
              <td className="py-2 px-4">
                <button className="bg-green-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleReview(leave._id, "Accepted")}>Accept</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleReview(leave._id, "Rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default TeacherLeaves; 