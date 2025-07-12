import React from 'react';
import { UserIcon, CheckIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const SingleAllSession = ({ session, onApprove, onReject, onUpdate, onDelete }) => {
    const getStatusBadge = () => {
        switch (session.status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSessionTypeBadge = () => {
        if (session.status !== 'approved') return null;
        
        return (
            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                session.sessionType === 'paid' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
            }`}>
                {session.sessionType === 'paid' ? `$${session.price}` : 'Free'}
            </span>
        );
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{session.title}</div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {session.description}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{session.tutorEmail}</div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <UserIcon className="flex-shrink-0 mr-1 h-4 w-4" />
                    {session.tutorName}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge()}`}>
                        {session.status}
                    </span>
                    {getSessionTypeBadge()}
                </div>
                {session.rejectionReason && (
                    <div className="text-xs text-gray-500 mt-1">
                        Reason: {session.rejectionReason}
                    </div>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {session.status === 'pending' ? (
                    <div className="flex space-x-4">
                        <button
                            onClick={onApprove}
                            className="text-green-600 hover:text-green-900 flex items-center"
                            title="Approve session"
                        >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Approve
                        </button>
                        <button
                            onClick={onReject}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Reject session"
                        >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Reject
                        </button>
                    </div>
                ) : session.status === 'approved' ? (
                    <div className="flex space-x-4">
                        <button
                            onClick={onUpdate}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="Update session"
                        >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Update
                        </button>
                        <button
                            onClick={onDelete}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Delete session"
                        >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                        </button>
                    </div>
                ) : null}
            </td>
        </tr>
    );
};

export default SingleAllSession;