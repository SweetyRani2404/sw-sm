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

function TeacherDashboard() {
  const { user, token } = useAuth();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ Present: 0, Absent: 0 });

  useEffect(() => {
    // Fetch students for class strength
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/teacher/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        setStudents([]);
      }
    };
    // Fetch attendance summary (dummy, as no API for all attendance)
    const fetchAttendanceStats = async () => {
      // This should be replaced with a real API for teacher's class attendance summary
      // For now, just use dummy data
      setAttendanceStats({ Present: 18, Absent: 2 });
    };
    fetchStudents();
    fetchAttendanceStats();
  }, [token]);

  const classStrength = students.length;
  const attendanceData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Attendance",
        data: [attendanceStats.Present, attendanceStats.Absent],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };
  const classStrengthData = {
    labels: ["Students"],
    datasets: [
      {
        label: "Class Strength",
        data: [classStrength],
        backgroundColor: ["#60a5fa"],
      },
    ],
  };
  // Only show dashboard analytics on the exact /teacher-dashboard route
  const isDashboard = location.pathname === "/teacher-dashboard";
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <div className="flex">
        <Sidebar className="border-r bg-gray-800" />
        <main className="flex-1 p-8 bg-white shadow-lg min-h-[calc(100vh-64px)]">
          <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
          <div>Welcome, <span className="font-semibold">{user?.name}</span> (Teacher)</div>
          {isDashboard && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-8">
              <div className="bg-gray-50 p-6 rounded shadow">
                <h3 className="font-semibold mb-2">Class Strength</h3>
                <Bar data={classStrengthData} options={{ indexAxis: "y" }} />
                <div className="mt-2 text-lg">Total Students: <span className="font-bold">{classStrength}</span></div>
              </div>
              <div className="bg-gray-50 p-6 rounded shadow">
                <h3 className="font-semibold mb-2">Attendance Summary (Dummy)</h3>
                <Pie data={attendanceData} />
                <div className="mt-2 text-lg">Present: <span className="text-green-600 font-bold">{attendanceStats.Present}</span> | Absent: <span className="text-red-500 font-bold">{attendanceStats.Absent}</span></div>
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
export default TeacherDashboard; 