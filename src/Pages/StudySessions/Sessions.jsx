import React, { useState } from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import SingleStudySession from './SingleStudySection';
import { FiCalendar, FiFrown, FiLoader, FiSearch, FiX, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Input } from '../../Components/ui/input';
import { Skeleton } from '../../Components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../Components/ui/select';

const Sessions = () => {
  const axiosInstance = useAxios();
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['allSessions'],
    queryFn: async () => {
      const res = await axiosInstance.get('/sessions');
      return res.data;
    },
  });

  const approvedSessions = data.filter(session => session.status === 'approved');

  const filteredSessions = approvedSessions.filter((session) => {
    // Search filter
    const matchesSearch = 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Session type filter
    const matchesType = 
      sessionTypeFilter === 'all' || 
      session.sessionType === sessionTypeFilter;
    
    // Status filter
    const now = new Date();
    const start = new Date(session.registrationStartDate);
    const end = new Date(session.registrationEndDate);
    let matchesStatus = true;
    
    if (statusFilter === 'active') {
      matchesStatus = start <= now && now <= end;
    } else if (statusFilter === 'upcoming') {
      matchesStatus = start > now;
    } else if (statusFilter === 'closed') {
      matchesStatus = end < now;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSessionTypeFilter('all');
    setStatusFilter('all');
  };

  if (isLoading) {
    return (
      <div className="container py-10 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Skeleton className="h-10 w-full md:w-48" />
            <Skeleton className="h-10 w-full md:w-48" />
            <Skeleton className="h-10 w-full md:w-80" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
        <FiFrown className="text-4xl text-red-500 mb-4" />
        <p className="text-lg text-red-600 mb-2">Failed to load sessions</p>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (approvedSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
        <FiCalendar className="text-4xl text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No Study Sessions Available
        </h3>
        <p className="text-gray-500 max-w-md">
          There are currently no approved study sessions. Check back later or contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Sessions</h1>
          <p className="text-sm text-muted-foreground">
            {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'} available
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>
      </div>

      {(searchTerm || sessionTypeFilter !== 'all' || statusFilter !== 'all') && (
        <div className="flex items-center gap-2 mb-6">
          <p className="text-sm text-muted-foreground">Filters applied:</p>
          {(searchTerm || sessionTypeFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
            >
              Clear all
              <FiX size={14} />
            </button>
          )}
          {searchTerm && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')}>
                <FiX size={14} className="text-gray-500 hover:text-gray-700" />
              </button>
            </span>
          )}
          {sessionTypeFilter !== 'all' && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1">
              Type: {sessionTypeFilter}
              <button onClick={() => setSessionTypeFilter('all')}>
                <FiX size={14} className="text-gray-500 hover:text-gray-700" />
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('all')}>
                <FiX size={14} className="text-gray-500 hover:text-gray-700" />
              </button>
            </span>
          )}
        </div>
      )}

      {filteredSessions.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl bg-gray-50 dark:bg-gray-900/50">
          <FiSearch className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">No sessions found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {searchTerm 
              ? `No results for "${searchTerm}"` 
              : 'No sessions match your filters. Try adjusting your search criteria.'}
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSessions.map((session) => (
            <SingleStudySession key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sessions;