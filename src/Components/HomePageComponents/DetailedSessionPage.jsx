import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  LockClosedIcon,
  StarIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useUserRole from "../../Hooks/useUserRole";
import CheckoutForm from "../CheckoutForm";
import StripeProviderWrapper from "../StripeProviderWrapper";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

const DetailedSessionPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, isRoleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Get single session data
  const { data: session, isLoading } = useQuery({
    queryKey: ["sessionDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/session/${id}`);
      return res.data;
    },
  });

  // Get reviews for this session
  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ["sessionReviews", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?sessionId=${id}`);
      return res.data;
    },
  });

  // Get booking counts
  const { data: bookingCounts = { totalBookings: 0, paidCount: 0 } } = useQuery({
    queryKey: ["bookingCounts", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/session/${id}/bookings-count`);
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
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-6 h-screen">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="bg-muted p-6 rounded-full">
            <InformationCircleIcon className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Session Not Found
            </h2>
            <p className="text-muted-foreground">
              The session you're looking for doesn't exist or may have been
              removed.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Go back
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/all-sessions")}
            >
              Browse all sessions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    _id,
    title,
    tutorName,
    tutorEmail,
    tutorPhotoUrl,
    description,
    registrationStartDate,
    registrationEndDate,
    classStartDate,
    classEndDate,
    duration,
    sessionType,
    price,
  } = session;

  // Date calculations
  const now = new Date();
  const regStart = new Date(registrationStartDate);
  const regEnd = new Date(registrationEndDate);
  const clsStart = new Date(classStartDate);
  const clsEnd = new Date(classEndDate);

  // Determine session status
  let currentStatus = "";
  let statusVariant = "";
  let statusIcon = null;

  if (now < regStart) {
    currentStatus = "Upcoming";
    statusVariant = "secondary";
    statusIcon = <ClockIcon className="h-4 w-4 mr-1" />;
  } else if (now >= regStart && now <= regEnd) {
    currentStatus = "Registration Open";
    statusVariant = "default";
    statusIcon = <CheckIcon className="h-4 w-4 mr-1" />;
  } else if (now > regEnd && now < clsStart) {
    currentStatus = "Registration Closed";
    statusVariant = "outline";
    statusIcon = <XMarkIcon className="h-4 w-4 mr-1" />;
  } else if (now >= clsStart && now <= clsEnd) {
    currentStatus = "In Progress";
    statusVariant = "default";
    statusIcon = <ClockIcon className="h-4 w-4 mr-1 text-purple-500" />;
  } else {
    currentStatus = "Completed";
    statusVariant = "secondary";
    statusIcon = <CheckIcon className="h-4 w-4 mr-1" />;
  }

  const getButtonState = () => {
    if (!user?.email) {
      return {
        text: "Login to Enroll",
        disabled: true,
        variant: "outline",
      };
    }

    if (role === "tutor" || role === "admin") {
      return {
        text: "You can't enroll",
        disabled: true,
        variant: "outline",
      };
    }

    if (isAlreadyBooked) {
      return {
        text: `Already Registered`,
        disabled: true,
        variant: "default",
      };
    }

    if (now < regStart) {
      return {
        text: "Registration Opens Soon",
        disabled: true,
        variant: "outline",
      };
    }

    if (now > regEnd) {
      return {
        text: "Registration Closed",
        disabled: true,
        variant: "outline",
      };
    }

    if (now >= regStart && now <= regEnd && role === "student") {
      return {
        text: price > 0 ? `Enroll Now - $${price}` : "Enroll for Free",
        disabled: false,
        variant: "default",
      };
    }

    return {
      text: "Enrollment Not Available",
      disabled: true,
      variant: "outline",
    };
  };

  const buttonState = getButtonState();

  const handleBooking = async () => {
    if (session.sessionType === "free" || session.price === 0) {
      try {
        queryClient.setQueryData(["bookingCounts", id], (old) => ({
          ...old,
          totalBookings: old.totalBookings + 1,
          paidCount: price > 0 ? old.paidCount + 1 : old.paidCount,
        }));

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
          price,
          paymentStatus: "not_required",
        };

        const res = await axiosSecure.post("/booked-sessions", bookedData);

        if (res.status === 409) {
          queryClient.setQueryData(["bookingCounts", id], (old) => ({
            ...old,
            totalBookings: old.totalBookings - 1,
            paidCount: price > 0 ? old.paidCount - 1 : old.paidCount,
          }));

          toast.warning("Already Booked", {
            description: "You've already booked this session",
          });
          return;
        }

        if (res.data.insertedId) {
          toast.success("Success", {
            description: "Session booked successfully!",
          });
          setIsAlreadyBooked(true);
          await queryClient.invalidateQueries(["bookingCounts", id]);
          setPaymentStatus("success"); // Show success modal for free enrollment
        }
      } catch (error) {
        queryClient.setQueryData(["bookingCounts", id], (old) => ({
          ...old,
          totalBookings: old.totalBookings - 1,
          paidCount: price > 0 ? old.paidCount - 1 : old.paidCount,
        }));

        toast.error("Error", {
          description: error.response?.data?.message || "Booking failed",
        });
      }
    } else {
      setShowPaymentDialog(true);
    }
  };

  const handlePaymentSuccess = () => {
    setIsAlreadyBooked(true);
    setShowPaymentDialog(false);
    setPaymentStatus("success");
    queryClient.setQueryData(["bookingCounts", id], (old) => ({
      ...old,
      totalBookings: old.totalBookings + 1,
      paidCount: old.paidCount + 1,
    }));
    queryClient.invalidateQueries(["bookingCounts", id]);
    toast.success("Payment Successful", {
      description: "Your payment has been processed successfully",
    });
  };

  const handlePaymentError = () => {
    setPaymentStatus("error");
    toast.error("Payment Failed", {
      description: "There was an issue processing your payment",
    });
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.length
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 gap-2"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to sessions
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tutor Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 border-4 border-primary/10">
              <AvatarImage src={tutorPhotoUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {tutorName?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>{tutorName}</span>
                <span className="text-sm opacity-75">({tutorEmail})</span>
              </div>
            </div>
          </div>

          {/* Session Status */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant={statusVariant} className="flex items-center gap-1">
              {statusIcon}
              {currentStatus}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              {duration}
            </Badge>
            <Badge
              variant={price > 0 ? "secondary" : "default"}
              className="flex items-center gap-1"
            >
              <CurrencyDollarIcon className="h-4 w-4" />
              {price > 0 ? `$${price}` : "Free"}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              {bookingCounts.totalBookings} enrolled
              {price > 0 && bookingCounts.paidCount > 0 && (
                <span className="text-xs ml-1">
                  ({bookingCounts.paidCount} paid)
                </span>
              )}
            </Badge>
          </div>

          {/* Session Description */}
          <div className="prose max-w-none text-muted-foreground mb-8">
            <p className="text-lg leading-relaxed">{description}</p>
          </div>

          {/* Session details cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Registration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Starts:</span>{" "}
                  {new Date(registrationStartDate).toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Ends:</span>{" "}
                  {new Date(registrationEndDate).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Class Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Starts:</span>{" "}
                  {new Date(classStartDate).toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Ends:</span>{" "}
                  {new Date(classEndDate).toLocaleString()}
                </p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Type:</span> {sessionType}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking CTA */}
          <div className="space-y-4 mb-8">
            <Button
              onClick={handleBooking}
              disabled={buttonState.disabled}
              variant={buttonState.variant}
              size="lg"
              className="w-full md:w-auto gap-2"
            >
              {buttonState.text}
              {!buttonState.disabled && price > 0 && (
                <CurrencyDollarIcon className="h-5 w-5" />
              )}
              {!buttonState.disabled && price === 0 && (
                <CheckIcon className="h-5 w-5" />
              )}
            </Button>

            {price > 0 && !buttonState.disabled && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <InformationCircleIcon className="h-4 w-4" />
                Secure payment required to enroll
              </p>
            )}
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Student Feedback</h2>

            {isReviewsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={`review-skeleton-${i}`}
                    className="h-32 w-full"
                  />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={`avg-star-${i}`}
                          className={`h-5 w-5 ${
                            i < Math.round(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {reviews.length} review
                      {reviews.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card
                      key={`review-${review._id}`}
                      className="hover:shadow-sm transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.studentPhotoUrl} />
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                              {review.studentName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h4 className="font-medium">
                                {review.studentName}
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={`review-${review._id}-star-${i}`}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {review.reviewText}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Alert>
                <InformationCircleIcon className="h-4 w-4" />
                <AlertTitle>No reviews yet</AlertTitle>
                <AlertDescription>
                  Be the first to leave a review after attending the session.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Session Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tutor Info with Avatar */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={tutorPhotoUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {tutorName?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Tutor</p>
                  <p className="font-medium">{tutorName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <ClockIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Session</p>
                  <p className="font-medium">
                    {new Date(classStartDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <CurrencyDollarIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    {price > 0 ? `$${price}` : "Free"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled</p>
                  <p className="font-medium">
                    {bookingCounts.totalBookings} student
                    {bookingCounts.totalBookings !== 1 ? "s" : ""}
                    {price > 0 && bookingCounts.paidCount > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({bookingCounts.paidCount} paid)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {reviews.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <StarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {averageRating.toFixed(1)}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={`sidebar-star-${i}`}
                            className={`h-3 w-3 ${
                              i < Math.round(averageRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({reviews.length})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!buttonState.disabled && (
            <Card>
              <CardHeader>
                <CardTitle>Ready to join?</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleBooking}
                  size="lg"
                  className="w-full gap-2"
                >
                  {price > 0 ? (
                    <>
                      <span>Enroll Now - ${price}</span>
                      <CurrencyDollarIcon className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <span>Enroll for Free</span>
                      <CheckIcon className="h-5 w-5" />
                    </>
                  )}
                </Button>
                {price > 0 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Secure payment processed via Stripe
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Complete Your Enrollment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{title}</h3>
                <span className="font-bold">${price}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Tutor: {tutorName}
              </p>
            </div>
            <StripeProviderWrapper>
              <CheckoutForm
                session={{
                  ...session,
                  studentName: user?.displayName || "",
                  studentEmail: user?.email || "",
                  studentPhotoUrl: user?.photoURL || "",
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onClose={() => setShowPaymentDialog(false)}
              />
            </StripeProviderWrapper>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <LockClosedIcon className="h-3 w-3" />
              <span>Payments are secure and encrypted</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enrollment Success Dialog */}
      <Dialog
        open={paymentStatus === "success"}
        onOpenChange={(open) => !open && setPaymentStatus(null)}
      >
        <DialogContent className="sm:max-w-[450px] text-center">
          <div className="mx-auto flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Enrollment Confirmed!
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              {price > 0 ? (
                <>
                  Payment successful! You're now enrolled in "{title}". 
                  We've sent the details to your email.
                </>
              ) : (
                <>
                  You're now enrolled in "{title}" for free. 
                  We've sent the session details to your email.
                </>
              )}
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  setPaymentStatus(null);
                  navigate("/dashboard/booked-sessions");
                }}
                className="w-full"
              >
                View My Sessions
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPaymentStatus(null);
                  navigate("/all-sessions");
                }}
                className="w-full"
              >
                Browse More Sessions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Error Dialog */}
      <Dialog
        open={paymentStatus === "error"}
        onOpenChange={(open) => !open && setPaymentStatus(null)}
      >
        <DialogContent className="sm:max-w-[450px] text-center">
          <div className="mx-auto flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-red-100 p-4">
              <XMarkIcon className="h-8 w-8 text-red-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl">Payment Failed</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              We couldn't process your payment. Please try again or contact
              support.
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  setPaymentStatus(null);
                  setShowPaymentDialog(true);
                }}
                className="w-full"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => setPaymentStatus(null)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailedSessionPage;