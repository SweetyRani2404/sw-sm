import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const { user, token } = useAuth();
  const location = useLocation();
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const teacherRes = await axios.get(`${API_BASE_URL}/api/admin/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacherCount(teacherRes.data.length);
        const studentRes = await axios.get(`${API_BASE_URL}/api/teacher/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentCount(studentRes.data.length);
      } catch (err) {
        setTeacherCount(0);
        setStudentCount(0);
      }
    };
    fetchCounts();
  }, [token, API_BASE_URL]);

  const barData = {
    labels: ["Teachers", "Students"],
    datasets: [
      {
        label: "Count",
        data: [teacherCount, studentCount],
        backgroundColor: ["#60a5fa", "#4ade80"],
      },
    ],
  };
  const pieData = {
    labels: ["Teachers", "Students"],
    datasets: [
      {
        data: [teacherCount, studentCount],
        backgroundColor: ["#60a5fa", "#4ade80"],
      },
    ],
  };
  const isDashboard = location.pathname === "/admin-dashboard";
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="flex">
        <Sidebar className="border-r bg-gray-800" />
        <main className="flex-1 p-8 bg-white shadow-lg min-h-[calc(100vh-64px)]">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <div>Welcome, <span className="font-semibold">{user?.name}</span> (Admin)</div>
          {isDashboard && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-8">
              <div className="bg-gray-50 p-6 rounded shadow">
                <h3 className="font-semibold mb-2">Total Teachers & Students (Bar)</h3>
                <Bar data={barData} />
                <div className="mt-2 text-lg">Teachers: <span className="font-bold">{teacherCount}</span> | Students: <span className="font-bold">{studentCount}</span></div>
              </div>
              <div className="bg-gray-50 p-6 rounded shadow">
                <h3 className="font-semibold mb-2">Distribution (Pie)</h3>
                <Pie data={pieData} />
              </div>
            </div>
          )}
          <div className="mt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export default AdminDashboard; 