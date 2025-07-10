import React from "react";
import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <FaLock className="text-red-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">403 - Forbidden</h1>
      <p className="text-gray-600 mb-6 text-center">
        You don't have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Forbidden;
