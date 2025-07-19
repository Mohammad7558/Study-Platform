import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import {
  FiEye,
  FiEyeOff,
  FiUpload,
  FiX,
  FiUser,
  FiMail,
  FiLock,
} from "react-icons/fi";
import { GoogleAuthProvider } from "firebase/auth";
import { Loader2 } from "lucide-react";

import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../Components/ui/card";
import { Input } from "../../Components/ui/input";
import { Button } from "../../Components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../Components/ui/form";
import { Separator } from "../../Components/ui/separator";

const Register = () => {
  const { createUserWithEmail, updateUser, setUser, createUserWithGoogle } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const provider = new GoogleAuthProvider();
  const axiosInstance = useAxios();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please upload a valid image (JPEG, PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be under 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    document.getElementById("profile-upload").value = "";
  };

  const uploadImageToImgBB = async (file) => {
    if (!file) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error("Image upload failed");

      return data.data.url;
    } catch (err) {
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    // ✅ Step 1: lowercase the email
    const name = data.name;
    const password = data.password;
    const email = data.email.toLowerCase();

    try {
      let photoUrl = "";
      if (imageFile) {
        photoUrl = await uploadImageToImgBB(imageFile);
        if (!photoUrl) toast.warning("Account created without profile photo");
      }

      const res = await createUserWithEmail(email, password);
      const user = res.user;

      await updateUser({ displayName: name, photoURL: photoUrl || "" });
      setUser({ ...user, displayName: name, photoURL: photoUrl || "" });

      const userInfo = {
        name,
        email, // ✅ already lowercase
        photoUrl: photoUrl || "",
        role: "student",
        created_at: new Date().toISOString(),
      };

      await axiosInstance.post("/users", userInfo);
      await axiosInstance.post("/jwt", { email }, { withCredentials: true });

      toast.success("Account created successfully!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await createUserWithGoogle(provider);
      const user = res.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL || "",
        role: "student",
        created_at: new Date().toISOString(),
      };

      await axiosInstance.post("/users", userInfo);
      await axiosInstance.post(
        "/jwt",
        { email: user.email },
        { withCredentials: true }
      );

      toast.success("Google account linked!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Google sign-up failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 lg:shadow-none shadow-xl lg:p-0 px-3">
            <CardHeader className="space-y-1">
              <CardTitle className="text-4xl font-bold text-center">
                Sign up
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4">
              {/* Google Sign-In */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <FcGoogle className="h-4 w-4 mr-2" />
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Profile Image Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <label
                        htmlFor="profile-upload"
                        className="cursor-pointer"
                      >
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center transition-all group-hover:border-blue-500 group-hover:bg-gray-50">
                          {imagePreview ? (
                            <>
                              <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-full h-full rounded-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <FiUpload className="text-white h-5 w-5" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center">
                              <FiUser className="text-gray-400 h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <FiX className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              className="h-10 pl-10"
                            />
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="your@email.com"
                              {...field}
                              className="h-10 pl-10"
                            />
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              {...field}
                              className="h-10 pl-10 pr-10"
                            />
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <FiEyeOff className="h-4 w-4" />
                              ) : (
                                <FiEye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={isLoading || isUploading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Continue with Email"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <div className="text-center text-sm mt-4 pb-6">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Log in
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Side - Sky Blue Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-sky-100 items-center justify-center p-12">
        <div className="text-center max-w-md">
          <img
            src="https://illustrations.popsy.co/amber/digital-nomad.svg"
            alt="Sign up illustration"
            className="w-full max-w-xs mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold text-sky-800 mb-4">
            Join Our Community
          </h2>
          <p className="text-sky-700">
            Create your account and get access to all our premium features and
            resources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
