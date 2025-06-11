import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateToInput } from '../../utils/dateUtils';

const UpcomingExams = ({ exams = [] }) => {
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Midnight

  const upcomingExams = exams.filter((exam) => {
    const examDate = new Date(exam.date);
    return examDate >= today;
  });

  const handleView = (id) => {
    navigate(`/admin/dashboard/exams/${id}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-64 scrollbar-hide">
      <h2 className="text-lg font-semibold mb-4">Upcoming Exams</h2>
      <div className="space-y-4">
        {upcomingExams.length > 0 ? (
          upcomingExams.map((exam) => (
            <div
              key={exam._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{exam.name}</h3>
                <p className="text-sm text-gray-500">
                                        {formatDateToInput(exam.date)}   
                                    </p>
              </div>
              <button
                onClick={() => handleView(exam._id)}
                className="w-32 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming exams found.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingExams;
