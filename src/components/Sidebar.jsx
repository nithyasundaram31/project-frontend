import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarDay, FaUserGraduate, FaRegQuestionCircle, FaUserCircle, FaChartLine } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  // Base path depends on role
  const basePath = isAdmin ? "/admin/dashboard" : "/student/dashboard";

  return (
    <aside className={`w-[15%] z-10  p-14  ${isOpen ? 'block' : 'hidden'} lg:block`}>
      <div
        className={`fixed left-0 p-1 h-full bg-gradient-to-t from-green-500 to-indigo-600 text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col items-center justify-center  py-4">
          {isAuthenticated && user && user.role ? (
            <>
              <FaUserCircle size={64} />
              <span className="mt-3 text-lg uppercase font-semibold">{user.role}</span>
              <span className="mt-3 text-sm">{user.email}</span>
            </>
          ) : null}
        </div>
        <div className="flex flex-col h-full">
          <nav className="flex-1 p-4 space-y-4">
            <NavItem icon={<FaHome />} name="Dashboard" path={`${basePath}`} />
            <NavItem icon={<FaUser />} name="Profile" path={`${basePath}/profile`}/>
            {isAdmin ? (
              <>
                <NavItem icon={<FaCalendarDay />} name="Exams" path={`${basePath}/exams`} />
                <NavItem icon={<FaRegQuestionCircle />} name="Question Bank" path={`${basePath}/questions`} />
                <NavItem icon={<FaUserGraduate />} name="Students List" path={`${basePath}/students`} />
              </>
            ) : (
              <>
                <NavItem icon={<FaCalendarDay />} name="Exams" path={`${basePath}/exams`} />
                <NavItem icon={<FaChartLine />} name="Results" path={`${basePath}/results`} />
              </>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, name, path }) => {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        `group flex items-center space-x-4 p-2 rounded cursor-pointer ${
          isActive ? 'bg-indigo-700 text-white' : 'hover:bg-black text-gray-200'
        }`
      }
    >
      <div className="text-xl">{icon}</div>
      <span className="text-sm font-medium">{name}</span>
    </NavLink>
  );
};

export default Sidebar;
