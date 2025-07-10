import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.email) {
      axiosSecure
        .get(`/users/${user.email}/role`)
        .then((res) => {
          setRole(res.data?.role || 'student');
          setIsRoleLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching role:', err);
          setRole('student');
          setIsRoleLoading(false);
        });
    } else if (!authLoading && !user) {
      setRole(null);
      setIsRoleLoading(false);
    }
  }, [user?.email, authLoading, axiosSecure, user]);

  return { role, isRoleLoading };
};

export default useUserRole;