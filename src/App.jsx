import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './pages/studentPages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileUpdate from './pages/ProfilePage';
import ExamScheduling from './pages/ExamScheduling';
import StudentsList from './pages/StudentsList';
import QuestionBank from './pages/QuestionBank';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ErrorPage from './components/ErrorPage';
import TermsOfService from './components/footer/TermsOfService';
import PrivacyPolicy from './components/footer/PrivacyPolicy';
import About from './components/footer/About';
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
      <Route path="/" element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {isAuthenticated && user?.role === 'student' && (
        <Route path="/student/dashboard" element={<StudentDashboard />}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="profile" element={<ProfileUpdate />} />
          <Route path="exams" element={<UpcomingExams />} />
          <Route path="exam-details/:id" element={<ExamDetails />} />
          <Route path="start-assessment/:id" element={<ExamInterface />} />
          <Route path="results" element={<Results />} />
        </Route>
      )}

      {isAuthenticated && user?.role === 'admin' && (
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="profile" element={<ProfileUpdate />} />
          <Route path="exams" element={<ExamScheduling />} />
          <Route path="exams/:id" element={<ExamView />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="student-result/:id" element={<StudentResult />} />
        </Route>
      )}

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
