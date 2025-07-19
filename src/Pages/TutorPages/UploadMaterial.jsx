import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../Components/ui/select";
import { Loader2, UploadCloud, CheckCircle2, XCircle } from "lucide-react";

const UploadMaterial = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isUploading, setIsUploading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const { data: approvedSessions = [], isLoading } = useQuery({
    queryKey: ["approvedSessions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/tutor-approved-sessions?email=${user.email}`);
      return res.data;
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSelected(true);
    } else {
      setImageSelected(false);
    }
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    const toastId = toast.loading("Uploading material...");
    const imageFile = data.image[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );

      if (imgRes.data.success) {
        const materialData = {
          title: data.title,
          sessionId: data.sessionId,
          tutorEmail: user.email,
          tutorName: user?.displayName,
          image: imgRes.data.data.url,
          link: data.link,
        };

        const uploadRes = await axiosSecure.post("/materials", materialData);
        
        if (uploadRes.data.insertedId) {
          toast.success("Material uploaded successfully", { id: toastId });
          reset();
          setImageSelected(false);
        } else {
          toast.error("Failed to save material", { id: toastId });
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to upload material", 
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto p-6">
      <div className="flex flex-col items-center mb-6">
        <UploadCloud className="h-10 w-10 text-primary mb-2" />
        <h2 className="text-2xl font-semibold text-center">Upload Study Material</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Share your materials with students
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Material Title *</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter material title"
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-destructive text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Select Approved Session *</Label>
          <Select
            onValueChange={(value) => setValue("sessionId", value)}
            defaultValue={watch("sessionId")}
          >
            <SelectTrigger className={errors.sessionId ? "border-destructive" : ""}>
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent>
              {approvedSessions.map((session) => (
                <SelectItem key={session._id} value={session._id}>
                  {session.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("sessionId", { required: "Please select a session" })}
          />
          {errors.sessionId && (
            <p className="text-destructive text-sm">{errors.sessionId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Google Drive Link *</Label>
          <Input
            id="link"
            {...register("link", { 
              required: "Google Drive link is required",
              
            })}
            placeholder="https://drive.google.com/..."
            className={errors.link ? "border-destructive" : ""}
          />
          {errors.link && (
            <p className="text-destructive text-sm">{errors.link.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Material Thumbnail *</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer relative ${
                errors.image ? "border-destructive" : "border-border hover:border-primary"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {imageSelected ? (
                  <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
                ) : (
                  <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                )}
                <p className="mb-2 text-sm text-muted-foreground">
                  {imageSelected ? "Image selected" : "Click to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG (MAX. 5MB)
                </p>
              </div>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image", { 
                  required: "Image is required",
                  validate: {
                    lessThan5MB: files => files[0]?.size < 5000000 || "Max 5MB size",
                    acceptedFormats: files => 
                      ['image/jpeg', 'image/png'].includes(files[0]?.type) || 
                      "Only JPEG/PNG images"
                  },
                  onChange: handleImageChange
                })}
              />
              {imageSelected && (
                <div className="absolute top-2 right-2 bg-green-100 rounded-full p-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              )}
            </label>
          </div>
          {errors.image && (
            <p className="text-destructive text-sm">{errors.image.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full mt-4" 
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Material"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default UploadMaterial;