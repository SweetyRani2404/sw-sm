import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Teachers() {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data);
    } catch (err) {
      setError("Failed to fetch teachers");
    }
  };

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(
        "http://localhost:5001/api/admin/create-teacher",
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Teacher added!");
      setName(""); setEmail(""); setPassword("");
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add teacher");
    }
  };

  const handleDelete = async (id) => {
    // Implement delete teacher endpoint in backend if needed
    alert("Delete teacher feature not implemented in backend yet.");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Teachers</h2>
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
          {teachers.map((teacher) => (
            <tr key={teacher._id} className="border-t">
              <td className="py-2 px-4">{teacher.name}</td>
              <td className="py-2 px-4">{teacher.email}</td>
              <td className="py-2 px-4 text-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(teacher._id)}
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
export default Teachers; 