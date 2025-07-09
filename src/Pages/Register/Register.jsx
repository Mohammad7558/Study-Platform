import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const { createUserWithEmail, updateUser, setUser, createUserWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const provider = new GoogleAuthProvider();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { email, password, name, photoUrl } = data;

    createUserWithEmail(email, password)
      .then((res) => {
        const user = res.user;
        updateUser({ displayName: name, photoURL: photoUrl })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL: photoUrl });
            toast.success("User Created Successfully");
            navigate(from, { replace: true });
          })
          .catch((error) => toast.error(error.message));
      })
      .catch((error) => {
        toast.error(error.message);
        console.error(error);
      });
  };

  const makeUserWithGoogle = () => {
    createUserWithGoogle(provider)
      .then((result) => {
        const user = result.user;
        navigate(from, { replace: true });
        toast.success("User created successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex justify-center items-center lg:min-h-screen min-h-[80vh] bg-gradient-to-br px-4 py-10 lg:py-0">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Placeholder image */}
        <div className="hidden md:block bg-cyan-600">
          <img
            src="https://source.unsplash.com/600x600/?technology,abstract"
            alt="Register illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </h2>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              type="password"
              placeholder="Your password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photo URL
            </label>
            <input
              {...register("photoUrl", { required: "Photo URL is required" })}
              type="url"
              placeholder="https://your-photo-link.com"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
            {errors.photoUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.photoUrl.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-md font-semibold transition duration-300"
          >
            Register
          </button>

          {/* Google Sign In */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={makeUserWithGoogle}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-cyan-600 text-gray-700 hover:text-cyan-700 px-4 py-2 rounded-md transition duration-300 cursor-pointer"
            >
              <FcGoogle size={22} />
              Continue with Google
            </button>
          </div>

          {/* Link to Login */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-600 font-medium underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
