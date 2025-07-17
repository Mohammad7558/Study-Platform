import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { GoogleAuthProvider } from "firebase/auth";
import useAuth from "../../Hooks/useAuth";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../Components/ui/card";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { Button } from "../../Components/ui/button";
import { Separator } from "../../Components/ui/separator";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Login = () => {
  const { signInUser, createUserWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const provider = new GoogleAuthProvider();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const res = await signInUser(email, password);
      const user = res.user;

      // ✅ JWT Token Set via cookie
      await axiosSecure.post(
        "/jwt",
        { email: user.email },
        { withCredentials: true }
      );

      // ✅ Optional: Fetch Role to ensure it exists
      await axiosSecure.get(`/users/${user.email}/role`, {
        withCredentials: true,
      });

      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
  setIsGoogleLoading(true);
  try {
    const res = await createUserWithGoogle(provider);
    const user = res.user;

    // ✅ JWT Token Set via cookie
    await axiosSecure.post("/jwt", { email: user.email }, { withCredentials: true });

    // ✅ Optional: Fetch Role to ensure it's assigned
    await axiosSecure.get(`/users/${user.email}/role`, { withCredentials: true });

    toast.success("Logged in with Google");
    navigate(from, { replace: true });

  } catch (error) {
    toast.error(error.message || "Google login failed");
  } finally {
    setIsGoogleLoading(false);
  }
};


  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 lg:shadow-none shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-4xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              {/* Google Sign-In */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    className="h-10"
                  />
                  {errors.email && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Minimum 6 characters required",
                        },
                      })}
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Side - Sky Blue Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-sky-100 items-center justify-center p-12">
        <div className="text-center max-w-md">
          <img
            src="https://illustrations.popsy.co/amber/login.svg"
            alt="Login illustration"
            className="w-full max-w-xs mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold text-sky-800 mb-4">
            Welcome Back!
          </h2>
          <p className="text-sky-700">
            Log in to access your personalized dashboard and continue your
            journey with us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
