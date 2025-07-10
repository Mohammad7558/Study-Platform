import React from 'react';
import { Link } from 'react-router';

const SingleStudySession = ({ session }) => {
  const {
    _id,
    title,
    description,
    registrationStartDate,
    registrationEndDate,
  } = session;

  const now = new Date();
  const isOngoing = new Date(registrationStartDate) <= now && now <= new Date(registrationEndDate);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600 mt-1">{description.slice(0, 80)}...</p>
      <p className="mt-2 text-sm">
        Status:{" "}
        <span className={isOngoing ? 'text-green-600' : 'text-red-500'}>
          {isOngoing ? 'Ongoing' : 'Closed'}
        </span>
      </p>
      <Link to={`/session/${_id}`}>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Read More
        </button>
      </Link>
    </div>
  );
};

export default SingleStudySession;
