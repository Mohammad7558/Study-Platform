import React from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";
import { Skeleton } from "../../Components/ui/skeleton";
import { GraduationCap, Calendar, Mail } from 'lucide-react';

const AllTutors = () => {
    const axiosInstance = useAxios();

    const { data, isLoading, error } = useQuery({
        queryKey: ['all-tutor'],
        queryFn: async() => {
            const res = await axiosInstance.get('/all-tutor');
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-10 w-64 mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="h-full">
                        <CardHeader className="items-center space-y-4">
                            <Skeleton className="h-32 w-32 rounded-full" />
                        </CardHeader>
                        <CardContent className="space-y-3 text-center">
                            <Skeleton className="h-6 w-3/4 mx-auto" />
                            <Skeleton className="h-4 w-1/2 mx-auto" />
                            <Skeleton className="h-4 w-2/3 mx-auto" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-9 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto px-4 py-12 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-red-500">Error Loading Tutors</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error.message}</p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12 space-y-4">
                <Badge variant="secondary" className="text-sm font-medium">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Meet Our Educators
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight">Our Expert Tutors</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Highly qualified professionals ready to guide your learning journey
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {data?.map(tutor => (
                    <Card key={tutor._id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                        <CardHeader className="items-center pt-8 pb-4">
                            <Avatar className="h-40 w-40 border-4 mx-auto border-primary/10">
                                <AvatarImage src={tutor.photoUrl} className="object-cover" />
                                <AvatarFallback className="text-2xl font-medium">
                                    {tutor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <CardContent className="text-center space-y-4 flex-grow">
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">{tutor.name}</h3>
                                <Badge variant={tutor.role === 'tutor' ? 'default' : 'secondary'}>
                                    {tutor.role === 'tutor' ? 'Tutor' : 'Student'}
                                </Badge>
                            </div>
                            
                            <div className="flex items-center justify-center text-muted-foreground">
                                <Mail className="mr-2 h-4 w-4" />
                                <span className="text-sm">{tutor.email}</span>
                            </div>
                            
                            <div className="flex items-center justify-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                <Badge variant="outline" className="text-xs">
                                    Joined: {new Date(tutor.created_at).toLocaleDateString()}
                                </Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-center pb-6">
                            <Button asChild className="w-full">
                                <Link to={`/tutor-profile/${tutor._id}`}>
                                    View Profile
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AllTutors;