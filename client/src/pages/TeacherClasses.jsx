import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function TeacherClasses() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/teacher/students", {
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

  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/teacher/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelected(res.data);
    } catch (err) {
      setError("Failed to fetch student details");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Class</h2>
      <table className="w-full bg-white rounded shadow mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-t">
              <td className="py-2 px-4">{student.name}</td>
              <td className="py-2 px-4">{student.email}</td>
              <td className="py-2 px-4 text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleSelect(student._id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="font-bold mb-2">Student Details</h3>
          <div><span className="font-semibold">Name:</span> {selected.name}</div>
          <div><span className="font-semibold">Email:</span> {selected.email}</div>
          <div><span className="font-semibold">Role:</span> {selected.role}</div>
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
export default TeacherClasses; 