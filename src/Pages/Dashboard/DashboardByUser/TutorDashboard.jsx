import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../Components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  FiHome, 
  FiBook, 
  FiUsers, 
  FiCalendar, 
  FiMessageSquare, 
  FiSettings, 
  FiDollarSign, 
  FiPieChart,
  FiArrowUp,
  FiClock,
  FiAward
} from 'react-icons/fi';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import useAuth from '../../../Hooks/useAuth';

const TutorDashboard = () => {
  const { user } = useAuth();
  
  // Mock data
  const stats = [
    { title: "Total Students", value: "42", icon: <FiUsers className="h-5 w-5" />, trend: "12%", trendUp: true },
    { title: "Active Courses", value: "5", icon: <FiBook className="h-5 w-5" />, trend: "3%", trendUp: true },
    { title: "Hours Taught", value: "128", icon: <FiClock className="h-5 w-5" />, trend: "24%", trendUp: true },
    { title: "Earnings", value: "$3,240", icon: <FiDollarSign className="h-5 w-5" />, trend: "8%", trendUp: false },
  ];

  const upcomingSessions = [
    { id: 1, student: "Alex Johnson", course: "Advanced Calculus", time: "Today, 3:00 PM" },
    { id: 2, student: "Maria Garcia", course: "Linear Algebra", time: "Tomorrow, 10:00 AM" },
    { id: 3, student: "Sam Wilson", course: "Physics 101", time: "Jul 20, 2:30 PM" },
  ];

  const recentStudents = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", course: "Advanced Calculus", avatar: "AJ" },
    { id: 2, name: "Maria Garcia", email: "maria@example.com", course: "Linear Algebra", avatar: "MG" },
    { id: 3, name: "Sam Wilson", email: "sam@example.com", course: "Physics 101", avatar: "SW" },
    { id: 4, name: "Taylor Smith", email: "taylor@example.com", course: "Statistics", avatar: "TS" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content - now full width since sidebar is removed */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Top Navigation */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <FiMessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <FiSettings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src={user?.photoURL || "https://github.com/shadcn.png"} />
              <AvatarFallback>
                {user?.displayName?.split(' ').map(n => n[0]).join('') || 'TU'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Banner - now using real user data */}
          <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back, {user?.displayName || 'Tutor'}!</CardTitle>
              <CardDescription className="text-indigo-100">
                You have {upcomingSessions.length} sessions scheduled for today. 
                {upcomingSessions.length > 0 ? ` Your next session starts at ${upcomingSessions[0].time}.` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="mt-2">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`flex items-center text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    <FiArrowUp className={`mr-1 h-4 w-4 ${!stat.trendUp && 'transform rotate-180'}`} />
                    {stat.trend} {stat.trendUp ? 'increase' : 'decrease'} from last month
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upcoming Sessions and Recent Students */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your next teaching appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
                        <FiCalendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{session.student}</h4>
                        <p className="text-sm text-gray-500">{session.course}</p>
                      </div>
                      <div className="text-sm text-gray-500">{session.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="ghost">View All Sessions</Button>
              </CardFooter>
            </Card>

            {/* Recent Students */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>Students you've recently taught</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <Avatar className="h-9 w-9 mr-4">
                        <AvatarFallback>{student.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <div className="text-sm text-gray-500">{student.course}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="ghost">View All Students</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorDashboard;