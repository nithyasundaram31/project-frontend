// // // import React, { useCallback, useEffect, useRef } from 'react';
// // // import {
// // //   FaUsers as Users,
// // //   FaBookOpen as BookOpen,
// // //   FaChartBar as BarChart,
// // //   FaCalendar as Calendar
// // // } from 'react-icons/fa';
// // // import StatsCard from '../components/dashboard/StatsCard';
// // // import UpcomingExams from '../components/dashboard/UpcomingExams';
// // // import RecentActivity from '../components/dashboard/RecentActivity';
// // // import QuickActions from '../components/dashboard/QuickActions';
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { getExams } from '../redux/actions/examActions';
// // // import { getAllStudents, getStudentsActivity } from '../redux/actions/studentActions';

// // // const AdminDashboardPage = () => {
// // //   const { exams, submittedData } = useSelector(state => state.exams);
// // //   const { students, activity } = useSelector(state => state.studentState);

// // //   const dispatch = useDispatch();
// // //   const hasFetchedExams = useRef(false);

// // //   const fetchExams = useCallback(async () => {
// // //     try {
// // //       await dispatch(getExams());
// // //       await dispatch(getAllStudents());
// // //       await dispatch(getStudentsActivity());
// // //     } catch (error) {
// // //       console.error('Failed to fetch exams:', error);
// // //     }
// // //   }, [dispatch]);

// // //   useEffect(() => {
// // //     if (!hasFetchedExams.current) {
// // //       fetchExams();
// // //       hasFetchedExams.current = true;
// // //     }
// // //   }, [dispatch, fetchExams]);

// // //   // Debug log
// // //   useEffect(() => {
// // //   console.log("📊 All Exams:", exams);
// // //   console.log("✅ Submitted Data:", submittedData);
// // //   console.log("🔥 Activity Data:", activity); // 👉 Add this line
// // // }, [exams, submittedData, activity]);

// // //   // Date calculations
// // //   const today = new Date();
// // //   today.setHours(0, 0, 0, 0);

  
// // // //Active exams: exams scheduled for today AND not already submitted
// // // const activeExams = Array.isArray(exams) ? exams.filter(exam => {
// // //   if (!exam || !exam.date || !exam._id) return false;

// // //   const examDate = new Date(exam.date);
// // //   const isToday = examDate.toDateString() === today.toDateString();

// // //   const isAlreadySubmitted = Array.isArray(submittedData) && submittedData.some(sub => {
// // //     if (!sub || !sub.examId) return false;
// // //     const submittedExamId = typeof sub.examId === 'object' ? sub.examId._id : sub.examId;
// // //     return submittedExamId?.toString() === exam._id.toString();
// // //   });

// // //   return isToday && !isAlreadySubmitted;
// // // }) : [];


// // // // Upcoming exams (future only, strictly greater than today)
// // // const upcomingExams = Array.isArray(exams)
// // //   ? exams.filter(exam => {
// // //       if (!exam?.date || !exam._id) return false;

// // //       const examDate = new Date(exam.date);
// // //       const isFuture = examDate > today;
// // //       const isToday = examDate.toDateString() === today.toDateString();

// // //       const isAlreadySubmitted = Array.isArray(submittedData) && submittedData.some(sub => {
// // //         if (!sub || !sub.examId) return false;
// // //         const submittedExamId = typeof sub.examId === 'object' ? sub.examId._id : sub.examId;
// // //         return submittedExamId?.toString() === exam._id.toString();
// // //       });

// // //       //  Only future exams (not today) that are NOT submitted
// // //       return isFuture && !isAlreadySubmitted && !isToday;
// // //     })
// // //   : [];



// // //   // Completion Rate based on unique exam submissions
// // //   const totalExams = exams ? exams.length : 0;
// // //   // Unique completed exams count by examId string
// // //   const completedExamIds = new Set(
// // //   submittedData
// // //     ?.map(sub => {
// // //       if (sub?.examId) {
// // //         if (typeof sub.examId === 'object' && sub.examId?._id) {
// // //           return sub.examId._id.toString();
// // //         }
// // //         return sub.examId.toString();
// // //       }
// // //       return null;
// // //     })
// // //     .filter(id => id !== null)
// // // );

// // //   const completedExams = completedExamIds.size;
// // //   const completionRate = totalExams > 0 ? ((completedExams / totalExams) * 100).toFixed(0) + '%' : '0%';

// // //   // Students count
// // //   const totalStudents = students ? students.length : 0;

// // //   const stats = [
// // //     { title: 'Total Students', value: totalStudents, icon: Users, bgColor: "bg-blue-500/[0.6]" },
// // //     { title: 'Active Exams', value: activeExams.length, icon: BookOpen, bgColor: "bg-red-500/[0.6]" },
// // //     { title: 'Completion Rate', value: completionRate, icon: BarChart, bgColor: "bg-lime-500/[0.6]" },
// // //     { title: 'Upcoming Exams', value: upcomingExams.length, icon: Calendar, bgColor: "bg-cyan-500/[0.6]" }
// // //   ];

// // //   return (
// // //     <div>
// // //       {/* Stats Grid */}
// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 pt-12 items-center mt-8 pb-16">
// // //         {stats.map((stat) => (
// // //           <StatsCard key={stat.title} {...stat} />
// // //         ))}
// // //       </div>

// // //       <QuickActions />

// // //       {/* Two Column Layout */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
// // //         <UpcomingExams exams={upcomingExams} />
// // //         <RecentActivity activities={activity} />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AdminDashboardPage;

// // // import React, { useCallback, useEffect, useRef } from 'react';
// // // import {
// // //   FaUsers as Users,
// // //   FaBookOpen as BookOpen,
// // //   FaChartBar as BarChart,
// // //   FaCalendar as Calendar
// // // } from 'react-icons/fa';
// // // import StatsCard from '../components/dashboard/StatsCard';
// // // import UpcomingExams from '../components/dashboard/UpcomingExams';
// // // import RecentActivity from '../components/dashboard/RecentActivity';
// // // import QuickActions from '../components/dashboard/QuickActions';
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { getExams } from '../redux/actions/examActions';
// // // import { getAllStudents, getStudentsActivity } from '../redux/actions/studentActions';

// // // const AdminDashboardPage = () => {
// // //   const { exams, submittedData } = useSelector(state => state.exams);
// // //   const { students, activity } = useSelector(state => state.studentState);

// // //   const dispatch = useDispatch();
// // //   const hasFetchedExams = useRef(false);

// // //   const fetchExams = useCallback(async () => {
// // //     try {
// // //       await dispatch(getExams());
// // //       await dispatch(getAllStudents());
// // //       await dispatch(getStudentsActivity());
// // //     } catch (error) {
// // //       console.error('Failed to fetch exams:', error);
// // //     }
// // //   }, [dispatch]);

// // //   useEffect(() => {
// // //     if (!hasFetchedExams.current) {
// // //       fetchExams();
// // //       hasFetchedExams.current = true;
// // //     }
// // //   }, [dispatch, fetchExams]);

// // //   useEffect(() => {
// // //     console.log("📊 All Exams:", exams);
// // //     console.log("✅ Submitted Data:", submittedData);
// // //     console.log("🔥 Activity Data:", activity);
// // //   }, [exams, submittedData, activity]);

// // //   const today = new Date();
// // //   today.setHours(0, 0, 0, 0);

// // //   // Active exams
// // //   const activeExams = Array.isArray(exams) ? exams.filter(exam => {
// // //     if (!exam || !exam.date || !exam._id) return false;

// // //     const examDate = new Date(exam.date);
// // //     const isToday = examDate.toDateString() === today.toDateString();

// // //     const isAlreadySubmitted = Array.isArray(submittedData) && submittedData.some(sub => {
// // //       if (!sub || !sub.examId) return false;
// // //       const submittedExamId = typeof sub.examId === 'object' ? sub.examId._id : sub.examId;
// // //       return submittedExamId?.toString() === exam._id.toString();
// // //     });

// // //     return isToday && !isAlreadySubmitted;
// // //   }) : [];

// // //   // Upcoming exams
// // //   const upcomingExams = Array.isArray(exams)
// // //     ? exams.filter(exam => {
// // //         if (!exam?.date || !exam._id) return false;

// // //         const examDate = new Date(exam.date);
// // //         const isFuture = examDate > today;
// // //         const isToday = examDate.toDateString() === today.toDateString();

// // //         const isAlreadySubmitted = Array.isArray(submittedData) && submittedData.some(sub => {
// // //           if (!sub || !sub.examId) return false;
// // //           const submittedExamId = typeof sub.examId === 'object' ? sub.examId._id : sub.examId;
// // //           return submittedExamId?.toString() === exam._id.toString();
// // //         });

// // //         return isFuture && !isAlreadySubmitted && !isToday;
// // //       })
// // //     : [];

// // //   // Completion Rate Logic
// // //   const totalStudents = students ? students.length : 0;
// // //   const totalExams = exams ? exams.length : 0;

// // //   // Map examId to count of students who completed each exam
// // //   const examCompletionMap = new Map();

// // //   submittedData?.forEach(sub => {
// // //     const examId = sub?.examId?._id || sub?.examId; // Assuming each submission has an examId
// // //     if (examId) {
// // //       examCompletionMap.set(
// // //         examId,
// // //         (examCompletionMap.get(examId) || 0) + 1
// // //       );
// // //     }
// // //   });

// // //   // Calculate total exam completions by all students
// // //   const totalCompletions = Array.from(examCompletionMap.values()).reduce(
// // //     (acc, completedStudents) => acc + (completedStudents / totalStudents),
// // //     0
// // //   );

// // //   // Calculate overall completion rate
// // //   const completionRate =
// // //     totalExams > 0
// // //       ? ((totalCompletions / totalExams) * 100).toFixed(0) + '%'
// // //       : '0%';

// // //   const stats = [
// // //     { title: 'Total Students', value: totalStudents, icon: Users, bgColor: "bg-blue-500/[0.6]" },
// // //     { title: 'Active Exams', value: activeExams.length, icon: BookOpen, bgColor: "bg-red-500/[0.6]" },
// // //     { title: 'Completion Rate', value: completionRate, icon: BarChart, bgColor: "bg-lime-500/[0.6]" },
// // //     { title: 'Upcoming Exams', value: upcomingExams.length, icon: Calendar, bgColor: "bg-cyan-500/[0.6]" }
// // //   ];

// // //   return (
// // //     <div>
// // //       {/* Stats Grid */}
// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 pt-12 items-center mt-8 pb-16">
// // //         {stats.map((stat) => (
// // //           <StatsCard key={stat.title} {...stat} />
// // //         ))}
// // //       </div>

// // //       <QuickActions />

// // //       {/* Two Column Layout */}
// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
// // //         <UpcomingExams exams={upcomingExams} />
// // //         <RecentActivity activities={activity} />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AdminDashboardPage;

// // import React, { useCallback, useEffect, useRef } from 'react';
// // import {
// //   FaUsers as Users,
// //   FaBookOpen as BookOpen,
// //   FaChartBar as BarChart,
// //   FaCalendar as Calendar
// // } from 'react-icons/fa';
// // import StatsCard from '../components/dashboard/StatsCard';
// // import UpcomingExams from '../components/dashboard/UpcomingExams';
// // import RecentActivity from '../components/dashboard/RecentActivity';
// // import QuickActions from '../components/dashboard/QuickActions';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { getExams } from '../redux/actions/examActions';
// // import { getAllStudents, getStudentsActivity } from '../redux/actions/studentActions';

// // const AdminDashboardPage = () => {
// //   const { exams, submittedData } = useSelector(state => state.exams);
// //   const { students, activity } = useSelector(state => state.studentState);

// //   const dispatch = useDispatch();
// //   const hasFetchedExams = useRef(false);

// //   const fetchExams = useCallback(async () => {
// //     try {
// //       await dispatch(getExams());
// //       await dispatch(getAllStudents());
// //       await dispatch(getStudentsActivity());
// //     } catch (error) {
// //       console.error('Failed to fetch exams:', error);
// //     }
// //   }, [dispatch]);

// //   useEffect(() => {
// //     if (!hasFetchedExams.current) {
// //       fetchExams();
// //       hasFetchedExams.current = true;
// //     }
// //   }, [dispatch, fetchExams]);

// //   useEffect(() => {
// //     console.log("📊 All Exams:", exams);
// //     console.log("✅ Submitted Data:", submittedData);
// //     console.log("🔥 Activity Data:", activity);
// //   }, [exams, submittedData, activity]);

// //   const today = new Date();
// //   today.setHours(0, 0, 0, 0);

  
// //   // Active exams: exams scheduled for today, regardless of submissions
// //   const activeExams = Array.isArray(exams) ? exams.filter(exam => {
// //     if (!exam || !exam.date || !exam._id) return false;
// //     const examDate = new Date(exam.date);
// //     return examDate.toDateString() === today.toDateString();
// //   }) : [];

// //   // Upcoming exams
// //   // const upcomingExams = Array.isArray(exams)
// //   //   ? exams.filter(exam => {
// //   //       if (!exam?.date || !exam._id) return false;

// //   //       const examDate = new Date(exam.date);
// //   //       const isFuture = examDate > today;
// //   //       const isToday = examDate.toDateString() === today.toDateString();

// //   //       const isAlreadySubmitted = Array.isArray(submittedData) && submittedData.some(sub => {
// //   //         if (!sub || !sub.examId) return false;
// //   //         const submittedExamId = typeof sub.examId === 'object' ? sub.examId._id : sub.examId;
// //   //         return submittedExamId?.toString() === exam._id.toString();
// //   //       });

// //   //       return isFuture && !isAlreadySubmitted && !isToday;
// //   //     })
// //   //   : [];

// //   const upcomingExams = exams.filter(exam => {
// //   const examDate = new Date(exam.date);
// //   const isFuture = examDate > today;
// //   const isToday = examDate.toDateString() === today.toDateString();

// //   // 🔹 Do NOT filter by submissions
// //   return isFuture && !isToday;
// // });


// //   // Completion Rate Logic
// //   const totalStudents = students ? students.length : 0;
// //   const totalExams = exams ? exams.length : 0;

// //   // Map examId to students who completed the exam
// //   const examCompletionDetails = exams.map(exam => {
// //   const examId = exam._id;
// //   const completedStudents = submittedData?.filter(sub => {
// //     const submittedExamId = sub?.examId?._id || sub?.examId;
// //     return submittedExamId?.toString() === examId.toString();
// //   }) || [];

// //   return {
// //     examName: exam.name || "No Title Provided", // Ensure fallback for missing titles
// //     completedStudentsCount: completedStudents.length,
// //     totalStudents: totalStudents,
// //     completionRate: totalStudents > 0
// //       ? ((completedStudents.length / totalStudents) * 100).toFixed(0) + '%'
// //       : '0%',
// //   };
// // });

// //   // Calculate overall completion rate
// //   const totalCompletions = Array.from(
// //     examCompletionDetails.map(detail => detail.completedStudentsCount)
// //   ).reduce((acc, completed) => acc + (completed / totalStudents), 0);

// //   const completionRate =
// //     totalExams > 0
// //       ? ((totalCompletions / totalExams) * 100).toFixed(0) + '%'
// //       : '0%';

// //   // Example: Display Completion Rate for Each Exam in UI
// //   const examStats = examCompletionDetails.map(detail => ({
// //     title: `${detail.examName} Exam Completion Rate`, // Updated to show exam name in title
// //     value: `${detail.completedStudentsCount}/${detail.totalStudents} (${detail.completionRate})`,
// //     icon: BarChart,
// //     bgColor: "bg-yellow-500/[0.6]"
// //   }));

// //   // Overall Stats
// //   const stats = [
// //     { title: 'Total Students', value: totalStudents, icon: Users, bgColor: "bg-blue-500/[0.6]" },
// //     { title: 'Active Exams', value: activeExams.length, icon: BookOpen, bgColor: "bg-red-500/[0.6]" },
// //     // { title: 'Overall Completion Rate', value: completionRate, icon: BarChart, bgColor: "bg-lime-500/[0.6]" },
// //     { title: 'Upcoming Exams', value: upcomingExams.length, icon: Calendar, bgColor: "bg-cyan-500/[0.6]" },
// //     ...examStats // Add per exam stats
// //   ];

// //   return (
// //     <div>
// //       {/* Stats Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pt-12 items-center mt-8 pb-16">
// //         {stats.map((stat) => (
// //           <StatsCard key={stat.title} {...stat} />
// //         ))}
// //       </div>

// //       <QuickActions />

// //       {/* Two Column Layout */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
// //         <UpcomingExams exams={upcomingExams} />
// //         <RecentActivity activities={activity} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboardPage;


// import React, { useCallback, useEffect, useRef } from 'react';
// import { FaUsers as Users, FaBookOpen as BookOpen, FaChartBar as BarChart, FaCalendar as Calendar } from 'react-icons/fa';
// import StatsCard from '../components/dashboard/StatsCard';
// import UpcomingExams from '../components/dashboard/UpcomingExams';
// import RecentActivity from '../components/dashboard/RecentActivity';
// import QuickActions from '../components/dashboard/QuickActions';
// import { useDispatch, useSelector } from 'react-redux';
// import { getExams } from '../redux/actions/examActions';
// import { getAllStudents, getStudentsActivity } from '../redux/actions/studentActions';

// const AdminDashboardPage = () => {
//   const { exams, submittedData } = useSelector(state => state.exams);
//   const { students, activity } = useSelector(state => state.studentState);

//   const dispatch = useDispatch();
//   const hasFetchedExams = useRef(false);

//   const fetchExams = useCallback(async () => {
//     try {
//       await dispatch(getExams());
//       await dispatch(getAllStudents());
//       await dispatch(getStudentsActivity());
//     } catch (error) {
//       console.error('Failed to fetch exams:', error);
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (!hasFetchedExams.current) {
//       fetchExams();
//       hasFetchedExams.current = true;
//     }
//   }, [dispatch, fetchExams]);

//   const now = new Date();
//   now.setHours(0, 0, 0, 0);

//   const activeExams = exams?.filter(exam => {
//     const examDate = new Date(exam.date);
//     const expireDate = new Date(examDate.getTime() + 24 * 60 * 60 * 1000);
//     return examDate.toDateString() === now.toDateString() && now <= expireDate;
//   }) || [];

//   const upcomingExams = exams?.filter(exam => {
//     const examDate = new Date(exam.date);
//     const expireDate = new Date(examDate.getTime() + 24 * 60 * 60 * 1000);
//     return examDate > now && now <= expireDate;
//   }) || [];

//   const totalStudents = students ? students.length : 0;

//   const examCompletionDetails = exams.map(exam => {
//     const examId = exam._id;
//     const completedStudents = submittedData?.filter(sub => {
//       const submittedExamId = sub?.examId?._id || sub?.examId;
//       return submittedExamId?.toString() === examId.toString();
//     }) || [];

//     return {
//       examName: exam.name,
//       completedStudentsCount: completedStudents.length,
//       totalStudents,
//       completionRate: totalStudents > 0
//         ? ((completedStudents.length / totalStudents) * 100).toFixed(0) + '%'
//         : '0%',
//     };
//   });

//   const stats = [
//     { title: 'Total Students', value: totalStudents, icon: Users, bgColor: "bg-blue-500/[0.6]" },
//     { title: 'Active Exams', value: activeExams.length, icon: BookOpen, bgColor: "bg-red-500/[0.6]" },
//     { title: 'Upcoming Exams', value: upcomingExams.length, icon: Calendar, bgColor: "bg-cyan-500/[0.6]" },
//     ...examCompletionDetails.map(detail => ({
//       title: `${detail.examName} Completion`,
//       value: `${detail.completedStudentsCount}/${detail.totalStudents} (${detail.completionRate})`,
//       icon: BarChart,
//       bgColor: "bg-yellow-500/[0.6]"
//     }))
//   ];

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pt-12 items-center mt-8 pb-16">
//         {stats.map((stat) => (
//           <StatsCard key={stat.title} {...stat} />
//         ))}
//       </div>

//       <QuickActions />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         <UpcomingExams exams={upcomingExams} />
//         <RecentActivity activities={activity} />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardPage;



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

  const activeExams = exams?.filter(exam => {
    const examDate = new Date(exam.date);
    const expireDate = new Date(examDate.getTime() + 24 * 60 * 60 * 1000);
    return examDate.toDateString() === now.toDateString() && now <= expireDate;
  }) || [];

  const upcomingExams = exams?.filter(exam => {
    const examDate = new Date(exam.date);
    const expireDate = new Date(examDate.getTime() + 24 * 60 * 60 * 1000);
    return examDate > now && examDate.toDateString() !== now.toDateString() && now <= expireDate;
  }) || [];

  const totalStudents = students ? students.length : 0;

  const examCompletionDetails = exams.map(exam => {
    const examId = exam._id;
    const completedStudents = submittedData?.filter(sub => {
      const submittedExamId = sub?.examId?._id || sub?.examId;
      return submittedExamId?.toString() === examId.toString();
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
      title: `${detail.examName} Completion`,
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
