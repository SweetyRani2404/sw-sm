import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function StudentGrades() {
  const { token } = useAuth();
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");

  const fetchGrades = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/student/grades", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrades(res.data);
    } catch (err) {
      setError("Failed to fetch grades");
    }
  };

  useEffect(() => {
    fetchGrades();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Marks</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Subject</th>
            <th className="py-2 px-4 text-center">Marks</th>
            <th className="py-2 px-4 text-center">Graded By</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade._id} className="border-t">
              <td className="py-2 px-4">{grade.subject}</td>
              <td className="py-2 px-4 text-center">{grade.marks}</td>
              <td className="py-2 px-4 text-center">{grade.gradedBy?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StudentGrades; 