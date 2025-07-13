import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import SingleUser from './SingleUser';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import { format, parseISO, isValid } from 'date-fns';

const AllUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const axiosSecure = useAxiosSecure();
    const { user: currentUser } = useAuth();

    // Format date safely
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = parseISO(dateString);
            return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'Invalid date';
        }
    };

    // Fetch users with React Query
    const { 
        data: users = [], 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['users', searchQuery],
        queryFn: async () => {
            const endpoint = searchQuery 
                ? `/search-users?query=${encodeURIComponent(searchQuery)}`
                : '/all-users';
            const { data } = await axiosSecure.get(endpoint);
            
            return data.map(user => ({
                ...user,
                formattedCreatedAt: formatDate(user.createdAt || user.created_at)
            }));
        },
        staleTime: 5 * 60 * 1000,
    });

    const filteredUsers = users.filter(user => 
        roleFilter === 'all' || user.role === roleFilter
    );

    const handleRoleUpdate = async (userId, newRole, currentRole) => {
        if (newRole === currentRole) return;

        const updatePromise = axiosSecure.patch(
            `/update-user-role/${userId}`,
            { 
                role: newRole,
                currentUserEmail: currentUser.email
            }
        );

        toast.promise(updatePromise, {
            loading: 'Updating user role...',
            success: () => {
                refetch();
                return 'User role updated successfully!';
            },
            error: (err) => {
                return err.response?.data?.message || 'Failed to update user role';
            },
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage all registered users and their permissions
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative rounded-md shadow-sm flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="tutor">Tutor</option>
                        <option value="student">Student</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow overflow-hidden rounded-xl border border-gray-100">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading user data...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">
                        <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-400" />
                        <p className="mt-2 font-medium">Error loading users</p>
                        <p className="text-sm mt-1">{error.message}</p>
                        <button 
                            onClick={() => refetch()}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-8 text-center">
                        <UserCircleIcon className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="mt-3 text-gray-500 font-medium">No users found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {searchQuery ? 'Try a different search' : 'No users registered yet'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map(user => (
                                    <SingleUser 
                                        key={user._id} 
                                        user={user} 
                                        currentUserEmail={currentUser?.email}
                                        onRoleUpdate={handleRoleUpdate}
                                        formattedCreatedAt={user.formattedCreatedAt}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsers;