import React, { useEffect, useRef, useState } from 'react';
import {
  FaCalendarAlt, FaClock, FaBookOpen, FaSpinner, FaQuestionCircle, FaPencilAlt, FaUserLock
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getExams } from '../../redux/actions/examActions';
import { getSubmitted } from '../../redux/actions/submitExam';
import { formatDateToInput } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const UpcomingExams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { exams } = useSelector((state) => state.exams);
  const { submittedData } = useSelector((state) => state.examSubmit);
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
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
  }, [dispatch]);

  const handleView = (id) => {
    navigate(`/student/dashboard/exam-details/${id}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredExams = exams?.filter((exam) => {
    const examDate = new Date(exam.date);
    const expireDate = new Date(examDate.getTime() + 24 * 60 * 60 * 1000);
    return today <= expireDate;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="p-4 max-w-7xl mt-16 mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Exams</h1>
          <p className="text-gray-600">Keep track of your scheduled examinations</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin h-12 w-12 text-gray-500" />
        </div>
      ) : (
        <>
          {user?.role === 'student' && user?.examPermission !== true ? (
            filteredExams.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
                <FaBookOpen className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600">No upcoming exams</p>
                  <p className="text-sm text-gray-500">When exams are scheduled, they will appear here</p>
              </div>
            ) : (
              <>


              {/*  new notice box */}
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
                  <h3 className="font-semibold mb-2 text-black"> Important Notice:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                    <li>This exam will be available only for 24 hours after it becomes active.</li>
                    <li>Please make sure to attend and submit your exam before deadline.</li>
                    <li>After 24 hours, exam will be automatically closed .</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
                  {filteredExams.map((exam, index) => {
                    const examDate = new Date(exam.date);
                    const expireDate = new Date(examDate.getTime() + 24 * 60 * 60 * 1000);
                    const now = new Date();

                    const isExpired = now > expireDate;
                    const isToday = examDate.toDateString() === today.toDateString();
                    const isFuture = examDate > today;
                    const userSubmission = submittedData?.find(sub => sub.examId._id === exam._id);

                    return (
                      <div key={index} className="bg-white border border-gray-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-900">{exam.name}</h2>
                        <div className="grid gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{formatDateToInput(examDate)}</span>
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
                        </div>

                        <div className="mt-6 text-center">
                          <button
                            className={`px-4 py-2 ${userSubmission || isExpired ? 'bg-gray-400 cursor-not-allowed' : isToday ? 'bg-blue-600 text-white font-semibold' : 'bg-gray-400 text-black cursor-not-allowed'} rounded-md transition`}
                            onClick={() => (!userSubmission && !isExpired && isToday ? handleView(exam._id) : null)}
                            disabled={userSubmission || isExpired || (!isToday && isFuture)}
                          >
                            {userSubmission ? 'Exam Submitted' : isExpired ? 'Exam Ended' : isToday ? 'Take Exam' : 'Wait for the day'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )
          ) : (
            <div className="bg-red-50 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <FaUserLock className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-lg font-medium text-red-600">Exam Access Denied</p>
                <p className="text-sm text-red-500">You do not have permission to take exams at this time. Please contact the admin.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingExams;
