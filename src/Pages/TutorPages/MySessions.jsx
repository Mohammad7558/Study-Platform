import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import SingleMySession from "./SingleMySession";

const MySessions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    data: sessionData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mySessions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/current-user?email=${user?.email}`);
      return res.data;
    },
  });

  if (isLoading)
    return <p className="text-center mt-10 text-lg">Loading sessions...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        {error.message || "Failed to load sessions"}
      </p>
    );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessionData.length > 0 ? (
        sessionData.map((session) => (
          <SingleMySession
            key={session._id}
            session={session}
            refetch={refetch} // update হলে refetch এর জন্য ফাংশন পাঠাচ্ছি
          />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500 font-medium">
          No sessions found.
        </p>
      )}
    </div>
  );
};

export default MySessions;
