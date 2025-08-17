import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../Components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  FiUsers, 
  FiBook, 
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiMessageSquare,
  FiSettings,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import useAuth from '../../../Hooks/useAuth';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TutorDashboard = () => {
  const { user } = useAuth();
  
  // Fetch tutor stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['tutorStats', user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/tutor/stats?email=${user?.email}`);
      return res.json();
    }
  });

  // Fetch upcoming sessions
  const { data: upcomingSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['upcomingSessions', user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/tutor/upcoming-sessions?email=${user?.email}`);
      return res.json();
    }
  });

  // Fetch recent students
  const { data: recentStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ['recentStudents', user?.email],
    queryFn: async () => {
      const res = await fetch(`/api/tutor/recent-students?email=${user?.email}`);
      return res.json();
    }
  });

  // Mock data for chart (replace with real data from your API)
  const earningsData = [
    { month: 'Jan', earnings: 1200 },
    { month: 'Feb', earnings: 1900 },
    { month: 'Mar', earnings: 1500 },
    { month: 'Apr', earnings: 1800 },
    { month: 'May', earnings: 2100 },
    { month: 'Jun', earnings: 2400 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Dashboard Content */}
      <main className="flex-1 p-4 sm:p-6">
        {/* Welcome Banner */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              Welcome back, {user?.displayName || 'Tutor'}!
            </CardTitle>
            <CardDescription className="text-blue-100">
              {sessionsLoading ? (
                <Skeleton className="h-4 w-3/4" />
              ) : (
                upcomingSessions?.length > 0
                  ? `You have ${upcomingSessions.length} upcoming sessions. Next session at ${upcomingSessions[0]?.time}.`
                  : "You have no upcoming sessions scheduled."
              )}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Students
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FiUsers className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
                  <div className="flex items-center text-sm text-green-500">
                    <FiTrendingUp className="mr-1 h-4 w-4" />
                    {stats?.studentGrowth || 0}% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Active Courses
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <FiBook className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeCourses || 0}</div>
                  <div className="flex items-center text-sm text-green-500">
                    <FiTrendingUp className="mr-1 h-4 w-4" />
                    {stats?.courseGrowth || 0}% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Hours Taught
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <FiClock className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.hoursTaught || 0}</div>
                  <div className="flex items-center text-sm text-green-500">
                    <FiTrendingUp className="mr-1 h-4 w-4" />
                    {stats?.hoursGrowth || 0}% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Earnings
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                    <FiDollarSign className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats?.earnings?.toLocaleString() || 0}</div>
                  <div className={`flex items-center text-sm ${stats?.earningsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats?.earningsGrowth >= 0 ? (
                      <FiTrendingUp className="mr-1 h-4 w-4" />
                    ) : (
                      <FiTrendingDown className="mr-1 h-4 w-4" />
                    )}
                    {Math.abs(stats?.earningsGrowth || 0)}% from last month
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Earnings Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monthly Earnings</CardTitle>
            <CardDescription>Your earnings over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Sessions and Recent Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your next teaching appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center p-3 border rounded-lg">
                      <Skeleton className="h-12 w-12 rounded-lg mr-4" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingSessions?.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 4).map((session) => (
                    <div key={session._id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
                        <FiCalendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{session.studentName}</h4>
                        <p className="text-sm text-gray-500 truncate">{session.courseName}</p>
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap ml-2">
                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming sessions scheduled
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>Students you've recently taught</CardDescription>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center p-3 border rounded-lg">
                      <Skeleton className="h-9 w-9 rounded-full mr-4" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentStudents?.length > 0 ? (
                <div className="space-y-3">
                  {recentStudents.slice(0, 4).map((student) => (
                    <div key={student._id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarFallback>
                          {student.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{student.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{student.email}</p>
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap ml-2">
                        {student.lastSessionDate ? 
                          new Date(student.lastSessionDate).toLocaleDateString() : 
                          'New'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent students to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TutorDashboard;