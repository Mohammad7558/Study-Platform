import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import SingleMySession from "./SingleMySession";
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Loader2 } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive font-medium">
          {error.message || "Failed to load sessions"}
        </p>
        <Button variant="outline" onClick={refetch} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessionData.length > 0 ? (
        sessionData.map((session) => (
          <SingleMySession
            key={session._id}
            session={session}
            refetch={refetch}
          />
        ))
      ) : (
        <Card className="col-span-full p-6 text-center">
          <p className="text-muted-foreground font-medium">
            No sessions found.
          </p>
        </Card>
      )}
    </div>
  );
};

export default MySessions;