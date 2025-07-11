import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const DetailedBookedCard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  // Review states
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [userReview, setUserReview] = useState(null);

  // Fetch booked session details
  const { data: bookedSession, isLoading } = useQuery({
    queryKey: ["booked-session", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/booked-sessions/${id}`);
      return res.data;
    },
  });

  // Fetch reviews for this session
  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ["session-reviews", bookedSession?.sessionId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?sessionId=${bookedSession?.sessionId}`);
      return res.data;
    },
    enabled: !!bookedSession?.sessionId,
  });

  // Check if user has already reviewed
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

  if (isLoading) return <div className="text-center mt-8">Loading session details...</div>;
  if (!bookedSession) return <div className="text-center mt-8">Session not found</div>;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.email) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to submit a review",
      });
      return;
    }

    const reviewData = {
      rating,
      reviewText,
      sessionId: bookedSession.sessionId,
      studentName: user.displayName,
      studentEmail: user.email,
      studentPhotoUrl: user.photoURL,
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
          showConfirmButton: false,
          timer: 1500,
        });
        refetchReviews();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to submit review",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Back to Booked Sessions
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{bookedSession.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Session Details</h2>
            <p className="mb-2"><span className="font-medium">Tutor:</span> {bookedSession.tutorName}</p>
            <p className="mb-2"><span className="font-medium">Start Date:</span> {new Date(bookedSession.classStartDate).toLocaleDateString()}</p>
            <p className="mb-2"><span className="font-medium">End Date:</span> {new Date(bookedSession.classEndDate).toLocaleDateString()}</p>
            <p className="mb-2"><span className="font-medium">Duration:</span> {bookedSession.duration}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Booking Info</h2>
            <p className="mb-2"><span className="font-medium">Booking Date:</span> {new Date(bookedSession.createdAt).toLocaleDateString()}</p>
            <p className="mb-2"><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                bookedSession.status === 'completed' ? 'bg-green-100 text-green-800' :
                bookedSession.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {bookedSession.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Session Reviews</h2>
        
        {/* Review Form */}
        {user?.email && (
          <form onSubmit={handleReviewSubmit} className="mb-8 border-b pb-6">
            <h3 className="text-lg font-medium mb-4">
              {userReview ? "Edit Your Review" : "Write a Review"}
            </h3>
            
            <div className="mb-4">
              <label className="block font-medium mb-2">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-2 border rounded"
                required
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block font-medium mb-2">Your Review</label>
              <textarea
                rows="4"
                className="w-full p-2 border rounded"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {userReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div>
          {reviews?.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="mb-6 pb-6 border-b last:border-0">
                <div className="flex items-start gap-4">
                  <img 
                    src={review.studentPhotoUrl || "/default-avatar.png"} 
                    alt={review.studentName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{review.studentName}</h4>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.reviewText}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedBookedCard;