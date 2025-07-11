// StudySessions.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SingleStudySession from './SingleStudySession';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const StudySessions = () => {
  const axiosSecure = useAxiosSecure();
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['homeSessions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved');
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {sessions.map(session => (
        <SingleStudySession key={session._id} session={session} />
      ))}
    </div>
  );
};

export default StudySessions;
