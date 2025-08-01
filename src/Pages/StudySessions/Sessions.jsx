import React, { useState, useEffect, useRef } from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import SingleStudySession from './SingleStudySection';
import { FiCalendar, FiFrown, FiLoader, FiSearch, FiX, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Input } from '../../Components/ui/input';
import { Skeleton } from '../../Components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../Components/ui/select';
import { Button } from '../../Components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Sessions = () => {
  const axiosInstance = useAxios();
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const resultsRef = useRef(null);
  const containerRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(8);
  const [isPaginating, setIsPaginating] = useState(false);

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['allSessions'],
    queryFn: async () => {
      const res = await axiosInstance.get('/sessions');
      return res.data;
    },
  });

  const approvedSessions = data.filter(session => session.status === 'approved');

  const filteredSessions = approvedSessions.filter((session) => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      sessionTypeFilter === 'all' || 
      session.sessionType === sessionTypeFilter;
    
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

  // Pagination logic
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  const paginate = async (pageNumber) => {
    if (pageNumber === currentPage || pageNumber < 1 || pageNumber > totalPages) return;
    
    setIsPaginating(true);
    
    // Store current scroll position relative to the container
    const container = containerRef.current;
    const scrollY = window.scrollY;
    const containerTop = container ? container.getBoundingClientRect().top + scrollY : 0;
    
    await new Promise(resolve => setTimeout(resolve, 150));
    setCurrentPage(pageNumber);
    
    // After the state update and DOM render, restore scroll position
    requestAnimationFrame(() => {
      if (container) {
        const newContainerTop = container.getBoundingClientRect().top + window.scrollY;
        const scrollOffset = containerTop - newContainerTop;
        window.scrollTo({
          top: scrollY + scrollOffset,
          behavior: 'smooth'
        });
      }
      setIsPaginating(false);
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSessionTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Auto-reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sessionTypeFilter, statusFilter]);

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

  // Function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the start
      if (currentPage <= 3) {
        endPage = 4;
      }
      // Adjust if we're at the end
      else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis-left');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-right');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="container py-10 mx-auto px-5" ref={containerRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Showing {Math.min(indexOfLastSession, filteredSessions.length)} of {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
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

          <Select 
            value={sessionTypeFilter} 
            onValueChange={setSessionTypeFilter}
          >
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
          <button
            onClick={clearFilters}
            className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
          >
            Clear all
            <FiX size={14} />
          </button>
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

      {currentSessions.length === 0 ? (
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
        <>
          <div ref={resultsRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`page-${currentPage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {isPaginating && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <motion.div
                      animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    >
                      <FiLoader className="text-3xl text-primary" />
                    </motion.div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                  {currentSessions.map((session) => (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "backOut" }}
                      layout="position"
                    >
                      <SingleStudySession session={session} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstSession + 1}-{Math.min(indexOfLastSession, filteredSessions.length)} of {filteredSessions.length} results
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                  aria-label="First page"
                >
                  <FiChevronsLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1 mx-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {typeof page === 'string' ? (
                        <span className="px-2 py-1 text-sm text-gray-500">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => paginate(page)}
                          className="min-w-[40px]"
                          aria-label={`Page ${page}`}
                        >
                          {page}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <FiChevronRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex"
                  aria-label="Last page"
                >
                  <FiChevronsRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 sm:hidden">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sessions;