import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FiSearch,
  FiTrash2,
  FiFileText,
  FiFile,
  FiImage,
  FiVideo,
  FiAlertCircle,
  FiRefreshCw
} from "react-icons/fi";
import { toast } from "sonner";
import ViewSingleMaterials from "./ViewSingleMaterials";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
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
} from "../../Components/ui/table";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../Components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../Components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../Components/ui/dialog";

const ViewAllMaterials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const axiosSecure = useAxiosSecure();

  const {
    data: materials = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-materials"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/materials");
      return data;
    },
  });

  const handleDelete = async (materialId) => {
    try {
      await axiosSecure.delete(`/admin/materials/${materialId}`);
      toast.success("Material deleted successfully!");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete material");
    }
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tutorEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FiFileText className="h-4 w-4 text-red-500" />;
      case 'document':
        return <FiFile className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <FiImage className="h-4 w-4 text-green-500" />;
      case 'video':
        return <FiVideo className="h-4 w-4 text-purple-500" />;
      default:
        return <FiFile className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Study Materials Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Review and manage all uploaded study materials
            </CardDescription>
          </div>
          <Button
            variant="outline" 
            size="icon"
            onClick={refetch}
          >
            <FiRefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search materials by title or tutor email..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Materials Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <FiAlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading materials</AlertTitle>
              <AlertDescription>
                {error.message || 'Failed to fetch materials data'}
              </AlertDescription>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={refetch}
              >
                Try Again
              </Button>
            </Alert>
          ) : filteredMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <FiFile className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                No materials found
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search query' : 'No materials uploaded yet'}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Title</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <ViewSingleMaterials
                      key={material._id}
                      material={material}
                      onDelete={() => handleDelete(material._id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog - This would be used in ViewSingleMaterials */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the material.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewAllMaterials;