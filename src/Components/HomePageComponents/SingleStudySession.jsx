import React from 'react';
import { Link } from 'react-router';
import { FiCalendar, FiDollarSign, FiClock, FiZap, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { Badge } from '../../Components/ui/badge';
import { Button } from '../../components/ui/button';

const SingleStudySession = ({ session }) => {
  const {
    _id,
    title,
    description,
    registrationStartDate,
    registrationEndDate,
    sessionType,
    price,
  } = session;

  const now = new Date();
  const start = new Date(registrationStartDate);
  const end = new Date(registrationEndDate);

  const getSessionStatus = () => {
    if (start > now) return 'upcoming';
    if (end < now) return 'closed';
    return 'active';
  };

  const status = getSessionStatus();

  const formatDate = (dateString) => format(new Date(dateString), 'MMM dd, yyyy');

  const statusConfig = {
    upcoming: {
      icon: <FiClock className="h-4 w-4" />,
      text: 'Upcoming',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    active: {
      icon: <FiZap className="h-4 w-4" />,
      text: 'Ongoing',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    closed: {
      icon: <FiXCircle className="h-4 w-4" />,
      text: 'Closed',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    },
  };

  return (
    <div className={`flex flex-col h-full p-5 rounded-lg border shadow-sm transition-all
      ${status === 'closed' ? 'opacity-90' : 'hover:shadow-md'}
      bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700`}
    >
      {/* Header with status badge */}
      <div className="flex justify-between items-start mb-3">
        <Badge className={`${statusConfig[status].color} text-sm font-medium`}>
          <div className="flex items-center gap-1.5">
            {statusConfig[status].icon}
            {statusConfig[status].text}
          </div>
        </Badge>
        <span className={`text-xs px-2 py-1 rounded-full ${
          sessionType === 'free' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        }`}>
          {sessionType === 'free' ? 'FREE' : 'PREMIUM'}
        </span>
      </div>

      {/* Title and description */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {description}
      </p>

      {/* Session details */}
      <div className="mt-auto space-y-3 text-sm">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <FiCalendar className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <span>
            {formatDate(registrationStartDate)} - {formatDate(registrationEndDate)}
          </span>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <FiDollarSign className="mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <span>
            {sessionType === 'free' ? 'Free' : `$${price}`}
          </span>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-5">
        <Link to={`/session/${_id}`} className="w-full block">
          <Button
            disabled={status === 'closed'}
            className={`w-full text-sm font-medium ${
              status === 'active'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            variant={status === 'active' ? 'default' : 'outline'}
          >
            {status === 'active' 
              ? 'Register Now' 
              : status === 'upcoming' 
                ? 'Get Notified' 
                : 'View Details'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SingleStudySession;