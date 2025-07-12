import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
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

  if (isLoading || isRoleLoading)
    return <p className="text-center mt-10">Loading...</p>;
  if (!session) return <p className="text-center mt-10">No session found</p>;

  const {
    _id,
    title,
    tutorName,
    description,
    registrationStartDate,
    registrationEndDate,
    classStartDate,
    classEndDate,
    duration,
    registrationFee,
  } = session;

  const now = new Date();
  const regStart = new Date(registrationStartDate);
  const regEnd = new Date(registrationEndDate);
  const isOngoing = regStart <= now && now <= regEnd;

  const canBook =
    isOngoing && role === "student" && !isAlreadyBooked && user?.email;

  const handleBooking = async (bookedSession) => {
    const { _id, ...rest } = bookedSession;
    const bookedData = {
      ...rest,
      sessionId: _id,
      studentName: user?.displayName,
      studentEmail: user?.email,
      studentPhotoUrl: user?.photoURL,
    };

    try {
      const res = await axiosSecure.post("/booked-sessions", bookedData);

      if (res.status === 409) {
        Swal.fire({
          icon: "info",
          title: "Already Booked",
          text: "You have already booked this session.",
        });
        return;
      }

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Session Booked!",
          text: "You have successfully booked the session.",
        });
        setIsAlreadyBooked(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error?.response?.data?.message || error.message,
      });
    }
  };

  // ⭐ Average rating calculation
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-700 mb-2">
        Tutor: <strong>{tutorName}</strong>
      </p>
      <p className="mb-4 text-sm text-gray-500">{description}</p>

      <div className="space-y-2">
        <p>
          Registration: {registrationStartDate} → {registrationEndDate}
        </p>
        <p>
          Class: {classStartDate} → {classEndDate}
        </p>
        <p>Duration: {duration}</p>
        <p>Fee: {registrationFee === 0 ? "Free" : `$${registrationFee}`}</p>
        <p>
          Status:{" "}
          <span className={isOngoing ? "text-green-600" : "text-red-500"}>
            {isOngoing ? "Ongoing" : "Closed"}
          </span>
        </p>
      </div>

      <button
        onClick={() => handleBooking(session)}
        disabled={!canBook}
        className={`mt-6 px-4 py-2 text-white rounded ${
          canBook
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        title={
          isAlreadyBooked
            ? "You have already booked this session"
            : !isOngoing
            ? "Registration closed"
            : role !== "student"
            ? "Only students can book"
            : "Login required"
        }
      >
        {isAlreadyBooked
          ? "Already Booked"
          : canBook
          ? "Book Now"
          : !isOngoing
          ? "Registration Closed"
          : "Book Now (Disabled)"}
      </button>

      {/* 🔥 Reviews Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Reviews</h2>
          {averageRating && (
            <div className="text-yellow-600 font-medium text-sm flex items-center space-x-2">
              <span>⭐ Average Rating:</span>
              <span className="text-black font-bold">{averageRating}</span>
              <span className="text-gray-500">/ 5 ({reviews.length} review{reviews.length > 1 ? "s" : ""})</span>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={
                      review.studentPhotoUrl ||
                      "https://i.ibb.co/M1q7YVw/default-user.png"
                    }
                    alt={review.studentName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{review.studentName}</h4>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < review.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {review.reviewText}
                    </p>
                    {review.updatedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last updated:{" "}
                        {new Date(review.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedSessionPage;