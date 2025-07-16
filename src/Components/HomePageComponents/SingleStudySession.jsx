// SingleStudySession.jsx
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{title}</h2>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isOngoing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isOngoing ? 'Ongoing' : 'Closed'}
          </span>
        </div>
        
        <p className="mt-3 text-gray-600 line-clamp-3">{description}</p>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Registration: {new Date(registrationStartDate).toLocaleDateString()} - {new Date(registrationEndDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="px-6 pb-4">
        <Link 
          to={`/session/${_id}`}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SingleStudySession;