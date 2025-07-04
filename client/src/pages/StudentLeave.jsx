import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function StudentLeave() {
  const { token } = useAuth();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/leave/student/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    } catch (err) {
      setLeaves([]);
    }
  };

  useEffect(() => { fetchLeaves(); }, [token, fetchLeaves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await axios.post(
        "http://localhost:5001/api/leave/student/leave",
        { fromDate, toDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Leave applied!");
      setFromDate(""); setToDate(""); setReason("");
      fetchLeaves();
    } catch (err) {
      setError("Failed to apply for leave");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <div className="flex gap-2">
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} required className="border px-2 py-1 rounded" />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} required className="border px-2 py-1 rounded" />
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" required className="border px-2 py-1 rounded w-1/2" />
          <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Apply</button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </form>
      <h3 className="font-semibold mb-2">My Leave Applications</h3>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">From</th>
            <th className="py-2 px-4">To</th>
            <th className="py-2 px-4">Reason</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="border-t">
              <td className="py-2 px-4">{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{new Date(leave.toDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{leave.reason}</td>
              <td className="py-2 px-4">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StudentLeave; 