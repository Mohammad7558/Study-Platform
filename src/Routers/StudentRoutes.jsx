import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Spinner from "../Components/Spinner/Spinner";

const StudentRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isRoleLoading } = useUserRole();
  const location = useLocation();

  if (loading || isRoleLoading) {
    return <Spinner />;
  }

  if (!user || role !== 'student') {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default StudentRoutes;