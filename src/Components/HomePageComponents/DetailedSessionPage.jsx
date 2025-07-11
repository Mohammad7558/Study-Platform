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

  // Review states
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [userReview, setUserReview] = useState(null);

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

  // Get single session data
  const { data: session, isLoading } = useQuery({
    queryKey: ["sessionDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/session/${id}`);
      return res.data;
    },
  });

  // Get reviews for this session
  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ["sessionReviews", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?sessionId=${id}`);
      return res.data;
    },
  });

  // Check if user has already reviewed this session
  useEffect(() => {
    if (user?.email && reviews) {
      const userRev = reviews.find((review) => review.studentEmail === user.email);
      setUserReview(userRev);
      if (userRev) {
        setReviewText(userRev.reviewText);
        setRating(userRev.rating);
      } else {
        setReviewText("");
        setRating(5);
      }
    }
  }, [user?.email, reviews]);

  if (isLoading || isRoleLoading)
    return <p className="text-center mt-10">Loading...</p>;
  if (!session) return <p className="text-center mt-10">No session found</p>;

  const {
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

  // Review form submit handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!userReview && !user?.email) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "You need to login to submit a review.",
      });
      return;
    }

    const reviewData = {
      rating,
      reviewText,
      sessionId: session._id,
      studentName: user?.displayName,
      studentEmail: user?.email,
      studentPhotoUrl: user?.photoURL,
    };

    try {
      let result;
      if (userReview) {
        // Update existing review
        result = await axiosSecure.patch(`/reviews/${userReview._id}`, reviewData);
      } else {
        // Create new review
        result = await axiosSecure.post("/reviews", reviewData);
      }

      if (result.data.success) {
        Swal.fire({
          icon: "success",
          title: userReview ? "Review Updated!" : "Review Submitted!",
          text: userReview 
            ? "Your review has been updated." 
            : "Thank you for your feedback.",
          timer: 2000,
          showConfirmButton: false,
        });
        refetchReviews();
      } else {
        throw new Error("Failed to submit review.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong!",
      });
    }
  };

  const handleCancelEdit = () => {
    if (userReview) {
      setReviewText(userReview.reviewText);
      setRating(userReview.rating);
    } else {
      setReviewText("");
      setRating(5);
    }
  };

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

      {/* Review Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        
        {/* Review Form */}
        {user?.email && (
          <form
            onSubmit={handleReviewSubmit}
            className="mb-8 max-w-md border p-4 rounded space-y-4"
          >
            <h3 className="text-lg font-medium">
              {userReview ? "Edit Your Review" : "Write a Review"}
            </h3>

            <div>
              <label className="block mb-1 font-medium" htmlFor="rating">
                Rating
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                required
              >
                {[5, 4, 3, 2, 1].map((val) => (
                  <option key={val} value={val}>
                    {val} Star{val > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="reviewText">
                Your Review
              </label>
              <textarea
                id="reviewText"
                rows={4}
                required
                className="w-full border rounded px-3 py-2"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {userReview ? "Update Review" : "Submit Review"}
              </button>
              {userReview && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews?.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={review.studentPhotoUrl || "https://i.ibb.co/M1q7YVw/default-user.png"}
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
                    <p className="text-sm text-gray-600 mt-1">{review.reviewText}</p>
                    {review.updatedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last updated: {new Date(review.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedSessionPage;