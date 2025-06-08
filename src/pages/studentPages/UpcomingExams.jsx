import React, { useEffect, useRef, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaBookOpen,
  FaSpinner,
  FaQuestionCircle,
  FaPencilAlt,
  FaUserLock,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getExams } from '../../redux/actions/examActions';
import { formatDateToInput } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { getSubmitted } from '../../redux/actions/submitExam';

const UpcomingExams = () => {
  const { exams } = useSelector((state) => state.exams); //  From exams reducer
  const { submittedData } = useSelector((state) => state.examSubmit); //  From examSubmit reducer
  const { user } = useSelector((state) => state.auth); // From auth reducer

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFetchedExams = useRef(false);

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        await dispatch(getSubmitted());
        await dispatch(getExams());
      } finally {
        setIsLoading(false);
      }
    };

    if (!hasFetchedExams.current) {
      fetchExams();
      hasFetchedExams.current = true;
    }
  }, [dispatch]);   // Removed fetchExams from dependencies

  const handleView = (id) => {
    navigate(`/student/dashboard/exam-details/${id}`);
  };

  const todayDate = formatDateToInput(new Date());

  const upcomingExams = exams
    .filter((exam) => {
      const examDate = formatDateToInput(new Date(exam.date));
      const matchesDate = examDate >= todayDate;
      const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDate && matchesSearch;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="p-4 max-w-7xl mt-16 mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Exams</h1>
          <p className="text-gray-600">Keep track of your scheduled examinations</p>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-xs p-2 border border-blue-500 rounded-md"
          />
        </div>
      </div>
      <hr />
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin h-12 w-12 text-gray-500" />
        </div>
      ) : (
        <>
          {user?.role === 'student' && user?.examPermission !== true ? (
            upcomingExams.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
                <FaBookOpen className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600">No upcoming exams</p>
                <p className="text-sm text-gray-500">
                  When exams are scheduled, they will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
                {upcomingExams.map((exam, index) => {
                  const examDate = formatDateToInput(new Date(exam.date));
                  const userSubmission = submittedData?.find(
                    (sub) => sub.examId._id === exam._id
                  );

                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <h2 className="text-xl font-semibold text-gray-900">{exam.name}</h2>
                      <div className="grid gap-3 mt-4">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{examDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{exam.duration} mins</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaQuestionCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{exam.totalQuestions} Questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPencilAlt className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{exam.totalMarks} Marks</span>
                        </div>
                        {exam.description && (
                          <p className="mt-2 text-sm text-gray-600 truncate max-w-xs">
                            {exam.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-6 text-center">
                        <button
                          className={`px-4 py-2 ${
                            userSubmission
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold'
                          } rounded-md transition`}
                          onClick={() => (userSubmission ? null : handleView(exam._id))}
                          disabled={!!userSubmission}
                        >
                          {userSubmission
                            ? 'Exam Submitted'
                            : examDate === todayDate
                            ? 'Take Exam'
                            : 'Wait for the day'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="bg-red-50 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <FaUserLock className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-lg font-medium text-red-600">Exam Access Denied</p>
              <p className="text-sm text-red-500">
                You do not have permission to take exams at this time. Please contact the admin.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingExams;
