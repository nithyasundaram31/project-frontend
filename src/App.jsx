import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

import Register from './components/Register';
import Login from './components/Login';
import AdminLogin from './pages/AdminLogin';  

import StudentDashboard from './pages/studentPages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileUpdate from './pages/ProfilePage';
import ExamScheduling from './pages/ExamScheduling';
import StudentsList from './pages/StudentsList';
import QuestionBank from './pages/QuestionBank';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ErrorPage from './components/ErrorPage';
// import TermsOfService from './components/footer/TermsOfService';
// import PrivacyPolicy from './components/footer/PrivacyPolicy';
// import About from './components/footer/About';
import ExamView from './components/ExamView';
import StudentDashboardPage from './pages/studentPages/StudentDashboardPage';
import UpcomingExams from './pages/studentPages/UpcomingExams';
import ExamDetails from './pages/studentExam/ExamDetails';
import ExamInterface from './pages/studentExam/ExamInterface';
import Results from './pages/studentExam/Results';
import StudentResult from './components/StudentResults';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
     
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role}/dashboard`} />
          ) : (
            <Login />
          )
        }
      />

      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
       <Route path="/admin/login" element={<AdminLogin />} />
      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="/privacy" element={<PrivacyPolicy />} /> */}
      {/* <Route path="/terms" element={<TermsOfService />} /> */}
      <Route path="/students" element={<StudentsList />} />

      
      <Route
        path="/profile"
        element={
          isAuthenticated ? <ProfileUpdate /> : <Navigate to="/login" />
        }
      />

      {/* Student dashboard routes */}
      <Route
        path="/student/dashboard"
        element={
          isAuthenticated && user?.role === 'student' ? (
            <StudentDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="" element={<StudentDashboardPage />} />
        <Route path="profile" element={<ProfileUpdate />} />
        <Route path="exams" element={<UpcomingExams />} />
        <Route path="exam-details/:id" element={<ExamDetails />} />
        <Route path="start-assessment/:id" element={<ExamInterface />} />
        <Route path="results" element={<Results />} />
      </Route>

      {/* Admin dashboard routes */}
      <Route
        path="/admin/dashboard"
        element={
          isAuthenticated && user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="" element={<AdminDashboardPage />} />
        <Route path="profile" element={<ProfileUpdate />} />
        <Route path="exams" element={<ExamScheduling />} />
        <Route path="exams/:id" element={<ExamView />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="student-result/:id" element={<StudentResult />} />
      </Route>

      {/* Error route */}
      <Route path="/error" element={<ErrorPage />} />

      {/* all unmatched routes and redirect or show error */}
      <Route path="*" element={<Navigate to="/error" />} />
    </Routes>
  );
}

export default App;
