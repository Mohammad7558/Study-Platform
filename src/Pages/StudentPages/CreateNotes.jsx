import React, { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const CreateNotes = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!title || !description) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields',
            });
            setIsSubmitting(false);
            return;
        }

        const noteData = {
            email: user.email,
            title,
            description,
            createdAt: new Date(),
        };

        try {
            const res = await axiosSecure.post('/create-notes', noteData);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Note created successfully!',
                });
                setTitle('');
                setDescription('');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to create note',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Create New Note</h1>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={user?.email || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter note title"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your note content"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                    {isSubmitting ? 'Creating...' : 'Create Note'}
                </button>
            </form>
        </div>
    );
};

export default CreateNotes;