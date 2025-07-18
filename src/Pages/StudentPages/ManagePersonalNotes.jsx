import React, { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { 
  FiEdit2, 
  FiTrash2, 
  FiFileText, 
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/ui/card';
import { Button } from '../../Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../Components/ui/dialog';
import { Input } from '../../Components/ui/input';
import { Textarea } from '../../Components/ui/textarea';

const ManagePersonalNotes = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editingNote, setEditingNote] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({
        type: '', // 'success' or 'error'
        title: '',
        message: ''
    });

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
        setDialogData({
            type: 'confirm',
            title: 'Are you sure?',
            message: "You won't be able to revert this!",
            action: async () => {
                try {
                    await axiosSecure.delete(`/notes/${id}`);
                    setDialogData({
                        type: 'success',
                        title: 'Deleted!',
                        message: 'Your note has been deleted.'
                    });
                    setDialogOpen(true);
                    refetch();
                } catch (error) {
                    setDialogData({
                        type: 'error',
                        title: 'Error!',
                        message: error.response?.data?.message || 'Failed to delete note'
                    });
                    setDialogOpen(true);
                }
            }
        });
        setDialogOpen(true);
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
            setDialogData({
                type: 'success',
                title: 'Success',
                message: 'Note updated successfully!'
            });
            setDialogOpen(true);
            setEditingNote(null);
            refetch();
        } catch (error) {
            setDialogData({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update note'
            });
            setDialogOpen(true);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <FiLoader className="animate-spin h-8 w-8 text-primary" />
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <FiFileText className="w-5 h-5 text-primary" />
                        Manage Your Notes ({notes.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Notes List */}
                    {notes.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            You haven't created any notes yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.map((note) => (
                                <Card key={note._id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{note.title}</h3>
                                        <p className="text-muted-foreground mb-4 whitespace-pre-line line-clamp-3">
                                            {note.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <FiCalendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditNote(note)}
                                                    className="h-8 w-8"
                                                >
                                                    <FiEdit2 className="h-4 w-4 text-primary" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteNote(note._id)}
                                                    className="h-8 w-8"
                                                >
                                                    <FiTrash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Note Dialog */}
            <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FiEdit2 className="h-5 w-5" />
                            Edit Note
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateNote} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Title *</label>
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Description *</label>
                            <Textarea
                                rows={6}
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setEditingNote(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Update Note</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Status Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            {dialogData.type === 'success' ? (
                                <FiCheckCircle className="h-6 w-6 text-green-500" />
                            ) : dialogData.type === 'error' ? (
                                <FiAlertCircle className="h-6 w-6 text-red-500" />
                            ) : (
                                <FiAlertCircle className="h-6 w-6 text-yellow-500" />
                            )}
                            <DialogTitle>{dialogData.title}</DialogTitle>
                        </div>
                    </DialogHeader>
                    <DialogDescription className="pt-2">
                        {dialogData.message}
                    </DialogDescription>
                    <div className="flex justify-end gap-2 pt-4">
                        {dialogData.type === 'confirm' ? (
                            <>
                                <Button 
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="destructive"
                                    onClick={() => {
                                        dialogData.action();
                                        setDialogOpen(false);
                                    }}
                                >
                                    Confirm
                                </Button>
                            </>
                        ) : (
                            <Button 
                                onClick={() => setDialogOpen(false)}
                                variant={dialogData.type === 'success' ? 'default' : 'destructive'}
                            >
                                Close
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManagePersonalNotes;