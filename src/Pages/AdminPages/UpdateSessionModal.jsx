import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../Components/ui/dialog';
import { Input } from '../../Components/ui/input';
import { Label } from '../../Components/ui/label';
import { Textarea } from '../../Components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../Components/ui/radio-group';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/button';

const UpdateSessionModal = ({ session, onClose, onSuccess, axiosSecure }) => {
  const [formData, setFormData] = useState({
    title: session.title,
    description: session.description,
    sessionType: session.sessionType || 'free',
    price: session.price || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosSecure.patch(`/admin/sessions/${session._id}/update`, {
        title: formData.title,
        description: formData.description,
        sessionType: formData.sessionType,
        price: formData.sessionType === 'paid' ? formData.price : 0
      });
      toast.success('Session updated successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Session</DialogTitle>
          <DialogDescription>
            Make changes to your session here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-left">Session Type</Label>
            <RadioGroup
              value={formData.sessionType}
              onValueChange={(value) => setFormData({...formData, sessionType: value})}
              className="col-span-3 flex space-x-4"
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

          {formData.sessionType === 'paid' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="1"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="col-span-3"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : 'Update Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSessionModal;