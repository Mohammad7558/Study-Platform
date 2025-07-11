import React from 'react';
import { Link } from 'react-router';

const SingleCardBooked = ({ session }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{session.title}</h3>
        <p className="text-gray-600 mb-1">Tutor: {session.tutorName}</p>
        <p className="text-gray-600 mb-4">Date: {new Date(session.classStartDate).toLocaleDateString()}</p>
        
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm ${
            session.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {session.status}
          </span>
          
          <Link 
            to={`/dashboard/booked-sessions/${session._id}`} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleCardBooked;