import React from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import SingleCardBooked from "./SingleCardBooked";
import { Link } from "react-router";

const BookedSession = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["booked-sessions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/booked-sessions?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading sessions</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Booked Sessions ({data.length})</h1>
      
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't booked any sessions yet.</p>
          <Link 
            to="/sessions" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Browse Available Sessions
          </Link>
        </div>
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