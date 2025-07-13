import React, { useState } from 'react';
import {
    CheckIcon,
    XMarkIcon,
    PencilSquareIcon,
    EnvelopeIcon,
    PhoneIcon,
    ShieldCheckIcon,
    AcademicCapIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const roleIcons = {
    admin: <ShieldCheckIcon className="h-4 w-4" />,
    tutor: <AcademicCapIcon className="h-4 w-4" />,
    student: <UserIcon className="h-4 w-4" />
};

const roleColors = {
    admin: 'purple',
    tutor: 'blue',
    student: 'green'
};

const SingleUser = ({ user, currentUserEmail, onRoleUpdate, formattedCreatedAt }) => {
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
        <tr className="hover:bg-gray-50 transition-colors">
            {/* User Info */}
            <td className="px-6 py-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        {user.photoURL ? (
                            <img 
                                src={user.photoURL} 
                                alt={user.name} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150';
                                }}
                            />
                        ) : (
                            <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-lg">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                                {user.name || 'No name'}
                            </p>
                            {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    You
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            ID: {user._id?.substring(0, 8)}...
                        </p>
                    </div>
                </div>
            </td>

            {/* Contact Info */}
            <td className="px-6 py-4">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-700">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-xs">{user.email}</span>
                    </div>
                    {user.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {user.phone}
                        </div>
                    )}
                </div>
            </td>

            {/* Role */}
            <td className="px-6 py-4">
                {isEditing ? (
                    <div className="flex items-center space-x-2">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            onClick={handleRoleChange}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            aria-label="Save changes"
                        >
                            <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedRole(user.role);
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label="Cancel editing"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            roleColors[user.role] === 'purple' 
                                ? 'bg-purple-100 text-purple-800' 
                                : roleColors[user.role] === 'blue' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                        }`}>
                            <span className="mr-1.5">{roleIcons[user.role]}</span>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        {!isCurrentUser && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Edit role"
                            >
                                <PencilSquareIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
            </td>

            {/* Join Date */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                    {formattedCreatedAt}
                </div>
            </td>
        </tr>
    );
};

export default SingleUser;