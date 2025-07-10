// pages/Sessions.jsx
import React from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import SingleStudySession from './SingleStudySection';

const Sessions = () => {
  const axiosInstance = useAxios();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['allSessions'],
    queryFn: async () => {
      const res = await axiosInstance.get('/sessions');
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading sessions...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  const approvedSessions = data.filter(session => session.status === 'approved');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {approvedSessions.map(session => (
        <SingleStudySession key={session._id} session={session} />
      ))}
    </div>
  );
};

export default Sessions;
