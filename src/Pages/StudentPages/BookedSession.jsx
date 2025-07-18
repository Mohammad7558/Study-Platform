import React from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import SingleCardBooked from "./SingleCardBooked";
import { Link } from "react-router";
import { Card } from "../../Components/ui/card";
import { Loader2, Calendar, User } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { FiLoader } from "react-icons/fi";

const BookedSession = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booked-sessions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/booked-sessions?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-8 w-8" />
        <p className="mt-4">Error loading sessions</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Your Booked Sessions
          <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {data.length}
          </span>
        </h1>
        <Button asChild variant="outline">
          <Link to="/sessions">
            <Calendar className="mr-2 h-4 w-4" />
            Browse Sessions
          </Link>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No sessions booked yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            You haven't booked any tutoring sessions yet.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/all-sessions">Find Available Sessions</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((session) => (
            <SingleCardBooked key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedSession;
