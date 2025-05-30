import React, { useCallback, useEffect, useRef } from 'react';
import { FaUsers as Users, FaBookOpen as BookOpen, FaChartBar as BarChart, FaCalendar as Calendar } from 'react-icons/fa';
import StatsCard from '../components/dashboard/StatsCard';
import UpcomingExams from '../components/dashboard/UpcomingExams';
import RecentActivity from '../components/dashboard/RecentActivity';
import { useDispatch, useSelector } from 'react-redux';
import { getExams } from '../redux/actions/examActions';
import { getAllStudents, getStudentsActivity } from '../redux/actions/studentActions';
import QuickActions from '../components/dashboard/QuickActions';

const AdminDashboardPage = () => {
  const exams = useSelector(state => state.exams.exams) || [];
  const students = useSelector(state => state.studentState.students) || [];
  const activity = useSelector(state => state.studentState.activity) || [];

  const dispatch = useDispatch();
  const hasFetchedExams = useRef(false);

  const fetchExams = useCallback(async () => {
    try {
      await dispatch(getExams());
      await dispatch(getAllStudents());
      await dispatch(getStudentsActivity());
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hasFetchedExams.current) {
      fetchExams();
      hasFetchedExams.current = true;
    }
  }, [fetchExams]);

  // Filter active exams (today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingExams = exams.filter(exam => {
    const examDate = new Date(exam.date);
    return examDate >= today;
  });

  const activeExams = exams.filter(exam => {
    const examDate = new Date(exam.date);
    examDate.setHours(0, 0, 0, 0);
    return examDate.getTime() === today.getTime();
  });

  const completedExams = exams.filter(exam => new Date(exam.date) < today).length;
  const totalExams = exams.length;
  const completionRate = totalExams > 0 ? ((completedExams / totalExams) * 100).toFixed(0) + '%' : '0%';

  const stats = [
    { title: 'Total Students', value: students.length, icon: Users, bgColor: "bg-blue-500/[0.6]" },
    { title: 'Active Exams', value: activeExams.length, icon: BookOpen, bgColor: "bg-red-500/[0.6]" },
    { title: 'Completion Rate', value: completionRate, icon: BarChart, bgColor: "bg-lime-500/[0.6]" },
    { title: 'Upcoming Exams', value: upcomingExams.length, icon: Calendar, bgColor: "bg-cyan-500/[0.6]" }
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 pb-16">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <UpcomingExams exams={upcomingExams} />
        <RecentActivity activities={Array.isArray(activity.activities) ? activity.activities : activity} />
      </div>
    </div>
  );
}

export default AdminDashboardPage;