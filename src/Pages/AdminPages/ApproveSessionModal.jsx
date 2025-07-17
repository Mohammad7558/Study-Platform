import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "../../Components/ui/dialog";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../Components/ui/radio-group";
import { Textarea } from "../../Components/ui/textarea";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

const ApproveSessionModal = ({ session, onClose, onSuccess, axiosSecure }) => {
  const [sessionType, setSessionType] = useState("free");
  const [price, setPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosSecure.patch(`/admin/sessions/${session._id}/approve`, {
        sessionType,
        price: sessionType === "paid" ? price : 0,
      });
      toast.success("Session approved successfully!");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Session</DialogTitle>
          <DialogDescription>
            Approving: {session.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionType">Session Type</Label>
            <RadioGroup
              id="sessionType"
              value={sessionType}
              onValueChange={setSessionType}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">Paid</Label>
              </div>
            </RadioGroup>
          </div>

          {sessionType === "paid" && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="1"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Math.max(1, parseFloat(e.target.value) || 1))}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Approving..." : "Approve Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveSessionModal;