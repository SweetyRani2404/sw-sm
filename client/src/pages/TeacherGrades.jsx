import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function TeacherGrades() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://sw-sm.onrender.com/api/teacher/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      setError("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  const handleChange = (id, value) => {
    setMarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!subject) {
      setError("Subject is required");
      return;
    }
    try {
      await Promise.all(
        students.map((student) =>
          marks[student._id]
            ? axios.post(
                "https://sw-sm.onrender.com/api/teacher/grades",
                {
                  studentId: student._id,
                  subject,
                  marks: marks[student._id],
                },
                { headers: { Authorization: `Bearer ${token}` } }
              )
            : null
        )
      );
      setSuccess("Grades uploaded!");
      setSubject("");
      setMarks({});
    } catch (err) {
      setError("Failed to upload grades");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Grades</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4 flex gap-2 items-center">
          <label className="font-semibold">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border px-2 py-1 rounded"
            required
          />
        </div>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-center">Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.email}</td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marks[student._id] || ""}
                    onChange={(e) => handleChange(student._id, e.target.value)}
                    className="border px-2 py-1 rounded w-24 text-center"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit Grades</button>
      </form>
    </div>
  );
}
export default TeacherGrades; 