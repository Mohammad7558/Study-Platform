import React, { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const ViewMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [editMaterialId, setEditMaterialId] = useState(null);
  const [editData, setEditData] = useState({ title: "", image: "", link: "" });

  const {
    data: materials = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["materials", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/materials?email=${user.email}`);
      return res.data;
    },
  });

  const handleEditClick = (material) => {
    setEditMaterialId(material._id);
    setEditData({ title: material.title, image: material.image, link: material.link });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axiosSecure.patch(`/materials/${editMaterialId}`, editData);
      Swal.fire("Success", "Material updated successfully.", "success");
      setEditMaterialId(null);
      refetch();
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || "Failed to update material";
      Swal.fire("Error", msg, "error");
    }
  };

  const handleCancel = () => {
    setEditMaterialId(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/materials/${id}`);
        Swal.fire("Deleted!", "Your material has been deleted.", "success");
        refetch();
      } catch (error) {
        const msg = error?.response?.data?.error || error.message || "Failed to delete material";
        Swal.fire("Error", msg, "error");
      }
    }
  };

  if (isLoading) return <p className="text-center mt-10 text-lg">Loading materials...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">My Uploaded Materials</h2>

      {materials.length === 0 && !isLoading && (
        <p className="text-center text-gray-600">No materials uploaded yet.</p>
      )}

      <ul>
        {materials.map((material) => (
          <li
            key={material._id}
            className="border border-gray-300 p-5 mb-5 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            {editMaterialId === material._id ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="border border-gray-400 p-2 rounded w-full mb-3"
                />
                <input
                  type="text"
                  name="image"
                  value={editData.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                  className="border border-gray-400 p-2 rounded w-full mb-3"
                />
                <input
                  type="text"
                  name="link"
                  value={editData.link}
                  onChange={handleChange}
                  placeholder="Google Drive Link"
                  className="border border-gray-400 p-2 rounded w-full mb-4"
                />
                <button
                  onClick={handleSave}
                  className="mr-3 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold">{material.title}</h3>
                {material.image && (
                  <div className="mt-3 mb-4">
                    <img
                      src={material.image}
                      alt={material.title}
                      className="w-full max-w-xs rounded shadow-sm object-cover"
                    />
                    <a
                      href={material.image}
                      download
                      className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Image
                    </a>
                  </div>
                )}
                <p>
                  <a
                    href={material.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Resource
                  </a>
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => handleEditClick(material)}
                    className="mr-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewMaterials;
