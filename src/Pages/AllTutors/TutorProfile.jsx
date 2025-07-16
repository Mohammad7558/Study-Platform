import React from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router';
import { format, parseISO } from 'date-fns';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "../../Components/ui/avatar";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";
import { 
  Mail, 
  CalendarDays, 
  Clock, 
  ArrowLeft,
  Frown,
  DollarSign,
  BookOpen
} from 'lucide-react';
import Spinner from '../../Components/Spinner/Spinner';

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
        <div className="flex justify-center items-center h-screen">
            <Spinner size="lg" />
        </div>
    );
    
    if (tutorError) return (
        <div className="container mx-auto px-4 py-8 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-red-500">Error Loading Tutor</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{tutorError.message}</p>
                </CardContent>
            </Card>
        </div>
    );

    if (sessionsError) return (
        <div className="container mx-auto px-4 py-8 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-red-500">Error Loading Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{sessionsError.message}</p>
                </CardContent>
            </Card>
        </div>
    );

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
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Tutor Profile Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-32 w-32 border-4 border-primary/10">
                            <AvatarImage src={tutor?.photoUrl} />
                            <AvatarFallback className="text-2xl font-medium">
                                {tutor?.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left space-y-2">
                            <CardTitle className="text-3xl">{tutor?.name || 'Unknown Tutor'}</CardTitle>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{tutor?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                <span>Member since: {formatDate(tutor?.created_at)}</span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Sessions Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">Available Sessions</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Book a session with {tutor?.name?.split(' ')[0] || 'this tutor'}
                            </p>
                        </div>
                        <Badge variant="outline" className="px-4 py-2">
                            <BookOpen className="mr-2 h-4 w-4" />
                            {sessions?.length || 0} session{sessions?.length !== 1 ? 's' : ''}
                        </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {sessions?.length > 0 ? (
                            sessions.map(session => (
                                <Card key={session._id} className="hover:bg-accent/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-primary">
                                                    {session.title || 'Untitled Session'}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {session.description || 'No description provided'}
                                                </p>
                                            </div>
                                            <Badge 
                                                variant={session.price === 0 || session.price === null ? 'secondary' : 'default'}
                                                className="self-start"
                                            >
                                                <DollarSign className="mr-1 h-3 w-3" />
                                                {session.price === 0 || session.price === null ? 'FREE' : `$${session.price}`}
                                            </Badge>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <Badge variant="outline" className="gap-1">
                                                <CalendarDays className="h-3 w-3" />
                                                {formatSessionDateTime(session.created_at)}
                                            </Badge>
                                            <Badge variant="outline" className="gap-1">
                                                <Clock className="h-3 w-3" />
                                                {session.duration || '?'} mins
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                <Frown className="h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground">No sessions available at the moment</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Back Button */}
                <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link to="/all-tutors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Tutors
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default TutorProfile;