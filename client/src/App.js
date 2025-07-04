import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Notices from "./pages/Notices";
import TeacherAttendance from "./pages/TeacherAttendance";
import StudentAttendance from "./pages/StudentAttendance";
import StudentGrades from "./pages/StudentGrades";
import StudentNotices from "./pages/StudentNotices";
import TeacherNotices from "./pages/TeacherNotices";
import TeacherClasses from "./pages/TeacherClasses";
import StudentLeave from "./pages/StudentLeave";
import TeacherLeaves from "./pages/TeacherLeaves";
import AdminLeaves from "./pages/AdminLeaves";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import './App.css';

function ProtectedRoute({ children, role }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/" />;
  if (role && user?.role !== role) return <Navigate to={`/${user?.role}-dashboard`} />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={
              <div>{/* Dashboard analytics and welcome will render here via AdminDashboard's Outlet */}</div>
            } />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="notices" element={<Notices />} />
            <Route path="leaves" element={<AdminLeaves />} />
          </Route>
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={
              <div>
                {/* Dashboard analytics and welcome will render here via TeacherDashboard's Outlet */}
              </div>
            } />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="notices" element={<TeacherNotices />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="leaves" element={<TeacherLeaves />} />
          </Route>
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={
              <div>{/* Dashboard analytics, banner, and welcome will render here via StudentDashboard's Outlet */}</div>
            } />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="notices" element={<StudentNotices />} />
            <Route path="leave" element={<StudentLeave />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
