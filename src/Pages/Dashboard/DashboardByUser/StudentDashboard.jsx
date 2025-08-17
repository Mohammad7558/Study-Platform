import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../Components/ui/card";
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  BarChart2,
  FileText,
  Users,
  BookmarkIcon,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Progress } from "../../../Components/ui/progress";
import { Button } from "../../../Components/ui/button";
import { Alert, AlertDescription } from "../../../Components/ui/alert";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Link } from "react-router";

const StudentDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Data states
  const [dashboardStats, setDashboardStats] = useState({});
  const [ongoingSessions, setOngoingSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentPerformance, setRecentPerformance] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all data in parallel
        const [
          statsResponse,
          ongoingResponse,
          upcomingResponse,
          performanceResponse,
          notesResponse,
        ] = await Promise.all([
          axiosSecure.get("/student/dashboard-stats"),
          axiosSecure.get("/student/ongoing-sessions"),
          axiosSecure.get("/student/upcoming-sessions"),
          axiosSecure.get("/student/recent-performance"),
          axiosSecure.get("/student/recent-notes?limit=5"),
          axiosSecure.get("/student/study-materials"),
        ]);

        setDashboardStats(statsResponse.data);
        setOngoingSessions(ongoingResponse.data);
        setUpcomingSessions(upcomingResponse.data);
        setRecentPerformance(performanceResponse.data);
        setRecentNotes(notesResponse.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchDashboardData();
    }
  }, [user?.email, axiosSecure]);

  // Calculate average rating for performance display
  const averageRating =
    recentPerformance.length > 0
      ? (
          recentPerformance.reduce((sum, perf) => sum + perf.rating, 0) /
          recentPerformance.length
        ).toFixed(1)
      : 0;

  const getGradeFromRating = (rating) => {
    if (rating >= 4.5) return "A";
    if (rating >= 4.0) return "A-";
    if (rating >= 3.5) return "B+";
    if (rating >= 3.0) return "B";
    if (rating >= 2.5) return "B-";
    if (rating >= 2.0) return "C+";
    return "C";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const getGradeColor = (rating) => {
    if (rating >= 4.0) return "bg-green-100 text-green-800";
    if (rating >= 3.0) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return (
      <div className="lg:p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:p-6 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="lg:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.displayName}
        </h1>
        <p className="text-gray-600">
          Here's your learning progress and upcoming activities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalBookedSessions || 0}
            </div>
            <p className="text-xs text-gray-500">
              {dashboardStats.ongoingSessionsCount || 0} ongoing
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Deadlines
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.upcomingDeadlines || 0}
            </div>
            <p className="text-xs text-gray-500">Due this week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getGradeFromRating(averageRating)}
            </div>
            <p className="text-xs text-gray-500">{averageRating} / 5.0</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Notes</CardTitle>
            <BookmarkIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalNotes || 0}
            </div>
            <p className="text-xs text-gray-500">
              {dashboardStats.totalReviews || 0} reviews given
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ongoing Sessions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Ongoing Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ongoingSessions.length > 0 ? (
              ongoingSessions.map((session) => (
                <div key={session._id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{session.title}</h3>
                      <p className="text-sm text-gray-600">
                        {session.tutorName} • {session.duration} hours
                      </p>
                    </div>
                    <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                      {session.progress}%
                    </span>
                  </div>
                  <Progress value={session.progress} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No ongoing sessions
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/booked-sessions">
              <Button variant="ghost" className="w-full">
                View All Sessions
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${getPriorityColor(
                      session.priority
                    )}`}
                  >
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.tutorName}</p>
                  </div>
                  <div className="text-sm text-gray-500">{session.dueText}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No upcoming sessions
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Performance
            </CardTitle>
            <CardDescription>
              Your ratings and feedback from recent sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPerformance.length > 0 ? (
              <div className="space-y-3">
                {recentPerformance.slice(0, 3).map((performance) => (
                  <div
                    key={performance.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {performance.sessionTitle}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {performance.tutorName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(
                          performance.rating
                        )}`}
                      >
                        {getGradeFromRating(performance.rating)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {performance.rating}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No performance data yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookmarkIcon className="h-5 w-5" />
              Recent Study Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length > 0 ? (
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div
                    key={note._id}
                    className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <h4 className="font-medium text-sm">{note.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {note.description || note.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No notes created yet
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Link to='/dashboard/manage-notes'>
              <Button
                variant="ghost"
                className="w-full"
              >
                View All Notes
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Study Materials Section */}
    </div>
  );
};

export default StudentDashboard;
