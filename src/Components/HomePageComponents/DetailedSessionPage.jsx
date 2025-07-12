import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  ClockIcon, 
  CalendarIcon, 
  UserIcon, 
  CheckIcon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";
import useUserRole from "../../Hooks/useUserRole";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const DetailedSessionPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { role, isRoleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);

  // Get single session data
  const { data: session, isLoading } = useQuery({
    queryKey: ["sessionDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/session/${id}`);
      return res.data;
    },
  });

  // Get reviews for this session
  const { data: reviews = [] } = useQuery({
    queryKey: ["sessionReviews", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?sessionId=${id}`);
      return res.data;
    },
  });

  // Check if user already booked this session
  useEffect(() => {
    const checkAlreadyBooked = async () => {
      if (user?.email && id) {
        try {
          const res = await axiosSecure.get(
            `/booked-sessions/check?sessionId=${id}&email=${user.email}`
          );
          setIsAlreadyBooked(res.data?.booked);
        } catch (error) {
          console.error("Booking check failed", error);
        }
      }
    };
    checkAlreadyBooked();
  }, [user?.email, id, axiosSecure]);

  if (isLoading || isRoleLoading) {
    return <div className="text-center mt-10">Loading session details...</div>;
  }

  if (!session) {
    return <div className="text-center mt-10">Session not found</div>;
  }

  const {
    _id,
    title,
    tutorName,
    tutorEmail,
    description,
    registrationStartDate,
    registrationEndDate,
    classStartDate,
    classEndDate,
    duration,
    registrationFee,
    sessionType,
    price
  } = session;

  // Date calculations
  const now = new Date();
  const regStart = new Date(registrationStartDate);
  const regEnd = new Date(registrationEndDate);
  const clsStart = new Date(classStartDate);
  const clsEnd = new Date(classEndDate);

  // Determine session status
  let currentStatus = "";
  let statusColor = "";
  let statusIcon = null;

  if (now < regStart) {
    currentStatus = "Upcoming";
    statusColor = "bg-blue-100 text-blue-800";
    statusIcon = <ClockIcon className="h-5 w-5 text-blue-500" />;
  } else if (now >= regStart && now <= regEnd) {
    currentStatus = "Registration Open";
    statusColor = "bg-green-100 text-green-800";
    statusIcon = <CheckIcon className="h-5 w-5 text-green-500" />;
  } else if (now > regEnd && now < clsStart) {
    currentStatus = "Registration Closed";
    statusColor = "bg-yellow-100 text-yellow-800";
    statusIcon = <XMarkIcon className="h-5 w-5 text-yellow-500" />;
  } else if (now >= clsStart && now <= clsEnd) {
    currentStatus = "In Progress";
    statusColor = "bg-purple-100 text-purple-800";
    statusIcon = <ClockIcon className="h-5 w-5 text-purple-500" />;
  } else {
    currentStatus = "Completed";
    statusColor = "bg-gray-100 text-gray-800";
    statusIcon = <CheckIcon className="h-5 w-5 text-gray-500" />;
  }

  const canBook = (
    now >= regStart && 
    now <= regEnd && 
    role === "student" && 
    !isAlreadyBooked && 
    user?.email
  );

  const handleBooking = async () => {
    try {
      const bookedData = {
        sessionId: _id,
        title,
        tutorName,
        tutorEmail,
        studentName: user.displayName,
        studentEmail: user.email,
        studentPhotoUrl: user.photoURL,
        registrationDate: new Date().toISOString(),
        status: "registered",
        sessionType,
        price
      };

      const res = await axiosSecure.post("/booked-sessions", bookedData);

      if (res.status === 409) {
        Swal.fire("Already Booked", "You've already booked this session", "info");
        return;
      }

      if (res.data.insertedId) {
        Swal.fire("Success", "Session booked successfully!", "success");
        setIsAlreadyBooked(true);
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Booking failed", "error");
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <UserIcon className="h-5 w-5 mr-1" />
          <span>Tutor: {tutorName} ({tutorEmail})</span>
        </div>
        
        <p className="text-gray-700 mb-6">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
              Registration Period
            </h3>
            <p>Start: {new Date(registrationStartDate).toLocaleDateString()}</p>
            <p>End: {new Date(registrationEndDate).toLocaleDateString()}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
              Class Period
            </h3>
            <p>Start: {new Date(classStartDate).toLocaleDateString()}</p>
            <p>End: {new Date(classEndDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor} flex items-center`}>
            {statusIcon}
            <span className="ml-1">{currentStatus}</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            Duration: {duration}
          </div>
          <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            Fee: {registrationFee === 0 ? "Free" : `$${registrationFee}`}
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={!canBook}
          className={`px-6 py-3 rounded-md font-medium ${
            canBook
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {isAlreadyBooked
            ? "Already Booked"
            : canBook
            ? "Book Now"
            : "Registration Closed"}
        </button>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold mr-2">{averageRating.toFixed(1)}</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={`avg-star-${i}`} className="text-yellow-400">
                    {i < Math.round(averageRating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-gray-500 ml-2">({reviews.length} reviews)</span>
            </div>

            {reviews.map((review) => (
              <div key={`review-${review._id}`} className="border-b pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <img 
                    src={review.studentPhotoUrl || "https://i.ibb.co/M1q7YVw/default-user.png"} 
                    alt={review.studentName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{review.studentName}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={`review-${review._id}-star-${i}`}>
                            {i < review.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{review.reviewText}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default DetailedSessionPage;