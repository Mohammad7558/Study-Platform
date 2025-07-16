// StudySessions.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SingleStudySession from './SingleStudySession';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Spinner from '../Spinner/Spinner';

const StudySessions = () => {
  const axiosSecure = useAxiosSecure();
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['homeSessions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved');
      return res.data;
    },
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Spinner/>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Study Sessions</h1>
      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No study sessions available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map(session => (
            <SingleStudySession key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySessions;