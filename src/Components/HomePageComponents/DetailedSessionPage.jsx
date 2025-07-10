import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const DetailedSessionPage = () => {
  const { id } = useParams();

  const { data: session, isLoading } = useQuery({
    queryKey: ['sessionDetails', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/session/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!session) return <p className="text-center mt-10">No session found</p>;

  const {
    title, tutorName, description,
    registrationStartDate, registrationEndDate,
    classStartDate, classEndDate,
    duration, registrationFee
  } = session;

  const isOngoing = new Date(registrationStartDate) <= new Date() && new Date() <= new Date(registrationEndDate);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-700 mb-2">Tutor: <strong>{tutorName}</strong></p>
      <p className="mb-4 text-sm text-gray-500">{description}</p>

      <div className="space-y-2">
        <p>Registration: {registrationStartDate} → {registrationEndDate}</p>
        <p>Class: {classStartDate} → {classEndDate}</p>
        <p>Duration: {duration}</p>
        <p>Fee: {registrationFee === 0 ? 'Free' : `$${registrationFee}`}</p>
        <p>Status: <span className={isOngoing ? 'text-green-600' : 'text-red-500'}>{isOngoing ? 'Ongoing' : 'Closed'}</span></p>
      </div>

      <button
        disabled={!isOngoing}
        className={`mt-6 px-4 py-2 text-white rounded ${isOngoing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {isOngoing ? 'Book Now' : 'Registration Closed'}
      </button>
    </div>
  );
};

export default DetailedSessionPage;
