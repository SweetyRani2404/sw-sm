import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

const navLinks = {
  admin: [
    { to: "/admin-dashboard", label: "Dashboard" },
    { to: "/admin-dashboard/teachers", label: "Teachers" },
    { to: "/admin-dashboard/students", label: "Students" },
    { to: "/admin-dashboard/attendance", label: "Attendance" },
    { to: "/admin-dashboard/notices", label: "Notices" },
    { to: "/admin-dashboard/leaves", label: "Leaves" },
  ],
  teacher: [
    { to: "/teacher-dashboard", label: "Dashboard" },
    { to: "/teacher-dashboard/classes", label: "My Classes" },
    { to: "/teacher-dashboard/attendance", label: "Attendance" },
    { to: "/teacher-dashboard/notices", label: "Notices" },
    { to: "/teacher-dashboard/leaves", label: "Leaves" },
  ],
  student: [
    { to: "/student-dashboard", label: "Dashboard" },
    { to: "/student-dashboard/attendance", label: "My Attendance" },
    { to: "/student-dashboard/grades", label: "My Marks" },
    { to: "/student-dashboard/notices", label: "Notices" },
    { to: "/student-dashboard/leave", label: "Leave" },
  ],
};

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;
  const links = navLinks[user.role] || [];
  return (
    <aside className="w-56 bg-gray-800 text-white min-h-screen p-4">
      <div className="font-bold text-lg mb-8">School System</div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-3 py-2 rounded hover:bg-gray-700 ${location.pathname === link.to ? "bg-gray-700" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
export default Sidebar; 