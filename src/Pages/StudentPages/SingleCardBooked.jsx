import React from 'react';
import { Link } from 'react-router';
import { Badge } from '../../Components/ui/badge';
import { Button } from '../../Components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../Components/ui/card';
import { FiUser, FiCalendar, FiCheckCircle, FiXCircle, FiInfo, FiArrowRight } from 'react-icons/fi';

const SingleCardBooked = ({ session }) => {
  const { _id, title, tutorName, classStartDate, status } = session;

  // Enhanced status badge with custom color variants
  const renderStatusBadge = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge className="bg-emerald-50 text-emerald-800 hover:bg-emerald-50 gap-1.5">
            <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Completed</span>
          </Badge>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <Badge className="bg-rose-50 text-rose-800 hover:bg-rose-50 gap-1.5">
            <FiXCircle className="h-3.5 w-3.5 text-rose-600" />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </Badge>
        );
      case 'registered':
        return (
          <Badge className="bg-teal-50 text-teal-800 hover:bg-teal-50 gap-1.5">
            <FiCheckCircle className="h-3.5 w-3.5 text-teal-600" />
            <span>Registered</span>
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="bg-blue-50 text-blue-800 hover:bg-blue-50 gap-1.5">
            <FiInfo className="h-3.5 w-3.5 text-blue-600" />
            <span>Upcoming</span>
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="bg-indigo-50 text-indigo-800 hover:bg-indigo-50 gap-1.5">
            <FiCheckCircle className="h-3.5 w-3.5 text-indigo-600" />
            <span>Confirmed</span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-50 text-amber-800 hover:bg-amber-50 gap-1.5">
            <FiInfo className="h-3.5 w-3.5 text-amber-600" />
            <span>Pending</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1.5">
            <FiInfo className="h-3.5 w-3.5" />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </Badge>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-foreground line-clamp-2">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FiUser className="h-4 w-4 text-primary" />
          <span>Tutor: <span className="font-medium text-foreground">{tutorName}</span></span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FiCalendar className="h-4 w-4 text-primary" />
          <span>Date: <span className="font-medium text-foreground">
            {new Date(classStartDate).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span></span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4">
        {renderStatusBadge()}
        <Link to={`/dashboard/booked-sessions/${_id}`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            View Details
            <FiArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SingleCardBooked;