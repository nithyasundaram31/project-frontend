import React, { useCallback, useEffect, useRef } from 'react';
import { FaUsers as Users, FaBookOpen as BookOpen, FaChartBar as BarChart, FaCalendar as Calendar } from 'react-icons/fa';
import StatsCard from '../components/dashboard/StatsCard';
import UpcomingExams from '../components/dashboard/UpcomingExams';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import { useDispatch, useSelector } from 'react-redux';
import { getExams } from '../redux/actions/examActions';
import { getAllStudents, getStudentsActivity } from '../redux/actions/studentActions';

const AdminDashboardPage = () => {
  const { exams, submittedData } = useSelector(state => state.exams);
  const { students, activity } = useSelector(state => state.studentState);

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
  }, [dispatch, fetchExams]);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Active Exam
  const activeExams = exams?.filter(exam => {
    const examDate = new Date(exam.date);
    const expireDate = new Date(examDate.getTime() + 24 * 60 * 60 * 1000);
    return examDate.toDateString() === now.toDateString() && now <= expireDate;
  }) || [];

  // Upcoming Exam 
  const upcomingExams = exams?.filter(exam => {
    const examDate = new Date(exam.date);
    const expireDate = new Date(examDate.getTime() + 24 * 60 * 60 * 1000);
    return examDate > now && examDate.toDateString() !== now.toDateString() && now <= expireDate;
  }) || [];

  // Only count current students
  const totalStudents = students ? students.length : 0;
  // Prepare a set of all current student IDs
  const currentStudentIds = new Set(
    (students || []).map(
      s => (s._id?.toString() || s.id?.toString())
    )
  );

  // For each exam, only count completed students who are still current students
  const examCompletionDetails = exams.map(exam => {
    const examId = exam._id;
    // ONLY include submissions by current students
    const completedStudents = (submittedData || []).filter(sub => {
      const submittedExamId = sub?.examId?._id || sub?.examId;
      // Try various fields for student id in submission
      const studentId = (
        sub?.userId?._id?.toString() ||
        sub?.userId?.toString() ||
        sub?.studentId?.toString() ||
        sub?.student?.toString()
      );
      return (
        submittedExamId?.toString() === examId.toString() &&
        currentStudentIds.has(studentId)
      );
    }) || [];

    return {
      examName: exam.name,
      completedStudentsCount: completedStudents.length,
      totalStudents,
      completionRate: totalStudents > 0
        ? ((completedStudents.length / totalStudents) * 100).toFixed(0) + '%'
        : '0%',
    };
  });

  const stats = [
    { title: 'Total Students', value: totalStudents, icon: Users, bgColor: "bg-blue-500/[0.6]" },
    { title: 'Active Exams', value: activeExams.length, icon: BookOpen, bgColor: "bg-red-500/[0.6]" },
    { title: 'Upcoming Exams', value: upcomingExams.length, icon: Calendar, bgColor: "bg-cyan-500/[0.6]" },
    ...examCompletionDetails.map(detail => ({
      title: `${detail.examName} Completion Rate`,
      value: `${detail.completedStudentsCount}/${detail.totalStudents} (${detail.completionRate})`,
      icon: BarChart,
      bgColor: "bg-yellow-500/[0.6]"
    }))
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pt-12 items-center mt-8 pb-16">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <UpcomingExams exams={upcomingExams} />
        <RecentActivity activities={activity} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;