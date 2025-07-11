import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const UploadMaterial = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch approved sessions
  const { data: approvedSessions = [], isLoading } = useQuery({
    queryKey: ["approvedSessions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/tutor-approved-sessions?email=${user.email}`);
      return res.data;
    },
  });

  const onSubmit = async (data) => {
    const imageFile = data.image[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );

      if (res.data.success) {
        const imageUrl = res.data.data.url;
        const materialData = {
          title: data.title,
          sessionId: data.sessionId,
          tutorEmail: user.email,
          image: imageUrl,
          link: data.link,
        };

        const uploadRes = await axiosSecure.post("/materials", materialData);
        if (uploadRes.data.insertedId) {
          await Swal.fire("Uploaded!", "Material uploaded successfully.", "success");
          reset();
        } else {
          Swal.fire("Error!", "Failed to save material.", "error");
        }
      } else {
        Swal.fire("Error!", "Image upload failed.", "error");
      }
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || "Failed to upload material";
      Swal.fire("Error!", msg, "error");
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10 text-lg">Loading approved sessions...</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-cyan-600 mb-4">Upload Study Material</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("title", { required: "Title is required" })}
            className={`w-full p-2 border rounded ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Material Title"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <select
            {...register("sessionId", { required: "Please select a session" })}
            className={`w-full p-2 border rounded ${
              errors.sessionId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Approved Session</option>
            {approvedSessions.map((session) => (
              <option className="text-black" key={session._id} value={session._id}>
                {session.title}
              </option>
            ))}
          </select>
          {errors.sessionId && (
            <p className="text-red-600 text-sm mt-1">{errors.sessionId.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("link", { required: "Google Drive link is required" })}
            className={`w-full p-2 border rounded ${
              errors.link ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Google Drive Link"
          />
          {errors.link && (
            <p className="text-red-600 text-sm mt-1">{errors.link.message}</p>
          )}
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            className={`w-full p-2 border rounded cursor-pointer ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.image && (
            <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded transition"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadMaterial;
