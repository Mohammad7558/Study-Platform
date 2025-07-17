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
import { Textarea } from "../../Components/ui/textarea";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

const RejectSessionModal = ({ session, onClose, onSuccess, axiosSecure }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosSecure.patch(`/admin/sessions/${session._id}/reject`, {
        rejectionReason,
        feedback
      });
      toast.success('Session rejected successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Session</DialogTitle>
          <DialogDescription>
            Rejecting: {session.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">Rejection Reason *</Label>
            <Input
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback for Tutor</Label>
            <Textarea
              id="feedback"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="destructive"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Rejecting..." : "Reject Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RejectSessionModal;