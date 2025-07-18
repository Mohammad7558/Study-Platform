import React, { useEffect } from 'react';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { 
  AlertTriangle, 
  Info, 
  Clock, 
  Calendar, 
  User, 
  BookOpen, 
  RefreshCw,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../Components/ui/card';
import { Button } from '../../Components/ui/button';
import { Badge } from '../../Components/ui/badge';
import { Skeleton } from '../../Components/ui/skeleton';

const ViewRejectedFeedBacks = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    const { 
        data: rejectedSessions = [], 
        isLoading, 
        error,
        refetch,
        isRefetching 
    } = useQuery({
        queryKey: ['tutor-rejected-sessions', user?.email],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/tutor-rejected-sessions?email=${user?.email}`);
                return res.data;
            } catch (err) {
                throw new Error(err.response?.data?.message || 'Failed to fetch rejected sessions');
            }
        },
        enabled: !!user?.email,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (user?.email) {
            refetch();
        }
    }, [user?.email, refetch]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return "Invalid date";
        }
    };

    const handleManualRefresh = async () => {
        await refetch();
    };

    if (isLoading || isRefetching) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading rejected sessions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-6">
                <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">Error Loading Data</h2>
                    <p className="text-muted-foreground max-w-md">{error.message}</p>
                </div>
                <Button onClick={handleManualRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    const sessionsWithFeedback = rejectedSessions.filter(session => 
        session.rejectionReason || session.feedback
    );
    
    const sessionsWithoutFeedback = rejectedSessions.filter(session => 
        !session.rejectionReason && !session.feedback
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Rejected Sessions Feedback</h1>
                    <p className="text-muted-foreground">
                        Review feedback on your rejected session requests
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleManualRefresh}
                    disabled={isRefetching}
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
            
            {/* Sessions with feedback */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h2 className="text-xl font-semibold">Sessions with Feedback</h2>
                    <Badge variant="outline" className="ml-2">
                        {sessionsWithFeedback.length}
                    </Badge>
                </div>
                
                {sessionsWithFeedback.length === 0 ? (
                    <Card className="p-6 text-center bg-muted/50">
                        <p className="text-muted-foreground">No sessions with feedback available</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {sessionsWithFeedback.map((session) => (
                            <Card key={session._id} className="border-destructive/20 overflow-hidden">
                                <div className="p-6 space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                                <h3 className="text-lg font-semibold">{session.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                <span>Subject: {session.subject || 'Not specified'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge variant="destructive">Rejected</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                Updated: {formatDate(session.updatedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {session.rejectionReason && (
                                            <Card className="border-destructive/20 bg-destructive/5 p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                                    <h4 className="font-medium text-destructive">Rejection Reason</h4>
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {session.rejectionReason}
                                                </p>
                                            </Card>
                                        )}

                                        {session.feedback && (
                                            <Card className="border-primary/20 bg-primary/5 p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Info className="h-4 w-4 text-primary" />
                                                    <h4 className="font-medium text-primary">Admin Feedback</h4>
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {session.feedback}
                                                </p>
                                            </Card>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h4 className="font-medium mb-3">Session Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>Dates: {formatDate(session.classStartDate)} - {formatDate(session.classEndDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>Duration: {session.duration} days</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>Submitted: {formatDate(session.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Sessions without feedback */}
            {sessionsWithoutFeedback.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-yellow-500" />
                        <h2 className="text-xl font-semibold">Other Rejected Sessions</h2>
                        <Badge variant="outline" className="ml-2">
                            {sessionsWithoutFeedback.length}
                        </Badge>
                    </div>
                    
                    <Card className="border-yellow-200/50 bg-yellow-50/50 dark:bg-yellow-900/10 p-6">
                        <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                            The following sessions were rejected but don't have specific feedback yet.
                        </p>
                        <div className="space-y-2">
                            {sessionsWithoutFeedback.map(session => (
                                <Card key={session._id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h3 className="font-medium">{session.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Rejected on: {formatDate(session.updatedAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">No feedback</Badge>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ViewRejectedFeedBacks;