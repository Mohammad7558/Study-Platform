import React, { useState, useMemo, useCallback } from "react";
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
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import ApproveSessionModal from "./ApproveSessionModal";
import RejectSessionModal from "./RejectSessionModal";
import UpdateSessionModal from "./UpdateSessionModal";
import { format, parseISO, isValid } from "date-fns";
import { debounce } from "lodash";

// Import UI components
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
} from "../../Components/ui/avatar";
import { Button } from "../../Components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

const AllSessions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSession, setSelectedSession] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const axiosSecure = useAxiosSecure();

  const {
    data: sessions = [],
    isLoading,
    error,
    refetch,
    isRefetching,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tutorEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tutorName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || session.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSessions.length / pageSize);
  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSessions.slice(startIndex, startIndex + pageSize);
  }, [filteredSessions, currentPage, pageSize]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  const paginationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Always show first page
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(1)}
        >
          1
        </Button>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        buttons.push(
          <span key="left-ellipsis" className="px-2">
            ...
          </span>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Button>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="right-ellipsis" className="px-2">
            ...
          </span>
        );
      }

      // Always show last page
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
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
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions..."
                    className="pl-9"
                    defaultValue={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refetch}
                  disabled={isRefetching}
                >
                  <FiRefreshCw
                    className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder={DEFAULT_PAGE_SIZE} />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">per page</span>
                </div>
              </div>

              {isLoading ? (
                <motion.div
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {[...Array(pageSize)].map((_, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Skeleton className="h-[72px] w-full rounded-lg" />
                    </motion.div>
                  ))}
                </motion.div>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 space-y-4"
                >
                  <FiUser className="h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground">
                    No sessions found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "No sessions created yet"}
                  </p>
                </motion.div>
              ) : (
                <>
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
                        <AnimatePresence mode="sync">
                          {paginatedSessions.map((session) => (
                            <motion.tr
                              key={session._id}
                              variants={tableRowVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ duration: 0.2 }}
                              layout
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
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
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      variants={paginationVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col sm:flex-row items-center justify-between px-2 pt-4 gap-4"
                    >
                      <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * pageSize + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * pageSize, filteredSessions.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredSessions.length}</span>{" "}
                        sessions
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className="hidden sm:inline-flex"
                        >
                          <FiChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {renderPaginationButtons()}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="hidden sm:inline-flex"
                        >
                          <FiChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
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
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
};

export default AllSessions;