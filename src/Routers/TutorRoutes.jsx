import React from 'react';
import useAuth from '../Hooks/useAuth';
import Spinner from '../Components/Spinner/Spinner';
import useUserRole from '../Hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const TutorRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isRoleLoading } = useUserRole();
  const location = useLocation();
  if (loading || isRoleLoading) {
    return <Spinner />;
  }
  if (!user || role !== 'tutor') {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default TutorRoutes;
