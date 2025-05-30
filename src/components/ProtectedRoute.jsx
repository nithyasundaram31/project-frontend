import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Optionally, you could allow 'role' to be a string or an array of strings for more flexibility.
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If 'role' is an array, check if user.role is included; if string, direct compare
  const hasRole = Array.isArray(role)
    ? role.includes(user?.role)
    : user?.role === role;

  if (!isAuthenticated || !hasRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;