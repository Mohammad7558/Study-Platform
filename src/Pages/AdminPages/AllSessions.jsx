import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import ApproveSessionModal from './ApproveSessionModal';
import RejectSessionModal from './RejectSessionModal';
import UpdateSessionModal from './UpdateSessionModal';
import { format, parseISO, isValid } from 'date-fns';
import Swal from 'sweetalert2';

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
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        allowOutsideClick: false
    });

    if (!result.isConfirmed) return;

    try {
        Swal.fire({
            title: 'Deleting...',
            text: 'Please wait while we delete the session',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        await axiosSecure.delete(`/admin/sessions/${sessionId}`);
        
        await Swal.fire({
            title: 'Deleted!',
            text: 'Session has been deleted successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

        refetch();
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete session',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = parseISO(dateString);
            return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : 'Invalid date';
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'Invalid date';
        }
    };

    const filteredSessions = sessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tutorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tutorName.toLowerCase().includes(searchQuery.toLowerCase())
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
                    placeholder="Search sessions by title, tutor name or email..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Sessions Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading sessions...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">
                        <XCircleIcon className="h-12 w-12 mx-auto text-red-400" />
                        <p className="mt-2">Error: {error.message}</p>
                        <button 
                            onClick={() => refetch()}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="p-8 text-center">
                        <CheckCircleIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-500">No sessions found matching your search</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Session Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tutor
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
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
                                    <tr key={session._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <CurrencyDollarIcon className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {session.title || 'Untitled Session'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-clamp-2">
                                                        {session.description || 'No description provided'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{session.tutorName}</div>
                                            <div className="text-sm text-gray-500">{session.tutorEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start">
                                                {session.price > 0 ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                                        ${session.price}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        Free
                                                    </span>
                                                )}
                                                <span className="mt-1 text-xs text-gray-500">
                                                    {session.duration} minutes
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(session.startTime)}</div>
                                            <div className="text-xs text-gray-500">Created: {formatDate(session.created_at)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                session.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                {session.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(session)}
                                                            className="text-green-600 hover:text-green-900 flex items-center"
                                                            title="Approve"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(session)}
                                                            className="text-red-600 hover:text-red-900 flex items-center"
                                                            title="Reject"
                                                        >
                                                            <XCircleIcon className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleUpdate(session)}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(session._id)}
                                                    className="text-red-600 hover:text-red-900 flex items-center"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
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
                        toast.success('Session approved successfully!');
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
                        toast.success('Session rejected successfully!');
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
                        toast.success('Session updated successfully!');
                    }}
                    axiosSecure={axiosSecure}
                />
            )}
        </div>
    );
};

export default AllSessions;