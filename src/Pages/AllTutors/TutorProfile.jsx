import React from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router';
import { format, parseISO } from 'date-fns';

const TutorProfile = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();

    // Fetch tutor details
    const { data: tutor, isLoading: tutorLoading, error: tutorError } = useQuery({
        queryKey: ['tutor', id],
        queryFn: async() => {
            const res = await axiosInstance.get(`/tutor/${id}`);
            return res.data;
        }
    });

    // Fetch tutor sessions
    const { data: sessions = [], isLoading: sessionsLoading, error: sessionsError } = useQuery({
        queryKey: ['tutor-sessions', id],
        queryFn: async() => {
            const res = await axiosInstance.get(`/tutor-sessions/${id}`);
            return res.data;
        }
    });

    if (tutorLoading || sessionsLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
    
    if (tutorError) return <div className="text-center py-8 text-red-500">Error loading tutor: {tutorError.message}</div>;
    if (sessionsError) return <div className="text-center py-8 text-red-500">Error loading sessions: {sessionsError.message}</div>;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(parseISO(dateString), 'MMMM d, yyyy');
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'Invalid date';
        }
    };

    const formatSessionDateTime = (dateString) => {
        if (!dateString) return 'Date not set';
        try {
            return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
        } catch (e) {
            console.error('Session date formatting error:', e);
            return 'Invalid date';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Tutor Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <img 
                                src={tutor?.photoUrl || 'https://via.placeholder.com/150'} 
                                alt={tutor?.name || 'Tutor'}
                                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800">{tutor?.name || 'Unknown Tutor'}</h1>
                            <div className="mt-2 space-y-1">
                                <p className="text-gray-600">
                                    <span className="font-semibold">Email:</span> {tutor?.email || 'N/A'}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Member Since:</span> {formatDate(tutor?.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tutor Sessions */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Available Sessions</h2>
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                            {sessions?.length || 0} session{sessions?.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    
                    {sessions?.length > 0 ? (
                        <div className="space-y-4">
                            {sessions.map(session => (
                                <div key={session._id} className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-indigo-700">{session.title || 'Untitled Session'}</h3>
                                            <p className="text-gray-600 mt-1">{session.description || 'No description provided'}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            session.price === 0 || session.price === null ? 
                                                'bg-green-100 text-green-800' : 
                                                'bg-purple-100 text-purple-800'
                                        }`}>
                                            {session.price === 0 || session.price === null ? 'FREE' : `$${session.price}`}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatSessionDateTime(session.created_at)}
                                        </div>
                                        <div className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {session.duration || '?'}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500">
                                        Session ID: {session._id}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 mt-3">No sessions available at the moment.</p>
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link 
                        to="/all-tutors" 
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to All Tutors
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TutorProfile;