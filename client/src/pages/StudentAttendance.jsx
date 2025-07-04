import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function StudentAttendance() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("https://sw-sm.onrender.com/api/student/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      setError("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Attendance</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec._id} className="border-t">
              <td className="py-2 px-4">{new Date(rec.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 text-center">
                <span className={rec.status === "Present" ? "text-green-600" : "text-red-500"}>{rec.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StudentAttendance; 