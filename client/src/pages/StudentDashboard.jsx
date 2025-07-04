import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // Fetch attendance
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/student/attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendance(res.data);
      } catch (err) {
        setAttendance([]);
      }
    };
    // Fetch notices
    const fetchNotices = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/notices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotices(res.data);
      } catch (err) {
        setNotices([]);
      }
    };
    fetchAttendance();
    fetchNotices();
  }, [token]);

  // Attendance summary for pie chart
  const presentCount = attendance.filter(a => a.status === "Present").length;
  const absentCount = attendance.filter(a => a.status === "Absent").length;
  const attendanceData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [presentCount, absentCount],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };
  // Latest notice for banner
  const latestNotice = notices.length > 0 ? notices[0] : null;

  const isDashboard = location.pathname === "/student-dashboard" || location.pathname === "/student-dashboard/";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <div>Welcome, <span className="font-semibold">{user?.name}</span> (Student)</div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4 mb-4"
        >
          Logout
        </button>
        {isDashboard && (
          <>
            {/* Modern Notice Banner */}
            {latestNotice && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow p-4 my-6 flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">{latestNotice.title}</div>
                  <div className="text-sm">{latestNotice.content}</div>
                  <div className="text-xs text-blue-100 mt-1">By {latestNotice.createdBy?.name || "Unknown"} ({latestNotice.createdBy?.role}) on {new Date(latestNotice.date).toLocaleString()}</div>
                </div>
                <span className="ml-6 px-3 py-1 bg-white text-blue-700 rounded-full text-xs font-semibold">Notice</span>
              </div>
            )}
            {/* Attendance Pie Chart */}
            <div className="max-w-xs mx-auto mb-8">
              <h3 className="font-semibold mb-2 text-center">Attendance Summary</h3>
              <Pie data={attendanceData} />
              <div className="mt-2 text-center text-sm">Present: <span className="text-green-600 font-bold">{presentCount}</span> | Absent: <span className="text-red-500 font-bold">{absentCount}</span></div>
            </div>
          </>
        )}
        <div className="mt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
export default StudentDashboard; 