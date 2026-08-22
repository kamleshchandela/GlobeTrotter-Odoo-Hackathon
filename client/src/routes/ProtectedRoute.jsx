import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ redirectTo = "/auth/login" }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // Consider a user authenticated if they have a token or are authenticated in the store
  if (!isAuthenticated && !token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
