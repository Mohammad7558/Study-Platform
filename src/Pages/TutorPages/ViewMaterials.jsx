import React, { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { Badge } from "../../Components/ui/badge";
import { Loader2, Edit, Trash2, Download, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../Components/ui/dialog";
import { Separator } from "../../Components/ui/separator";

const ViewMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [editMaterialId, setEditMaterialId] = useState(null);
  const [editData, setEditData] = useState({ title: "", image: "", link: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const {
    data: materials = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["materials", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/materials?email=${user.email}`);
      return res.data;
    },
  });

  const handleEditClick = (material) => {
    setEditMaterialId(material._id);
    setEditData({ title: material.title, image: material.image, link: material.link });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const toastId = toast.loading("Updating material...");
    try {
      await axiosSecure.patch(`/materials/${editMaterialId}`, editData);
      toast.success("Material updated successfully", { id: toastId });
      setEditMaterialId(null);
      refetch();
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || "Failed to update material";
      toast.error(msg, { id: toastId });
    }
  };

  const handleCancel = () => {
    setEditMaterialId(null);
  };

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const toastId = toast.loading("Deleting material...");
    try {
      await axiosSecure.delete(`/materials/${materialToDelete._id}`);
      toast.success("Material deleted successfully", { id: toastId });
      refetch();
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || "Failed to delete material";
      toast.error(msg, { id: toastId });
    } finally {
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Study Materials</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your uploaded educational resources
        </p>
      </div>

      {materials.length === 0 && !isLoading ? (
        <Card className="p-8 text-center rounded-xl shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-muted-foreground"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">No materials uploaded yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              You haven't uploaded any study materials yet. Start by adding your first resource.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {materials.map((material) => (
            <Card key={material._id} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {editMaterialId === material._id ? (
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-medium">Edit Material</h3>
                  <Separator />
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={editData.title}
                        onChange={handleChange}
                        placeholder="Material title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        name="image"
                        value={editData.image}
                        onChange={handleChange}
                        placeholder="Image URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link">Google Drive Link</Label>
                      <Input
                        id="link"
                        name="link"
                        value={editData.link}
                        onChange={handleChange}
                        placeholder="Google Drive link"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                    <Button 
                      onClick={handleCancel} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-0">
                  <div className="p-6 pb-0 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4 w-full">
                      {material.image && (
                        <div className="w-24 h-24 rounded-md overflow-hidden border flex-shrink-0">
                          <img
                            src={material.image}
                            alt={material.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold leading-tight">{material.title}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          Uploaded
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start sm:self-auto">
                      <Button
                        onClick={() => handleEditClick(material)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(material)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-4">
                    <div className="flex flex-wrap gap-3">
                      {material.image && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={material.image}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Image
                          </a>
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={material.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Resource
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Material</DialogTitle>
            <DialogDescription className="pt-2">
              This will permanently delete <span className="font-medium">"{materialToDelete?.title}"</span> and all its associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              className="flex-1"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewMaterials;