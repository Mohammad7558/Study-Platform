import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import ViewSingleMaterials from "./ViewSingleMaterials";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ViewAllMaterials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    data: materials = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-materials"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/materials");
      return data;
    },
  });


  const handleDelete = async (materialId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this material?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    const deletePromise = axiosSecure.delete(`/admin/materials/${materialId}`);

    toast.promise(deletePromise, {
      loading: "Deleting material...",
      success: () => {
        refetch();
        return "Material deleted successfully!";
      },
      error: "Failed to delete material",
    });
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tutorEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Study Materials Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and manage all uploaded study materials
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative rounded-md shadow-sm max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search materials by title or tutor email..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Materials Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading materials...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            Error: {error.message}
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No materials found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tutor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <ViewSingleMaterials
                    key={material._id}
                    material={material}
                    onDelete={() => handleDelete(material._id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllMaterials;
