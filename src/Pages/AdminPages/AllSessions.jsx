import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import SingleAllSession from './SingleAllSession';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import ApproveSessionModal from './ApproveSessionModal';
import RejectSessionModal from './RejectSessionModal';
import UpdateSessionModal from './UpdateSessionModal';

const AllSessions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const axiosSecure = useAxiosSecure();

    const { 
        data: sessions = [], 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['admin-sessions'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/admin/sessions');
            return data;
        },
    });

    const handleApprove = (session) => {
        setSelectedSession(session);
        setShowApproveModal(true);
    };

    const handleReject = (session) => {
        setSelectedSession(session);
        setShowRejectModal(true);
    };

    const handleUpdate = (session) => {
        setSelectedSession(session);
        setShowUpdateModal(true);
    };

    const handleDelete = async (sessionId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this session?');
        if (!confirmDelete) return;

        const deletePromise = axiosSecure.delete(`/admin/sessions/${sessionId}`);

        toast.promise(deletePromise, {
            loading: 'Deleting session...',
            success: () => {
                refetch();
                return 'Session deleted successfully!';
            },
            error: 'Failed to delete session',
        });
    };

    const filteredSessions = sessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tutorEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Session Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage all tutor-created sessions
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative rounded-md shadow-sm max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search sessions by title or tutor email..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Sessions Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading sessions...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">
                        Error: {error.message}
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No sessions found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tutor
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSessions.map(session => (
                                    <SingleAllSession 
                                        key={session._id} 
                                        session={session} 
                                        onApprove={() => handleApprove(session)}
                                        onReject={() => handleReject(session)}
                                        onUpdate={() => handleUpdate(session)}
                                        onDelete={() => handleDelete(session._id)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showApproveModal && (
                <ApproveSessionModal
                    session={selectedSession}
                    onClose={() => setShowApproveModal(false)}
                    onSuccess={() => {
                        refetch();
                        setShowApproveModal(false);
                    }}
                    axiosSecure={axiosSecure}
                />
            )}

            {showRejectModal && (
                <RejectSessionModal
                    session={selectedSession}
                    onClose={() => setShowRejectModal(false)}
                    onSuccess={() => {
                        refetch();
                        setShowRejectModal(false);
                    }}
                    axiosSecure={axiosSecure}
                />
            )}

            {showUpdateModal && (
                <UpdateSessionModal
                    session={selectedSession}
                    onClose={() => setShowUpdateModal(false)}
                    onSuccess={() => {
                        refetch();
                        setShowUpdateModal(false);
                    }}
                    axiosSecure={axiosSecure}
                />
            )}
        </div>
    );
};

export default AllSessions;