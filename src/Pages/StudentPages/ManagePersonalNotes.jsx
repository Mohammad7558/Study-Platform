import React, { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManagePersonalNotes = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editingNote, setEditingNote] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Fetch all notes for the current user
    const { data: notes = [], isLoading, refetch } = useQuery({
        queryKey: ['notes', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notes?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // Handle delete note
    const handleDeleteNote = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/notes/${id}`);
                    Swal.fire(
                        'Deleted!',
                        'Your note has been deleted.',
                        'success'
                    );
                    refetch();
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        error.response?.data?.message || 'Failed to delete note',
                        'error'
                    );
                }
            }
        });
    };

    // Handle edit note
    const handleEditNote = (note) => {
        setEditingNote(note);
        setEditTitle(note.title);
        setEditDescription(note.description);
    };

    // Handle update note
    const handleUpdateNote = async (e) => {
        e.preventDefault();
        try {
            const updatedNote = {
                title: editTitle,
                description: editDescription,
                updatedAt: new Date()
            };

            await axiosSecure.patch(`/notes/${editingNote._id}`, updatedNote);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Note updated successfully!',
            });
            setEditingNote(null);
            refetch();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update note',
            });
        }
    };

    if (isLoading) return <div className="text-center mt-8">Loading your notes...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Manage Your Notes ({notes.length})</h1>

            {/* Edit Note Modal */}
            {editingNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">Edit Note</h2>
                        <form onSubmit={handleUpdateNote}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    rows={6}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingNote(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notes List */}
            {notes.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">You haven't created any notes yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <div key={note._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                            <p className="text-gray-600 mb-4 whitespace-pre-line">{note.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditNote(note)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNote(note._id)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManagePersonalNotes;