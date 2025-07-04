import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function AdminLeaves() {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/leave/admin/leaves", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      } catch (err) {
        setLeaves([]);
      }
    };
    fetchLeaves();
  }, [token]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Leave Applications</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Student</th>
            <th className="py-2 px-4">From</th>
            <th className="py-2 px-4">To</th>
            <th className="py-2 px-4">Reason</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Reviewed By</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="border-t">
              <td className="py-2 px-4">{leave.student?.name}</td>
              <td className="py-2 px-4">{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{new Date(leave.toDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{leave.reason}</td>
              <td className="py-2 px-4">{leave.status}</td>
              <td className="py-2 px-4">{leave.reviewedBy?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminLeaves; 