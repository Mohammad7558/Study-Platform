import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../Components/ui/card';
import { Skeleton } from '../../Components/ui/skeleton';
import useAuth from '../../Hooks/useAuth';
import useUserRole from '../../Hooks/useUserRole'; // Import the hook
import AdminDashboard from './DashboardByUser/AdminDashboard';
import TutorDashboard from './DashboardByUser/TutorDashboard';
import StudentDashboard from './DashboardByUser/StudentDashboard';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, isRoleLoading } = useUserRole();

  // Combined loading state
  const isLoading = authLoading || isRoleLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {role === 'admin' && <AdminDashboard />}
      {role === 'tutor' && <TutorDashboard />}
      {role === 'student' && <StudentDashboard />}
    </div>
  );
};

export default Dashboard;