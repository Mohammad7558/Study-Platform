import React from 'react';
import { Link } from 'react-router';

const SingleStudySession = ({ session }) => {
  const {
    _id, title, description,
    registrationStartDate, registrationEndDate,
  } = session;

  const isOngoing = () => {
    const now = new Date();
    const start = new Date(registrationStartDate);
    const end = new Date(registrationEndDate);
    return start <= now && now <= end;
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-600 mt-2">{description.slice(0, 80)}...</p>

      <p className="mt-3 text-sm">
        Status:
        <span className={`ml-1 font-medium ${isOngoing() ? 'text-green-600' : 'text-red-500'}`}>
          {isOngoing() ? 'Ongoing' : 'Closed'}
        </span>
      </p>

      <Link to={`/session/${_id}`}>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Read More
        </button>
      </Link>
    </div>
  );
};

export default SingleStudySession;
