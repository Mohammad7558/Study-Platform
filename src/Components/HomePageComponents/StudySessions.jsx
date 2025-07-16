import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SingleStudySession from './SingleStudySession';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FiCalendar, FiSearch, FiFilter, FiFrown } from 'react-icons/fi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import { Input } from "../../Components/ui/input";
import { Button } from "../../Components/ui/button";
import { Skeleton } from "../../Components/ui/skeleton";

const StudySessions = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all');

  const { data: sessions = [], isLoading, isError } = useQuery({
    queryKey: ['homeSessions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/approved');
      return res.data;
    },
  });

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         session.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const start = new Date(session.registrationStartDate);
    const end = new Date(session.registrationEndDate);
    const isActive = start <= now && now <= end;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && isActive) || 
                         (statusFilter === 'closed' && !isActive);
    
    const matchesType = sessionTypeFilter === 'all' || 
                       session.sessionType === sessionTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) return (
    <div className="container mx-auto px-4 my-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <Skeleton className="h-10 w-full md:w-1/3 rounded-lg" />
          <div className="flex gap-2 w-full md:w-auto">
            <Skeleton className="h-10 w-1/3 md:w-32 rounded-lg" />
            <Skeleton className="h-10 w-1/3 md:w-32 rounded-lg" />
            <Skeleton className="h-10 w-1/3 md:w-32 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isError) return (
    <div className="container mx-auto px-4 my-10 text-center py-20">
      <FiFrown className="mx-auto h-16 w-16 text-red-400 mb-4" />
      <h3 className="text-2xl font-medium text-gray-900 mb-2">Failed to load sessions</h3>
      <p className="text-gray-600 mb-6">We couldn't load the study sessions. Please try again.</p>
      <Button 
        variant="outline" 
        onClick={() => window.location.reload()}
        className="gap-2"
      >
        Retry
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Study Sessions</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Find and join study groups</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              className="pl-10 w-full rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] pl-9 rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
              <SelectTrigger className="w-[140px] pl-9 rounded-lg">
                
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300 mt-10">
          <FiCalendar className="mx-auto h-14 w-14 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {searchTerm 
              ? `No results for "${searchTerm}"` 
              : 'No sessions match your current filters'}
          </p>
          {(searchTerm || statusFilter !== 'all' || sessionTypeFilter !== 'all') && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSessionTypeFilter('all');
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSessions.map(session => (
            <SingleStudySession key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySessions;