import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import { toast } from "sonner";
import { 
  FiArrowLeft, 
  FiStar, 
  FiCalendar, 
  FiUser, 
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiEdit2,
  FiTrash2,
  FiPlus
} from "react-icons/fi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../../Components/ui/avatar";
import { Textarea } from "../../Components/ui/textarea";
import { Skeleton } from "../../Components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../Components/ui/alert-dialog";
import { ScrollArea } from "../../Components/ui/scroll-area";
import { Separator } from "../../Components/ui/separator";

const DetailedBookedCard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [userReview, setUserReview] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Invalid Date") return "Not scheduled";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not scheduled";
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
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
      toast.error("Login Required", {
        description: "Please login to submit a review",
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
        toast.success(userReview ? "Review Updated!" : "Review Submitted!");
        refetchReviews();
      }
    } catch (error) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to submit review",
      });
    }
  };

  const handleDeleteReview = async () => {
    try {
      const result = await axiosSecure.delete(`/reviews/${userReview._id}`);
      if (result.data.success) {
        toast.success("Review Deleted");
        setReviewText("");
        setRating(5);
        setUserReview(null);
        refetchReviews();
      }
    } catch (error) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to delete review",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const renderStatusBadge = () => {
    if (!bookedSession?.status) return null;

    switch (bookedSession.status.toLowerCase()) {
      case 'completed':
        return (
          <Badge className="gap-1.5 bg-green-500 hover:bg-green-600">
            <FiCheckCircle className="h-3.5 w-3.5" />
            <span>Completed</span>
          </Badge>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <Badge className="gap-1.5 bg-red-500 hover:bg-red-600">
            <FiXCircle className="h-3.5 w-3.5" />
            <span>{bookedSession.status.charAt(0).toUpperCase() + bookedSession.status.slice(1)}</span>
          </Badge>
        );
      case 'registered':
        return (
          <Badge className="gap-1.5 bg-blue-500 hover:bg-blue-600">
            <FiCheckCircle className="h-3.5 w-3.5" />
            <span>Registered</span>
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="gap-1.5 bg-yellow-500 hover:bg-yellow-600">
            <FiInfo className="h-3.5 w-3.5" />
            <span>Upcoming</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1.5">
            <FiInfo className="h-3.5 w-3.5" />
            <span>{bookedSession.status.charAt(0).toUpperCase() + bookedSession.status.slice(1)}</span>
          </Badge>
        );
    }
  };

  if (isLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-10 w-24" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
      <Skeleton className="h-96" />
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Error loading session</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Could not load the session details</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <FiArrowLeft className="mr-2" /> Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  if (!bookedSession) return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Session not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The requested session could not be found</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <FiArrowLeft className="mr-2" /> Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <Button 
        onClick={() => navigate(-1)} 
        variant="ghost" 
        className="px-0 hover:bg-transparent"
      >
        <FiArrowLeft className="mr-2" /> Back to Sessions
      </Button>

      {/* Session Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{bookedSession.title}</CardTitle>
          <CardDescription>Session details and information</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FiUser className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Tutor</h3>
                  <p className="text-foreground">{bookedSession.tutorName || "Not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FiCalendar className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Class Dates</h3>
                  <p className="text-foreground">
                    {formatDate(bookedSession.classStartDate)} - {formatDate(bookedSession.classEndDate)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Booking Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FiClock className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Duration</h3>
                  <p className="text-foreground">
                    {bookedSession.duration ? `${bookedSession.duration}` : "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FiInfo className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Booking Status</h3>
                  <div className="mt-1">
                    {renderStatusBadge()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional booking info */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FiCalendar className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Registration Date</h3>
                <p className="text-foreground">
                  {formatDate(bookedSession.registrationDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Section */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Share your experience with this session</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Review Form */}
          {user?.email && (
            <form onSubmit={handleReviewSubmit} className="mb-8 pb-6 border-b">
              <h3 className="text-lg font-medium mb-4">
                {userReview ? "Edit Your Review" : "Share Your Experience"}
              </h3>
              
              <div className="mb-4">
                <label className="block font-medium text-sm text-muted-foreground mb-2">Your Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-muted'}`}
                    >
                      <FiStar className={rating >= star ? "fill-current" : ""} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block font-medium text-sm text-muted-foreground mb-2">Your Review</label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this session..."
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {userReview ? "Update Review" : "Submit Review"}
                </Button>
                {userReview && (
                  <>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <Button 
                        type="button" 
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <FiTrash2 className="mr-2" /> Delete
                      </Button>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your review.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteReview}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div>
            {reviews.length > 0 ? (
              <ScrollArea className="h-[400px]">
                {reviews.map((review) => (
                  <div key={review._id} className="mb-6 pb-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.studentPhotoUrl} />
                        <AvatarFallback>
                          {review.studentName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{review.studentName}</h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.updatedAt || review.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 text-foreground">{review.reviewText}</p>
                      </div>
                    </div>
                    <Separator className="mt-6" />
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  <FiStar className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-lg font-medium">No reviews yet</h3>
                <p className="text-muted-foreground mt-1">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedBookedCard;