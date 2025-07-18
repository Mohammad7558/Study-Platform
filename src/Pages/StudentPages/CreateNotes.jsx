import React, { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { Button } from '../../Components/ui/button';
import { Input } from '../../Components/ui/input';
import { Textarea } from '../../Components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../Components/ui/dialog';
import { FiMail, FiFileText, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const CreateNotes = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({
        type: '', // 'success' or 'error'
        title: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!title || !description) {
            setDialogData({
                type: 'error',
                title: 'Error',
                message: 'Please fill in all fields'
            });
            setDialogOpen(true);
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
                setDialogData({
                    type: 'success',
                    title: 'Success',
                    message: 'Note created successfully!'
                });
                setDialogOpen(true);
                setTitle('');
                setDescription('');
            }
        } catch (error) {
            setDialogData({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'Failed to create note'
            });
            setDialogOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <FiFileText className="w-5 h-5 text-primary" />
                        Create New Note
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="pl-9 bg-muted/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Title *
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter note title"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Description *
                            </label>
                            <Textarea
                                id="description"
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter your note content"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto gap-2"
                        >
                            {isSubmitting && <FiLoader className="h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Creating...' : 'Create Note'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Dialog for showing messages */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            {dialogData.type === 'success' ? (
                                <FiCheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                                <FiAlertCircle className="h-6 w-6 text-red-500" />
                            )}
                            <DialogTitle>{dialogData.title}</DialogTitle>
                        </div>
                    </DialogHeader>
                    <DialogDescription className="pt-2">
                        {dialogData.message}
                    </DialogDescription>
                    <div className="flex justify-end pt-4">
                        <Button 
                            onClick={() => setDialogOpen(false)}
                            variant={dialogData.type === 'success' ? 'default' : 'destructive'}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateNotes;