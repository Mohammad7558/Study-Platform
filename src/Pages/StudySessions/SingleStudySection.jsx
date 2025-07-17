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

  const isActive = () => {
    const now = new Date();
    const start = new Date(registrationStartDate);
    const end = new Date(registrationEndDate);
    return start <= now && now <= end;
  };

  const isUpcoming = () => {
    const now = new Date();
    const start = new Date(registrationStartDate);
    return start > now;
  };

  const formatDate = (dateString) => format(new Date(dateString), 'MMM dd, yyyy');

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <div className="flex-grow">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
            {title}
          </h2>
          <Badge 
            className={`flex items-center gap-1 ${
              isUpcoming() 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                : isActive()
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}
          >
            {isUpcoming() ? (
              <>
                <FiClock className="h-3 w-3" />
                Upcoming
              </>
            ) : isActive() ? (
              <>
                <FiZap className="h-3 w-3" />
                <span className="font-medium">Ongoing</span>
              </>
            ) : (
              <>
                <FiXCircle className="h-3 w-3" />
                Closed
              </>
            )}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{description}</p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FiCalendar className="mr-2 text-gray-500 flex-shrink-0" />
            <span>
              {formatDate(registrationStartDate)} - {formatDate(registrationEndDate)}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FiDollarSign className="mr-2 text-gray-500 flex-shrink-0" />
            <span>{sessionType === 'free' ? 'Free session' : `Paid: $${price}`}</span>
          </div>
        </div>
      </div>

      <Link to={`/session/${_id}`} className="mt-6">
        <Button variant="default" className="w-full group-hover:bg-primary/90">
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </Link>
    </div>
  );
};

export default SingleStudySession;