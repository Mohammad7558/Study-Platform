import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FiArrowLeft, FiStar, FiCalendar, FiUser, FiClock } from "react-icons/fi";

const DetailedBookedCard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [userReview, setUserReview] = useState(null);

  // Enhanced date formatter
  const formatDate = (dateString) => {
    if (!dateString || dateString === "Invalid Date") return "Not scheduled";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not scheduled";
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "Not scheduled";
    }
  };

  // Fetch booked session details
  const { data: bookedSession, isLoading, error } = useQuery({
    queryKey: ["booked-session", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/booked-sessions/${id}`);
      console.log("Booked session data:", res.data); // Debug log
      return res.data;
    },
  });

  // Fetch reviews
  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["session-reviews", bookedSession?.sessionId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?sessionId=${bookedSession?.sessionId}`);
      return res.data;
    },
    enabled: !!bookedSession?.sessionId,
  });

  // Check for existing user review
  useEffect(() => {
    if (user?.email && reviews) {
      const userRev = reviews.find((r) => r.studentEmail === user.email);
      setUserReview(userRev);
      if (userRev) {
        setReviewText(userRev.reviewText);
        setRating(userRev.rating);
      }
    }
  }, [user?.email, reviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.email) {
      Swal.fire("Login Required", "Please login to submit a review", "error");
      return;
    }

    const reviewData = {
      rating,
      reviewText,
      sessionId: bookedSession.sessionId,
      studentName: user.displayName,
      studentEmail: user.email,
      studentPhotoUrl: user.photoURL,
      updatedAt: new Date().toISOString()
    };

    try {
      let result;
      if (userReview) {
        result = await axiosSecure.patch(`/reviews/${userReview._id}`, reviewData);
      } else {
        reviewData.createdAt = new Date().toISOString();
        result = await axiosSecure.post("/reviews", reviewData);
      }

      if (result.data.success) {
        Swal.fire({
          icon: "success",
          title: userReview ? "Review Updated!" : "Review Submitted!",
          timer: 1500,
          showConfirmButton: false
        });
        refetchReviews();
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to submit review", "error");
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-700">Error loading session</h2>
      <button 
        onClick={() => navigate(-1)} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  );

  if (!bookedSession) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-700">Session not found</h2>
      <button 
        onClick={() => navigate(-1)} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back to Sessions
      </button>

      {/* Session Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{bookedSession.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Info */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <FiUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Tutor</h3>
                  <p className="text-gray-600">{bookedSession.tutorName || "Not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <FiCalendar className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Class Dates</h3>
                  <p className="text-gray-600">
                    {formatDate(bookedSession.classStartDate)} - {formatDate(bookedSession.classEndDate)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Booking Info */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <FiClock className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Duration</h3>
                  <p className="text-gray-600">
                    {bookedSession.duration ? `${bookedSession.duration} days` : "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <FiCalendar className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Booking Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    bookedSession.status === 'completed' ? 'bg-green-100 text-green-800' :
                    bookedSession.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    bookedSession.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bookedSession.status || "unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional booking info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start">
              <div className="bg-blue-50 p-3 rounded-lg mr-4">
                <FiCalendar className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Registration Date</h3>
                <p className="text-gray-600">
                  {formatDate(bookedSession.registrationDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Reviews</h2>
          
          {/* Review Form */}
          {user?.email && (
            <form onSubmit={handleReviewSubmit} className="mb-8 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                {userReview ? "Edit Your Review" : "Share Your Experience"}
              </h3>
              
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <FiStar className="fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this session..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {userReview ? "Update Review" : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={review.studentPhotoUrl || "/default-avatar.png"} 
                      alt={review.studentName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{review.studentName}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.updatedAt || review.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{review.reviewText}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <FiStar className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-gray-600">No reviews yet</h3>
                <p className="text-gray-500 mt-1">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedBookedCard;