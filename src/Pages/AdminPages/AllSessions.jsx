import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiRefreshCw,
  FiSearch,
  FiDollarSign,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiAlertTriangle,
  FiCheck,
} from "react-icons/fi";
import { toast } from "sonner";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import ApproveSessionModal from "./ApproveSessionModal";
import RejectSessionModal from "./RejectSessionModal";
import UpdateSessionModal from "./UpdateSessionModal";
import { format, parseISO, isValid } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../Components/ui/card";
import { Input } from "../../Components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../Components/ui/table";
import { Badge } from "../../Components/ui/badge";
import { Skeleton } from "../../Components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../Components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "../../Components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../Components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";

const AllSessions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {
    data: sessions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/sessions");
      return data.map((session) => ({
        ...session,
        formattedStartTime: formatDate(session.startTime),
        formattedCreatedAt: formatDate(session.created_at),
      }));
    },
  });

  const handleApprove = (session) => {
    setSelectedSession(session);
    setShowApproveModal(true);
  };

  const handleReject = (session) => {
    setSelectedSession(session);
    setShowRejectModal(true);
  };

  const handleUpdate = (session) => {
    setSelectedSession(session);
    setShowUpdateModal(true);
  };

  const handleDelete = async (sessionId) => {
    try {
      await axiosSecure.delete(`/admin/sessions/${sessionId}`);
      toast.success("Session deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete session");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return isValid(date)
        ? format(date, "MMM d, yyyy h:mm a")
        : "Invalid date";
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Invalid date";
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tutorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tutorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusVariants = {
      approved:
        "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 dark:bg-emerald-900/30 dark:text-emerald-300",
      pending:
        "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300",
      rejected:
        "bg-rose-100 text-rose-800 hover:bg-rose-100/80 dark:bg-rose-900/30 dark:text-rose-300",
    };

    const statusIcons = {
      approved: <FiCheckCircle className="h-3 w-3 mr-1" />,
      pending: <FiClock className="h-3 w-3 mr-1" />,
      rejected: <FiXCircle className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge
        className={`${
          statusVariants[status] || "bg-gray-100 dark:bg-gray-800"
        } capitalize`}
        variant="secondary"
      >
        {statusIcons[status]}
        {status}
      </Badge>
    );
  };

  const getPriceBadge = (price) => {
    return price > 0 ? (
      <Badge variant="outline" className="gap-1">
        <FiDollarSign className="h-3 w-3" />${price}
      </Badge>
    ) : (
      <Badge variant="secondary">Free</Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">
              Session Management
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage all tutor-created sessions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={refetch}>
              <FiRefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <FiAlertTriangle className="h-4 w-4" />
              <AlertTitle>Error loading sessions</AlertTitle>
              <AlertDescription>
                {error.message || "Failed to fetch session data"}
              </AlertDescription>
              <Button variant="outline" className="mt-4" onClick={refetch}>
                Try Again
              </Button>
            </Alert>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <FiUser className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                No sessions found
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try a different search query"
                  : "No sessions created yet"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Session</TableHead>
                    <TableHead className="w-[200px]">Tutor</TableHead>
                    <TableHead className="w-[100px] text-center">Price</TableHead>
                    <TableHead className="w-[150px]">Created</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session._id}>
                      <TableCell className="font-medium max-w-[250px]">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={session.tutorPhotoUrl} />
                            <AvatarFallback>
                              {session.tutorName?.charAt(0) || "T"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="font-medium truncate">
                                  {session.title || "Untitled Session"}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                {session.title || "Untitled Session"}
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm text-muted-foreground truncate">
                                  {session.description || "No description"}
                                </p>
                              </TooltipTrigger>
                              {session.description && (
                                <TooltipContent>
                                  {session.description}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="min-w-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="font-medium truncate">
                                {session.tutorName}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              {session.tutorName}
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm text-muted-foreground truncate">
                                {session.tutorEmail}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              {session.tutorEmail}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getPriceBadge(session.price)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {session.formattedCreatedAt}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <FiEdit2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {session.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  className="text-emerald-600 focus:text-emerald-600"
                                  onClick={() => handleApprove(session)}
                                >
                                  <FiCheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-rose-600 focus:text-rose-600"
                                  onClick={() => handleReject(session)}
                                >
                                  <FiXCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleUpdate(session)}
                            >
                              <FiEdit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-rose-600 focus:text-rose-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <FiTrash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DialogTrigger>

                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Are you sure?</DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the session.
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>

                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(session._id)}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showApproveModal && (
        <ApproveSessionModal
          session={selectedSession}
          onClose={() => setShowApproveModal(false)}
          onSuccess={() => {
            refetch();
            setShowApproveModal(false);
            toast.success("Session approved successfully!");
          }}
          axiosSecure={axiosSecure}
        />
      )}

      {showRejectModal && (
        <RejectSessionModal
          session={selectedSession}
          onClose={() => setShowRejectModal(false)}
          onSuccess={() => {
            refetch();
            setShowRejectModal(false);
            toast.success("Session rejected successfully!");
          }}
          axiosSecure={axiosSecure}
        />
      )}

      {showUpdateModal && (
        <UpdateSessionModal
          session={selectedSession}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={() => {
            refetch();
            setShowUpdateModal(false);
            toast.success("Session updated successfully!");
          }}
          axiosSecure={axiosSecure}
        />
      )}
    </div>
  );
};

export default AllSessions;