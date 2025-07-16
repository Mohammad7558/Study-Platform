import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useSessionBookingCount = (sessionId) => {
  const [axiosSecure] = useAxiosSecure();

  const { data: count = 0, isLoading } = useQuery({
    queryKey: ['booking-count', sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/session/${sessionId}/bookings-count`);
      return res.data.totalBookings;
    },
  });

  return { count, isLoading };
};

export default useSessionBookingCount;
