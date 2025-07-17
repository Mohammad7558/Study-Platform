import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO, isValid } from 'date-fns'
import { toast } from 'sonner'
import { 
  FiRefreshCw, 
  FiAlertTriangle, 
  FiUser, 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiShield,
  FiBook,
  FiUsers
} from 'react-icons/fi'
import useAxiosSecure from '../../Hooks/useAxiosSecure'
import useAuth from '../../Hooks/useAuth'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../Components/ui/card"
import { Input } from "../../Components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../Components/ui/table"
import { Badge } from "../../Components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "../../Components/ui/alert"
import { Button } from '../../components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'

const AllUsers = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const axiosSecure = useAxiosSecure()
  const { user: currentUser } = useAuth()

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = parseISO(dateString)
      return isValid(date) ? format(date, 'PP') : 'Invalid date'
    } catch {
      return 'Invalid date'
    }
  }

  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: async () => {
      const endpoint = searchQuery
        ? `/search-users?query=${encodeURIComponent(searchQuery)}`
        : '/all-users'
      const { data } = await axiosSecure.get(endpoint)
      return data.map((user) => ({
        ...user,
        formattedCreatedAt: formatDate(user.createdAt || user.created_at),
      }))
    },
    staleTime: 5 * 60 * 1000,
  })

  const filteredUsers = users.filter(
    (user) => roleFilter === 'all' || user.role === roleFilter
  )

  const handleRoleUpdate = async (userId, newRole, currentRole) => {
    if (newRole === currentRole) return
    const updatePromise = axiosSecure.patch(`/update-user-role/${userId}`, {
      role: newRole,
      currentUserEmail: currentUser.email,
    })

    toast.promise(updatePromise, {
      loading: 'Updating user role...',
      success: () => {
        refetch()
        return 'User role updated successfully!'
      },
      error: (err) => err.response?.data?.message || 'Failed to update user role',
    })
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        icon: <FiShield className="mr-1.5 h-3.5 w-3.5" />,
        bg: 'bg-rose-50 dark:bg-rose-900/30',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800'
      },
      tutor: {
        icon: <FiBook className="mr-1.5 h-3.5 w-3.5" />,
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800'
      },
      student: {
        icon: <FiUsers className="mr-1.5 h-3.5 w-3.5" />,
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800'
      }
    }

    const config = roleConfig[role] || {
      icon: null,
      bg: 'bg-gray-50 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-700'
    }

    return (
      <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
        {config.icon}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">User Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage all registered users and their roles
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={refetch}
            className="gap-2"
          >
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                placeholder="Search users by name or email..."
                className="pl-9 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative sm:w-[180px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="pl-9 h-10">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <FiShield className="mr-2 h-4 w-4 text-rose-500" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="tutor">
                    <div className="flex items-center">
                      <FiBook className="mr-2 h-4 w-4 text-indigo-500" />
                      Tutor
                    </div>
                  </SelectItem>
                  <SelectItem value="student">
                    <div className="flex items-center">
                      <FiUsers className="mr-2 h-4 w-4 text-emerald-500" />
                      Student
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table / State */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive" className="border-0">
              <div className="flex gap-3">
                <FiAlertTriangle className="h-5 w-5 mt-0.5" />
                <div>
                  <AlertTitle>Error loading users</AlertTitle>
                  <AlertDescription>
                    {error.message || 'Failed to fetch user data'}
                  </AlertDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={refetch}
              >
                Try Again
              </Button>
            </Alert>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <FiUser className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                No users found
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search query' : 'No users registered yet'}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoUrl} alt={user.name} />
                            <AvatarFallback>
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {user.formattedCreatedAt}
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                            >
                              <FiMoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => handleRoleUpdate(user._id, 'admin', user.role)}
                              disabled={user.role === 'admin' || user.email === currentUser.email}
                              className="flex items-center text-rose-600 focus:text-rose-600 dark:text-rose-400"
                            >
                              <FiShield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleUpdate(user._id, 'tutor', user.role)}
                              disabled={user.role === 'tutor' || user.email === currentUser.email}
                              className="flex items-center text-indigo-600 focus:text-indigo-600 dark:text-indigo-400"
                            >
                              <FiBook className="mr-2 h-4 w-4" />
                              Make Tutor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleUpdate(user._id, 'student', user.role)}
                              disabled={user.role === 'student' || user.email === currentUser.email}
                              className="flex items-center text-emerald-600 focus:text-emerald-600 dark:text-emerald-400"
                            >
                              <FiUsers className="mr-2 h-4 w-4" />
                              Make Student
                            </DropdownMenuItem>
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
    </div>
  )
}

export default AllUsers