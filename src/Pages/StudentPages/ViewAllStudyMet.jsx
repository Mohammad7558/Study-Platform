import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaTimes, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

const ViewAllStudyMet = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch booked sessions for the student
    const { data: bookedSessions = [] } = useQuery({
        queryKey: ['bookedSessions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/booked-sessions?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Fetch materials for the selected session
    const { data: materials = [] } = useQuery({
        queryKey: ['materials', selectedSession],
        queryFn: async () => {
            if (!selectedSession) return [];
            const res = await axiosSecure.get(`/materials?sessionId=${selectedSession}`);
            return res.data;
        },
        enabled: !!selectedSession
    });

    console.log(materials);

    // Handle download image
    const handleDownload = (imageUrl, fileName) => {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || 'study-material';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Download Failed',
                    text: 'Could not download the file'
                });
            });
    };

    // Open image in modal
    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    // Close image modal
    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Study Materials</h1>
            
            {/* Booked Sessions List */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Booked Sessions</h2>
                {bookedSessions.length === 0 ? (
                    <p className="text-gray-500">You haven't booked any sessions yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bookedSessions.map(session => (
                            <div 
                                key={session._id} 
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedSession === session.sessionId ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                                onClick={() => setSelectedSession(session.sessionId)}
                            >
                                <h3 className="font-medium">{session.sessionTitle}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Tutor: {session.tutorName}
                                </p>
                                <button 
                                    className="mt-2 text-blue-600 text-sm font-medium flex items-center gap-1"
                                >
                                    {selectedSession === session.sessionId ? 'Showing Materials' : 'View Materials'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Materials for Selected Session */}
            {selectedSession && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Available Materials</h2>
                        <button 
                            onClick={() => setSelectedSession(null)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                            <FaTimes /> Close
                        </button>
                    </div>
                    
                    {materials.length === 0 ? (
                        <p className="text-gray-500">No materials available for this session yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {materials.map(material => (
                                <div key={material._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 className="font-medium text-lg mb-2">{material.title}</h3>
                                    
                                    {material.image && (
                                        <div className="mb-3">
                                            <div 
                                                className="w-full h-48 bg-gray-100 rounded border mb-2 overflow-hidden cursor-zoom-in"
                                                onClick={() => openImageModal(material.imageUrl)}
                                            >
                                                <img 
                                                    src={material.image} 
                                                    alt={material.title} 
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDownload(material.image, material.title)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                                                >
                                                    <FaDownload /> Download
                                                </button>
                                                <button
                                                    onClick={() => openImageModal(material.image)}
                                                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                                                >
                                                    View Fullscreen
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {material.link && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Resource Link:</p>
                                            <a 
                                                href={material.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all flex items-center gap-1"
                                            >
                                                <FaExternalLinkAlt /> {material.link}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl w-full">
                        <button 
                            onClick={closeImageModal}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
                        >
                            <FaTimes />
                        </button>
                        <img 
                            src={selectedImage} 
                            alt="Enlarged study material" 
                            className="max-h-[90vh] max-w-full mx-auto"
                        />
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={() => handleDownload(selectedImage, 'study-material')}
                                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                <FaDownload /> Download
                            </button>
                            <button
                                onClick={closeImageModal}
                                className="bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAllStudyMet;