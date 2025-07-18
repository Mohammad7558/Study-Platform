import React, { useState } from "react";
import { format } from "date-fns";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";
import { CalendarDays, User, RotateCw } from "lucide-react";
import { toast } from "sonner";

const SingleMySession = ({ session, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);

  const {
    _id,
    title,
    tutorName,
    registrationStartDate,
    registrationEndDate,
    classStartDate,
    classEndDate,
    status,
  } = session;

  const now = new Date();
  const regStart = new Date(registrationStartDate);
  const regEnd = new Date(registrationEndDate);
  const isOngoing = now >= regStart && now <= regEnd;

  const statusColorMap = {
    approved: "bg-green-100 text-green-800 hover:bg-green-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  const handleRequestAgain = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Resubmitting session...");
    
    try {
      const res = await axiosSecure.patch(`/sessions/request-again/${_id}`);
      
      if (res.data.modifiedCount > 0) {
        toast.success("Session resubmitted for approval", { id: toastId });
        refetch();
      } else {
        toast.info("The session request wasn't modified", { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to resubmit session", 
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold leading-none tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{tutorName}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Registration:</span>
            <span>
              {format(regStart, "PP")} - {format(regEnd, "PP")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Classes:</span>
            <span>
              {format(new Date(classStartDate), "PP")} -{" "}
              {format(new Date(classEndDate), "PP")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={isOngoing ? "default" : "secondary"}>
            {isOngoing ? "Registration Ongoing" : "Registration Closed"}
          </Badge>
          <Badge className={statusColorMap[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {status === "rejected" && (
          <Button
            onClick={handleRequestAgain}
            size="sm"
            className="mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <RotateCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RotateCw className="h-4 w-4 mr-2" />
            )}
            Request Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SingleMySession;