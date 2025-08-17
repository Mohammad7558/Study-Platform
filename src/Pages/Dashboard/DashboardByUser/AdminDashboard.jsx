import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  CardFooter 
} from "../../../Components/ui/card";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../Components/ui/skeleton";
import { Badge } from "../../../Components/ui/badge";
import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiRefreshCw,
  FiBarChart2,
  FiBook,
  FiCreditCard,
  FiHome,
  FiLoader,
  FiTrendingUp,
  FiPieChart,
  FiDatabase
} from "react-icons/fi";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../../Components/ui/table";
import { format } from "date-fns";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  
  // Fetch stats data
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats 
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/stats");
      return response.data;
    },
    refetchInterval: 30000 // Auto-refresh every 30 seconds
  });

  // Fetch recent activities
  const { 
    data: recentActivities, 
    isLoading: activitiesLoading, 
    error: activitiesError 
  } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/recent-activities?limit=5");
      return response.data;
    }
  });

  // Status badge component with icons
  const StatusBadge = ({ status }) => {
    const variantMap = {
      approved: "success",
      pending: "warning",
      rejected: "destructive",
      completed: "default",
      active: "success",
      inactive: "destructive",
      free: "secondary",
      paid: "default"
    };
    
    const iconMap = {
      approved: <FiCheckCircle className="mr-1 h-3 w-3" />,
      pending: <FiLoader className="mr-1 h-3 w-3" />,
      rejected: <FiXCircle className="mr-1 h-3 w-3" />,
      completed: <FiCheckCircle className="mr-1 h-3 w-3" />,
      active: <FiCheckCircle className="mr-1 h-3 w-3" />,
      inactive: <FiXCircle className="mr-1 h-3 w-3" />,
      free: <FiUser className="mr-1 h-3 w-3" />,
      paid: <FiDollarSign className="mr-1 h-3 w-3" />
    };
    
    return (
      <Badge variant={variantMap[status]}>
        <span className="flex items-center">
          {iconMap[status]}
          {status}
        </span>
      </Badge>
    );
  };

  // Stat card component to reduce repetition
  const StatCard = ({ title, value, icon, loading, description, className }) => {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch {
      return dateString;
    }
  };

  if (statsError || activitiesError) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiAlertCircle className="text-destructive" />
            Error Loading Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>{statsError?.message || activitiesError?.message}</p>
            <Button onClick={() => { refetchStats(); }} className="gap-2">
              <FiRefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FiHome className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <Button variant="outline" onClick={refetchStats} className="gap-2">
          <FiRefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<FiUsers className="h-4 w-4 text-muted-foreground" />}
          loading={statsLoading}
          description="All registered users"
        />
        <StatCard
          title="Tutors"
          value={stats?.totalTutors || 0}
          icon={<FiUserCheck className="h-4 w-4 text-muted-foreground" />}
          loading={statsLoading}
          description="Approved tutors"
        />
        <StatCard
          title="Students"
          value={stats?.totalStudents || 0}
          icon={<FiUser className="h-4 w-4 text-muted-foreground" />}
          loading={statsLoading}
          description="Registered students"
        />
        <StatCard
          title="Revenue"
          value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
          icon={<FiDollarSign className="h-4 w-4 text-muted-foreground" />}
          loading={statsLoading}
          description="Total earnings"
          className="bg-primary/5"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Sessions"
          value={stats?.totalSessions || 0}
          icon={<FiBook className="h-4 w-4 text-muted-foreground" />}
          loading={statsLoading}
          description="All created sessions"
        />
        <StatCard
          title="Bookings"
          value={stats?.totalBookings || 0}
          icon={<FiCreditCard className="h-4 w-4 text-muted-foreground" />}
          loading={statsLoading}
          description="Total bookings"
        />
        <StatCard
          title="Active Sessions"
          value={stats?.totalApprovedSessions || 0}
          icon={<FiCalendar className="h-4 w-4 text-muted-foreground" />}
          loading={statsLoading}
          description="Currently active"
        />
      </div>

      {/* Session Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiPieChart className="h-5 w-5" />
            Session Status Distribution
          </CardTitle>
          <CardDescription>Breakdown of all sessions by status</CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="flex space-x-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <StatusBadge status="approved" />
                <span className="font-medium">{stats?.totalApprovedSessions || 0}</span>
                <span className="text-sm text-muted-foreground">
                  ({(stats?.totalSessions ? Math.round((stats.totalApprovedSessions / stats.totalSessions) * 100) : 0)}%)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status="pending" />
                <span className="font-medium">{stats?.totalPendingSessions || 0}</span>
                <span className="text-sm text-muted-foreground">
                  ({(stats?.totalSessions ? Math.round((stats.totalPendingSessions / stats.totalSessions) * 100) : 0)}%)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status="rejected" />
                <span className="font-medium">{stats?.totalRejectedSessions || 0}</span>
                <span className="text-sm text-muted-foreground">
                  ({(stats?.totalSessions ? Math.round((stats.totalRejectedSessions / stats.totalSessions) * 100) : 0)}%)
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiCalendar className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>Latest session creations</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableBody>
                  {recentActivities?.recentSessions?.map((session) => (
                    <TableRow key={session._id}>
                      <TableCell className="font-medium">{session.title}</TableCell>
                      <TableCell>
                        <StatusBadge status={session.status} />
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {formatDate(session.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!recentActivities?.recentSessions || recentActivities.recentSessions.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No recent sessions
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" size="sm">
              View All Sessions
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Bookings */}

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiDollarSign className="h-5 w-5" />
              Recent Payments
            </CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableBody>
                  {recentActivities?.recentPayments?.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="font-medium">${payment.amount}</TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {formatDate(payment.paymentDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!recentActivities?.recentPayments || recentActivities.recentPayments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No recent payments
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" size="sm">
              View All Payments
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;