import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Textarea } from "../../Components/ui/textarea";
import { Label } from "../../Components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../Components/ui/dialog";
import { Calendar } from "../../Components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../Components/ui/popover";
import { CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../../lib/utils";

const CreateSession = () => {
  const { user } = useAuth();
  const { displayName, email, photoURL } = user || {};
  const axiosSecure = useAxiosSecure();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      tutorName: displayName || "",
      tutorEmail: email || "",
      tutorPhotoUrl: photoURL,
      registrationFee: 0,
      status: "pending",
      created_at: new Date().toISOString(),
      title: "",
      description: "",
      registrationStartDate: "",
      registrationEndDate: "",
      classStartDate: "",
      classEndDate: "",
      duration: "",
    },
  });

  const formatDateForSubmission = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const onSubmit = async (data) => {
    try {
      // Format dates before submission
      const formattedData = {
        ...data,
        registrationStartDate: formatDateForSubmission(data.registrationStartDate),
        registrationEndDate: formatDateForSubmission(data.registrationEndDate),
        classStartDate: formatDateForSubmission(data.classStartDate),
        classEndDate: formatDateForSubmission(data.classEndDate),
        created_at: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/session", formattedData);
      console.log(res);
      reset();
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  // Watch date values for display
  const regStartDate = watch("registrationStartDate");
  const regEndDate = watch("registrationEndDate");
  const clsStartDate = watch("classStartDate");
  const clsEndDate = watch("classEndDate");

  const handleDateSelect = (fieldName, date) => {
    if (date) {
      setValue(fieldName, date.toISOString(), { shouldValidate: true });
    }
  };

  const parseDateForDisplay = (dateString) => {
    if (!dateString) return undefined;
    try {
      return parseISO(dateString);
    } catch {
      return undefined;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-3xl p-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Create Study Session
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Session Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              {...register("title", { required: "Session title is required" })}
              type="text"
              placeholder="Enter session title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Tutor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tutor Name (read-only) */}
            <div className="space-y-2">
              <Label>Tutor Name</Label>
              <Input
                value={displayName || ""}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
              <input type="hidden" {...register("tutorName")} />
            </div>

            {/* Tutor Email (read-only) */}
            <div className="space-y-2">
              <Label>Tutor Email</Label>
              <Input
                value={email || ""}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
              <input type="hidden" {...register("tutorEmail")} />
            </div>
          </div>

          {/* Session Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Session Description *</Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description should be at least 20 characters",
                },
              })}
              rows={4}
              placeholder="Enter detailed session description..."
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-destructive text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration Start Date */}
            <div className="space-y-2">
              <Label>Registration Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !regStartDate && "text-muted-foreground",
                      errors.registrationStartDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {regStartDate ? (
                      format(parseISO(regStartDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={parseDateForDisplay(regStartDate)}
                    onSelect={(date) => handleDateSelect("registrationStartDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                {...register("registrationStartDate", {
                  required: "Registration start date is required",
                })}
              />
              {errors.registrationStartDate && (
                <p className="text-destructive text-sm">
                  {errors.registrationStartDate.message}
                </p>
              )}
            </div>

            {/* Registration End Date */}
            <div className="space-y-2">
              <Label>Registration End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !regEndDate && "text-muted-foreground",
                      errors.registrationEndDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {regEndDate ? (
                      format(parseISO(regEndDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={parseDateForDisplay(regEndDate)}
                    onSelect={(date) => handleDateSelect("registrationEndDate", date)}
                    initialFocus
                    fromDate={parseDateForDisplay(regStartDate)}
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                {...register("registrationEndDate", {
                  required: "Registration end date is required",
                  validate: (value) =>
                    !regStartDate ||
                    new Date(value) >= new Date(regStartDate) ||
                    "End date must be after start date",
                })}
              />
              {errors.registrationEndDate && (
                <p className="text-destructive text-sm">
                  {errors.registrationEndDate.message}
                </p>
              )}
            </div>

            {/* Class Start Date */}
            <div className="space-y-2">
              <Label>Class Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !clsStartDate && "text-muted-foreground",
                      errors.classStartDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {clsStartDate ? (
                      format(parseISO(clsStartDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={parseDateForDisplay(clsStartDate)}
                    onSelect={(date) => handleDateSelect("classStartDate", date)}
                    initialFocus
                    fromDate={parseDateForDisplay(regEndDate)}
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                {...register("classStartDate", {
                  required: "Class start date is required",
                  validate: (value) =>
                    !regEndDate ||
                    new Date(value) >= new Date(regEndDate) ||
                    "Class must start after registration ends",
                })}
              />
              {errors.classStartDate && (
                <p className="text-destructive text-sm">
                  {errors.classStartDate.message}
                </p>
              )}
            </div>

            {/* Class End Date */}
            <div className="space-y-2">
              <Label>Class End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !clsEndDate && "text-muted-foreground",
                      errors.classEndDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {clsEndDate ? (
                      format(parseISO(clsEndDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={parseDateForDisplay(clsEndDate)}
                    onSelect={(date) => handleDateSelect("classEndDate", date)}
                    initialFocus
                    fromDate={parseDateForDisplay(clsStartDate)}
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                {...register("classEndDate", {
                  required: "Class end date is required",
                  validate: (value) =>
                    !clsStartDate ||
                    new Date(value) >= new Date(clsStartDate) ||
                    "End date must be after start date",
                })}
              />
              {errors.classEndDate && (
                <p className="text-destructive text-sm">
                  {errors.classEndDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Session Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Session Duration *</Label>
            <Input
              id="duration"
              {...register("duration", { required: "Duration is required" })}
              type="text"
              placeholder="e.g., 2 weeks, 3 months"
              className={errors.duration ? "border-destructive" : ""}
            />
            {errors.duration && (
              <p className="text-destructive text-sm">{errors.duration.message}</p>
            )}
          </div>

          {/* Registration Fee (read-only) */}
          <div className="space-y-2">
            <Label>Registration Fee (৳)</Label>
            <Input value={0} readOnly className="bg-muted cursor-not-allowed" />
            <input type="hidden" {...register("registrationFee")} />
          </div>

          {/* Status (hidden) */}
          <input type="hidden" {...register("status")} />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Session"}
          </Button>
        </form>
      </Card>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <DialogTitle className="text-center">Session Created Successfully!</DialogTitle>
              <DialogDescription className="text-center">
                Your new study session has been created and is now pending approval.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setIsSuccessDialogOpen(false)}
              className="px-6"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateSession;