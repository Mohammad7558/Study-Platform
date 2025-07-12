import React, { useState } from 'react';
import {
    CheckIcon,
    XMarkIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SingleUser = ({ user, currentUserEmail, onRoleUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role);
    const isCurrentUser = user.email === currentUserEmail;

    const handleRoleChange = async () => {
        if (selectedRole === user.role) {
            setIsEditing(false);
            return;
        }

        try {
            await onRoleUpdate(user._id, selectedRole, user.role, user.email);
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || 'Failed to update role');
            setSelectedRole(user.role);
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {user.name || 'No name'}
                            {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    You
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <div className="flex items-center space-x-2">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            onClick={handleRoleChange}
                            className="text-green-600 hover:text-green-800"
                            aria-label="Save changes"
                        >
                            <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedRole(user.role);
                            }}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Cancel editing"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : user.role === 'tutor' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                        }`}>
                            {user.role}
                        </span>
                        {!isCurrentUser && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                                aria-label="Edit role"
                            >
                                <PencilSquareIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
};

export default SingleUser;