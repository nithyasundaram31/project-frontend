import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllStudents,
  deleteStudent,
  updateExamPermission,
  updateRole,
} from '../redux/actions/studentActions';
import StudentTable from '../components/StudentsTable';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const StudentsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students } = useSelector((state) => state.studentState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      await dispatch(getAllStudents());
      setIsLoading(false);
    };
    fetchStudents();
  }, [dispatch]);

  const handleDelete = async (id) => {
    setIsLoading(true);
    await dispatch(deleteStudent(id));
    await dispatch(getAllStudents());
    setIsLoading(false);
  };

  const togglePermission = async (id, currentPermission) => {
    setIsLoading(true);
    await dispatch(updateExamPermission(id, !currentPermission));
    await dispatch(getAllStudents());
    setIsLoading(false);
  };

  const handleView = (id) => {
    navigate(`/admin/dashboard/student-result/${id}`);
  };

  const handleRole = async (e, id) => {
    setIsLoading(true);
    const newRole = { role: e.target.value };
    await dispatch(updateRole(newRole, id));
    await dispatch(getAllStudents());
    setIsLoading(false);
  };

  return (
    <div className="mt-14 p-4">
      <h1 className="flex justify-center items-center text-xl text-blue-500 font-bold mb-4">
        Students List
      </h1>
      {isLoading && <div className="text-center text-blue-400">Loading...</div>}
      <StudentTable
        students={students}
        isLoading={isLoading}
        togglePermission={togglePermission}
        onView={handleView}
        onDelete={handleDelete}
        onRoleChange={handleRole}
      />
      <ToastContainer />
    </div>
  );
};

export default StudentsList;
