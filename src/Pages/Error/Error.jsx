import React from 'react';
import { Link } from 'react-router';

const Error = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4 text-center">
            <h1 className="text-6xl font-bold text-cyan-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Oops! Page not found</h2>
            <p className="text-gray-300 mb-6">
                The page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white font-medium transition duration-300"
            >
                Go Home
            </Link>
        </div>
    );
};

export default Error;
