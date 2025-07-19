import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import {
  FiX,
  FiDownload,
  FiExternalLink,
  FiBookOpen,
  FiCalendar,
  FiUser,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiBookmark
} from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../Components/ui/card';
import { Button } from '../../Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../Components/ui/dialog';
import { Badge } from '../../Components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router';

const ViewAllStudyMet = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [messageDialogOpen, setMessageDialogOpen] = useState(false);
    const [messageDialogData, setMessageDialogData] = useState({
        type: '', // 'success' or 'error'
        title: '',
        message: ''
    });

    // Format date safely


    // Format short date safely
    const formatShortDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(parseISO(dateString), 'MMM dd');
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // Fetch booked sessions for the student
    const { data: bookedSessions = [], isLoading: sessionsLoading, error: sessionsError } = useQuery({
        queryKey: ['bookedSessions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/booked-sessions?email=${user?.email}`); 
            return res.data || [];
        },
        enabled: !!user?.email
    });

    // Fetch materials for the selected session
    const { data: materials = [], isLoading: materialsLoading, error: materialsError } = useQuery({
        queryKey: ['materials', selectedSession],
        queryFn: async () => {
            if (!selectedSession) return [];
            const res = await axiosSecure.get(`/materials?sessionId=${selectedSession}`);
            return res.data || [];
        },
        enabled: !!selectedSession
    });

    // Handle download image
    const handleDownload = async (imageUrl, fileName) => {
        if (!imageUrl) {
            setMessageDialogData({
                type: 'error',
                title: 'Download Failed',
                message: 'No file available to download'
            });
            setMessageDialogOpen(true);
            return;
        }

        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Failed to fetch file');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'study-material';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            setMessageDialogData({
                type: 'success',
                title: 'Download Started',
                message: 'Your file download has begun'
            });
            setMessageDialogOpen(true);
        } catch (error) {
            setMessageDialogData({
                type: 'error',
                title: 'Download Failed',
                message: error.message || 'Could not download the file'
            });
            setMessageDialogOpen(true);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-0">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <FiBookOpen className="w-5 h-5 text-primary" />
                        Study Materials
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                        Access all learning materials from your booked sessions
                    </p>
                </CardHeader>
                <CardContent className="mt-6">
                    {/* Booked Sessions List */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FiCalendar className="h-5 w-5" />
                                Your Booked Sessions
                            </h2>
                            {selectedSession && (
                                <Badge variant="outline" className="px-3 py-1">
                                    {bookedSessions.find(s => s?.sessionId === selectedSession)?.sessionTitle || 'Selected Session'}
                                </Badge>
                            )}
                        </div>
                        
                        {sessionsLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <FiLoader className="animate-spin h-8 w-8 text-primary" />
                                <p className="text-muted-foreground">Loading your sessions...</p>
                            </div>
                        ) : sessionsError ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                                <FiAlertCircle className="h-10 w-10 text-destructive" />
                                <p className="text-muted-foreground">Failed to load sessions.</p>
                                <Button 
                                    variant="outline" 
                                    className="mt-2"
                                    onClick={() => window.location.reload()}
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : bookedSessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                                <FiBookOpen className="h-10 w-10 text-muted-foreground" />
                                <p className="text-muted-foreground">You haven't booked any sessions yet.</p>
                                <Link to='/all-sessions'><Button variant="outline" className="mt-2 cursor-pointer">
                                    Browse Available Sessions
                                </Button></Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {bookedSessions.map(session => (
                                    <Card
                                        key={session?._id || Math.random().toString(36).substring(2, 9)}
                                        className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${
                                            selectedSession === session?.sessionId ? 'border-primary bg-primary/5' : ''
                                        }`}
                                        onClick={() => setSelectedSession(session?.sessionId)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-medium line-clamp-1 flex items-center gap-2">
                                                        <FiBookmark className="h-4 w-4 text-primary" />
                                                        {session?.title || 'Untitled Session'}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                                        <FiUser className="h-4 w-4" />
                                                        {session?.tutorName || 'Unknown Tutor'}
                                                    </p>
                                                </div>
                                                {selectedSession === session?.sessionId && (
                                                    <Badge className="ml-2">Active</Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Button 
                                                variant="link"
                                                className="px-0 h-auto text-primary flex items-center gap-1 w-full justify-start"
                                            >
                                                {selectedSession === session?.sessionId ? 
                                                    'Currently Viewing' : 
                                                    'View Materials'}
                                                <FiExternalLink className="h-3 w-3" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Materials for Selected Session */}
                    {selectedSession && (
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <FiBookOpen className="h-5 w-5" />
                                        Available Materials
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {bookedSessions.find(s => s?.sessionId === selectedSession)?.sessionTitle || 'Selected Session'}
                                    </p>
                                </div>
                                <Button 
                                    variant="ghost"
                                    onClick={() => setSelectedSession(null)}
                                    className="text-destructive flex items-center gap-1"
                                >
                                    <FiX /> Close
                                </Button>
                            </div>
                            
                            {materialsLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2">
                                    <FiLoader className="animate-spin h-8 w-8 text-primary" />
                                    <p className="text-muted-foreground">Loading materials...</p>
                                </div>
                            ) : materialsError ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2">
                                    <FiAlertCircle className="h-10 w-10 text-destructive" />
                                    <p className="text-muted-foreground">Failed to load materials.</p>
                                    <Button 
                                        variant="outline" 
                                        className="mt-2"
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            ) : materials.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2">
                                    <FiBookOpen className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-muted-foreground">No materials available for this session yet.</p>
                                    <p className="text-sm text-muted-foreground">Check back later or contact your tutor.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {materials.map(material => (
                                        <Card key={material?._id || Math.random().toString(36).substring(2, 9)} className="hover:shadow-md transition-shadow group">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-medium text-lg line-clamp-1 flex items-center gap-2">
                                                        <FiBookmark className="h-4 w-4 text-primary opacity-70" />
                                                        {material?.title || 'Untitled Material'}
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatShortDate(material?.createdAt)}
                                                    </span>
                                                </div>
                                                
                                                {material?.image && (
                                                    <div className="mb-4">
                                                        <div 
                                                            className="w-full h-48 bg-muted rounded-md border mb-2 overflow-hidden cursor-zoom-in relative group"
                                                            onClick={() => setSelectedImage(material.image)}
                                                        >
                                                            <img 
                                                                src={material.image} 
                                                                alt={material.title || 'Study material'} 
                                                                className="w-full h-full object-contain transition-transform group-hover:scale-105"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="bg-white/90 text-black px-2 py-1 rounded text-xs font-medium">
                                                                    Click to enlarge
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleDownload(material.image, material.title)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <FiDownload size={14} /> Download
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setSelectedImage(material.image)}
                                                            >
                                                                Preview
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {material?.link && (
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">Google Drive Resource:</p>
                                                        <Button 
                                                            variant="link"
                                                            className="px-0 h-auto text-primary flex items-center gap-1"
                                                            asChild
                                                        >
                                                            <a 
                                                                href={material.link} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-sm"
                                                            >
                                                                <FiExternalLink size={14} /> Open Google Drive Link
                                                            </a>
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Image Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="sm:max-w-[90vw] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FiBookOpen className="h-5 w-5" />
                            Study Material Preview
                        </DialogTitle>
                    </DialogHeader>
                    <div className="relative h-full overflow-auto">
                        <img 
                            src={selectedImage} 
                            alt="Enlarged study material" 
                            className="max-h-[70vh] w-full object-contain mx-auto rounded-md border"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                            }}
                        />
                    </div>
                    <div className="flex justify-center gap-4 pt-4">
                        <Button
                            onClick={() => handleDownload(selectedImage, 'study-material')}
                            className="flex items-center gap-2"
                        >
                            <FiDownload /> Download
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedImage(null)}
                        >
                            Close Preview
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Message Dialog */}
            <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            {messageDialogData.type === 'success' ? (
                                <FiCheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                                <FiAlertCircle className="h-6 w-6 text-red-500" />
                            )}
                            <DialogTitle>{messageDialogData.title}</DialogTitle>
                        </div>
                    </DialogHeader>
                    <DialogDescription className="pt-2">
                        {messageDialogData.message}
                    </DialogDescription>
                    <div className="flex justify-end pt-4">
                        <Button 
                            onClick={() => setMessageDialogOpen(false)}
                            variant={messageDialogData.type === 'success' ? 'default' : 'destructive'}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ViewAllStudyMet;