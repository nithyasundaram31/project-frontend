import { FaEdit, FaTrash, FaSpinner, FaEye } from "react-icons/fa";

const ExamTable = ({ exams, isLoading, onEdit, onDelete, onView }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const getExamStatus = (examDate) => {
    const examDateObj = new Date(examDate);
    const expireDate = new Date(examDateObj.getTime() + 24 * 60 * 60 * 1000);

    if (now > expireDate) return { status: 'Expired', colorClass: 'text-gray-500' };
    if (examDateObj.toDateString() === now.toDateString()) return { status: 'Active', colorClass: 'text-green-500' };
    if (examDateObj > now) return { status: 'Upcoming', colorClass: 'text-blue-500' };
    return { status: 'Completed', colorClass: 'text-red-500' };
  };

  return (
    <div className="container mx-auto p-2 mb-16">
      {isLoading ? (
        <div className="text-center">
          <FaSpinner className="animate-spin text-gray-500" size={24} />
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg">
          <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-sm">
                <th className="px-4 py-2 border">Sl No</th>
                <th className="px-4 py-2 border">Exam Name</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Duration (min)</th>
                <th className="px-4 py-2 border">Total Marks</th>
                <th className="px-4 py-2 border">Total Questions</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams && exams.length > 0 ? (
                exams.map((exam, index) => {
                  const { status, colorClass } = getExamStatus(exam.date);
                  return (
                    <tr key={exam._id}>
                      <td className="px-4 py-2 border text-center">{index + 1}</td>
                      <td className="px-4 py-2 border text-center">{exam.name}</td>
                      <td className="px-4 py-2 border text-center">
                        {new Date(exam.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border text-center">{exam.duration}</td>
                      <td className="px-4 py-2 border text-center">{exam.totalMarks}</td>
                      <td className="px-4 py-2 border text-center">{exam.totalQuestions}</td>
                      <td className="px-4 py-2 border text-center">{exam.description}</td>
                      <td className={`px-4 py-2 border text-center ${colorClass}`}>{status}</td>
                      <td className="px-4 py-2 border text-center">
                        <div className="flex justify-center">
                          <button onClick={() => onView(exam._id)} className="text-blue-500 hover:text-blue-700 mr-3"><FaEye /></button>
                          <button onClick={() => onEdit(exam._id)} className="text-blue-500 hover:text-blue-700 mr-3"><FaEdit /></button>
                          <button onClick={() => onDelete(exam._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-6 border text-center text-gray-500">
                    No exams found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamTable;

