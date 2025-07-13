import React from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

const AllTutors = () => {
    const axiosInstance = useAxios();

    const { data, isLoading, error } = useQuery({
        queryKey: ['all-tutor'],
        queryFn: async() => {
            const res = await axiosInstance.get('/all-tutor');
            return res.data;
        }
    });

    if (isLoading) return <div className="text-center py-8">Loading tutors...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error loading tutors: {error.message}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Expert Tutors</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.map(tutor => (
                    <div key={tutor._id.$oid} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-4">
                            <div className="flex justify-center mb-4">
                                <img 
                                    src={tutor.photoUrl || 'https://via.placeholder.com/150'} 
                                    alt={tutor.name} 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-800">{tutor.name}</h3>
                                <p className="text-indigo-600 mb-2">{tutor.role === 'tutor' ? 'Tutor' : 'Student'}</p>
                                <p className="text-gray-600 mb-4">{tutor.email}</p>
                                
                                <div className="flex justify-center space-x-2 mt-4">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                                        Joined: {new Date(tutor.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 flex justify-between">
                            <Link to={`/tutor-profile/${tutor._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                View Profile
                            </Link>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-md text-sm">
                                Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllTutors;