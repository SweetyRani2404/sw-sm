import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function TeacherAttendance() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/teacher/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      // Initialize attendance state
      const initial = {};
      res.data.forEach((s) => { initial[s._id] = "Present"; });
      setAttendance(initial);
    } catch (err) {
      setError("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  const handleChange = (id, value) => {
    setAttendance((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await Promise.all(
        students.map((student) =>
          axios.post(
            "http://localhost:5001/api/teacher/attendance",
            {
              studentId: student._id,
              date,
              status: attendance[student._id],
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setSuccess("Attendance marked!");
    } catch (err) {
      setError("Failed to mark attendance");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Take Attendance</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="mr-2 font-semibold">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1 rounded"
            required
          />
        </div>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.email}</td>
                <td className="py-2 px-4 text-center">
                  <select
                    value={attendance[student._id] || "Present"}
                    onChange={(e) => handleChange(student._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit Attendance</button>
      </form>
    </div>
  );
}
export default TeacherAttendance; 