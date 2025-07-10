import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const CreateSession = () => {
  const { user } = useAuth();
  const { displayName, email } = user || {};
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tutorName: displayName || "",
      tutorEmail: email || "",
      registrationFee: 0,
      status: "pending",
    },
  });

  const onSubmit = async(data) => {
    // Here you can send data to backend API
    const res = await axiosSecure.post('/session', data);
    console.log(res);
    reset()
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        Create Study Session
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Session Title */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Session Title
          </label>
          <input
            {...register("title", { required: "Session title is required" })}
            type="text"
            placeholder="Enter session title"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
              ${errors.title ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.title && (
            <p className="text-red-500 mt-1 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Tutor Name (read-only) */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Tutor Name
          </label>
          <input
            value={displayName || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          {/* Hidden input for submission */}
          <input type="hidden" {...register("tutorName")} value={displayName || ""} />
        </div>

        {/* Tutor Email (read-only) */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Tutor Email
          </label>
          <input
            value={email || ""}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          {/* Hidden input for submission */}
          <input type="hidden" {...register("tutorEmail")} value={email || ""} />
        </div>

        {/* Session Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Session Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows={4}
            placeholder="Enter session description"
            className={`w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
              ${errors.description ? "border-red-500" : "border-gray-300"}`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Registration Start Date */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Registration Start Date
          </label>
          <input
            {...register("registrationStartDate", {
              required: "Registration start date is required",
            })}
            type="date"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
              ${errors.registrationStartDate ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.registrationStartDate && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.registrationStartDate.message}
            </p>
          )}
        </div>

        {/* Registration End Date */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Registration End Date
          </label>
          <input
            {...register("registrationEndDate", {
              required: "Registration end date is required",
            })}
            type="date"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
              ${errors.registrationEndDate ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.registrationEndDate && (
            <p className="text-red-500 mt-1 text-sm">{errors.registrationEndDate.message}</p>
          )}
        </div>

        {/* Class Start Date */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Class Start Date
          </label>
          <input
            {...register("classStartDate", {
              required: "Class start date is required",
            })}
            type="date"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
              ${errors.classStartDate ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.classStartDate && (
            <p className="text-red-500 mt-1 text-sm">{errors.classStartDate.message}</p>
          )}
        </div>

        {/* Class End Date */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Class End Date
          </label>
          <input
            {...register("classEndDate", {
              required: "Class end date is required",
            })}
            type="date"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
              ${errors.classEndDate ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.classEndDate && (
            <p className="text-red-500 mt-1 text-sm">{errors.classEndDate.message}</p>
          )}
        </div>

        {/* Session Duration */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Session Duration
          </label>
          <input
            {...register("duration", { required: "Duration is required" })}
            type="text"
            placeholder="e.g., 2 weeks, 3 months"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
              ${errors.duration ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.duration && (
            <p className="text-red-500 mt-1 text-sm">{errors.duration.message}</p>
          )}
        </div>

        {/* Registration Fee (read-only, default 0) */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Registration Fee (৳)
          </label>
          <input
            value={0}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <input type="hidden" {...register("registrationFee")} value={0} />
        </div>

        {/* Status (hidden) */}
        <input type="hidden" {...register("status")} value="pending" />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
        >
          Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSession;
