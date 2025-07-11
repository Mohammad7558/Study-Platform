import React from "react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const SingleMySession = ({ session, refetch }) => {
  const axiosSecure = useAxiosSecure();

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
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    rejected:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const handleRequestAgain = async () => {
    try {
      const res = await axiosSecure.patch(`/sessions/request-again/${_id}`);
      if (res.data.modifiedCount > 0) {
        await Swal.fire({
          icon: "success",
          title: "Request Sent!",
          text: "Your session request has been sent for approval again.",
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire({
          icon: "info",
          title: "No Changes",
          text: "Request could not be sent again.",
        });
      }
    } catch (error) {
      const msg =
        error?.response?.data?.error || error.message || "Something went wrong.";
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: msg,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-bold text-cyan-600 mb-1">{title}</h2>

      <p className="text-gray-800 dark:text-gray-300 mb-1">
        <span className="font-medium">Tutor:</span> {tutorName}
      </p>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 space-y-1">
        <p>
          <span className="font-medium">Reg. Start:</span>{" "}
          {format(regStart, "PPP")}
        </p>
        <p>
          <span className="font-medium">Reg. End:</span>{" "}
          {format(regEnd, "PPP")}
        </p>
        <p>
          <span className="font-medium">Class Start:</span>{" "}
          {format(new Date(classStartDate), "PPP")}
        </p>
        <p>
          <span className="font-medium">Class End:</span>{" "}
          {format(new Date(classEndDate), "PPP")}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            isOngoing
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {isOngoing ? "Registration: Ongoing" : "Registration: Closed"}
        </span>

        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            statusColorMap[status] || "bg-gray-100 text-gray-800"
          }`}
        >
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {status === "rejected" && (
        <button
          onClick={handleRequestAgain}
          className="mt-2 inline-block px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition"
          type="button"
        >
          Request Again
        </button>
      )}
    </div>
  );
};

export default SingleMySession;
