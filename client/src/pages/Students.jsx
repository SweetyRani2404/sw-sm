import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Students() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/students`, {
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

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/create-student`,
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Student added!");
      setName(""); setEmail(""); setPassword("");
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    }
  };

  const handleDelete = async (id) => {
    // Implement delete student endpoint in backend if needed
    alert("Delete student feature not implemented in backend yet.");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Students</h2>
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Name"
            className="border px-2 py-1 rounded w-1/3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border px-2 py-1 rounded w-1/3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-2 py-1 rounded w-1/3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Add</button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </form>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-t">
              <td className="py-2 px-4">{student.name}</td>
              <td className="py-2 px-4">{student.email}</td>
              <td className="py-2 px-4 text-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Students; 