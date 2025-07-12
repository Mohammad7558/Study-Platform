import React, { useEffect } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FiAlertTriangle, FiInfo, FiClock, FiCalendar, FiUser, FiBook, FiRefreshCw } from 'react-icons/fi';

const ViewRejectedFeedBacks = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    // Fetch all rejected sessions for the tutor with enhanced error handling
    const { 
        data: rejectedSessions = [], 
        isLoading, 
        error,
        refetch,
        isRefetching 
    } = useQuery({
        queryKey: ['tutor-rejected-sessions', user?.email],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/tutor-rejected-sessions?email=${user?.email}`);
                return res.data;
            } catch (err) {
                throw new Error(err.response?.data?.message || 'Failed to fetch rejected sessions');
            }
        },
        enabled: !!user?.email,
        staleTime: 0, // Always consider data stale
        refetchOnMount: true, // Refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window regains focus
    });

    // Force a refetch when the component mounts
    useEffect(() => {
        if (user?.email) {
            refetch();
        }
    }, [user?.email, refetch]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return "Invalid date";
        }
    };

    const handleManualRefresh = async () => {
        await refetch();
    };

    if (isLoading || isRefetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                    <FiRefreshCw className="animate-spin text-blue-500 text-2xl mb-2" />
                    <p className="text-gray-600">Loading rejected sessions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <FiAlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-red-600">Error Loading Data</h2>
                <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">{error.message}</p>
                <button
                    onClick={handleManualRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                    <FiRefreshCw className="mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    // Separate sessions with feedback and those without
    const sessionsWithFeedback = rejectedSessions.filter(session => 
        session.rejectionReason || session.feedback
    );
    
    const sessionsWithoutFeedback = rejectedSessions.filter(session => 
        !session.rejectionReason && !session.feedback
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Rejected Sessions Feedback</h1>
                <button
                    onClick={handleManualRefresh}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    disabled={isRefetching}
                >
                    <FiRefreshCw className={`mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>
            
            {/* Sessions with feedback */}
            <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <FiAlertTriangle className="mr-2 text-red-500" />
                    Sessions with Feedback ({sessionsWithFeedback.length})
                </h2>
                
                {sessionsWithFeedback.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-blue-700">No sessions with feedback available</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sessionsWithFeedback.map((session) => (
                            <div key={session._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-red-100">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                                <FiBook className="mr-2 text-blue-500" />
                                                {session.title}
                                            </h2>
                                            <div className="flex items-center mt-1 text-gray-600">
                                                <FiUser className="mr-1" />
                                                <span className="text-sm">
                                                    Subject: {session.subject || 'Not specified'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-2">
                                                Rejected
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Updated: {formatDate(session.updatedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {session.rejectionReason && (
                                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                                <div className="flex items-center mb-2">
                                                    <FiAlertTriangle className="text-red-500 mr-2" />
                                                    <h3 className="font-semibold text-red-800">Rejection Reason</h3>
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-wrap">
                                                    {session.rejectionReason}
                                                </p>
                                            </div>
                                        )}

                                        {session.feedback && (
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <div className="flex items-center mb-2">
                                                    <FiInfo className="text-blue-500 mr-2" />
                                                    <h3 className="font-semibold text-blue-800">Admin Feedback</h3>
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-wrap">
                                                    {session.feedback}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-medium text-gray-700 mb-3">Session Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center">
                                                <FiCalendar className="text-gray-500 mr-2" />
                                                <span className="text-sm text-gray-600">
                                                    Dates: {formatDate(session.classStartDate)} - {formatDate(session.classEndDate)}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiClock className="text-gray-500 mr-2" />
                                                <span className="text-sm text-gray-600">
                                                    Duration: {session.duration} days
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiCalendar className="text-gray-500 mr-2" />
                                                <span className="text-sm text-gray-600">
                                                    Submitted: {formatDate(session.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sessions without feedback */}
            {sessionsWithoutFeedback.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <FiInfo className="mr-2 text-yellow-500" />
                        Other Rejected Sessions ({sessionsWithoutFeedback.length})
                    </h2>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <p className="text-yellow-700 mb-4">
                            The following sessions were rejected but don't have specific feedback yet.
                        </p>
                        <div className="space-y-4">
                            {sessionsWithoutFeedback.map(session => (
                                <div key={session._id} className="bg-white p-4 rounded border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{session.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                Rejected on: {formatDate(session.updatedAt)}
                                            </p>
                                        </div>
                                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                            No feedback
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewRejectedFeedBacks;