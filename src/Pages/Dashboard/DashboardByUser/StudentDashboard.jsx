import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../Components/ui/card';
import { BookOpen, Calendar, Clock, Award, BarChart2, FileText } from 'lucide-react';
import { Progress } from '../../../Components/ui/progress';
import { Button } from '../../../Components/ui/button';
import useAuth from '../../../Hooks/useAuth';

const StudentDashboard = () => {
  // Sample data
  const {user} = useAuth();
  const ongoingCourses = [
    { id: 1, title: 'Advanced Algorithms', code: 'CS-401', progress: 68, instructor: 'Dr. Smith' },
    { id: 2, title: 'Data Structures', code: 'CS-301', progress: 45, instructor: 'Prof. Johnson' },
  ];

  const upcomingAssignments = [
    { id: 1, course: 'Advanced Algorithms', title: 'Graph Theory Project', dueDate: 'Tomorrow', priority: 'high' },
    { id: 2, course: 'Data Structures', title: 'Binary Trees Quiz', dueDate: 'In 3 days', priority: 'medium' },
  ];

  const recentGrades = [
    { id: 1, course: 'Database Systems', assignment: 'Midterm Exam', grade: 'A-', score: '90/100' },
    { id: 2, course: 'Operating Systems', assignment: 'Project 1', grade: 'B+', score: '87/100' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Welcome back, {user?.displayName}</h1>
        <p className="text-gray-600">Here's what's happening with your courses today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500">+2 from last semester</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">Due this week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B+</div>
            <p className="text-xs text-gray-500">3.4 GPA</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ongoing Courses */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Ongoing Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ongoingCourses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.code} • {course.instructor}</p>
                  </div>
                  <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                    {course.progress}%
                  </span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              View All Courses
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  assignment.priority === 'high' ? 'bg-red-100 text-red-600' : 
                  assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.course}</p>
                </div>
                <div className="text-sm text-gray-500">{assignment.dueDate}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Grades
            </CardTitle>
            <CardDescription>Your most recent graded assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentGrades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.assignment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          grade.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                          grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;