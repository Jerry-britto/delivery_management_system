import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { DeliveryPartner } from '@/types';
import axios from 'axios';

type EditPartnerModalProps = {
  partner: DeliveryPartner;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPartner: DeliveryPartner) => void;
};

const EditPartnerModal: React.FC<EditPartnerModalProps> = ({
  partner,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<DeliveryPartner>(partner);
  const [newArea, setNewArea] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: parseFloat(value),
      },
    }));
  };

  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shift: {
        ...prev.shift,
        [name]: value,
      },
    }));
  };

  const handleAddArea = () => {
    if (newArea && !formData.areas.includes(newArea)) {
      setFormData((prev) => ({
        ...prev,
        areas: [...prev.areas, newArea],
      }));
      setNewArea('');
    }
  };

  const handleRemoveArea = (areaToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.filter((area) => area !== areaToRemove),
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("updated data",formData);

    try {
      const keysToRemove = ["shift", "metrics"];

      let filtered = Object.fromEntries(
        Object.entries(formData).filter(
          ([key]) => !keysToRemove.includes(key)
        )
      );
      (filtered.start = formData.shift.start),
        (filtered.end = formData.shift.end),
        (filtered.rating = formData.metrics.rating),
        (filtered.completedOrders = formData.metrics.completedOrders),
        (filtered.cancelledOrders = formData.metrics.cancelledOrders),
        console.log(filtered);

        const res = await axios.put(`https://delivery-management-system-c51i.onrender.com/api/partners/${partner._id}`,filtered)
        if (res.status === 200) {
          console.log("updated data");
          
        }
      
    } catch (error: any) {
      console.log(error.message);
      
      alert("could not add update partner due to "+error.message)
      console.log(
        error.response.data ||
          "could not add order please try again after some time"
      );
    }
    finally{
      onClose(); // Close the modal after submission
      window.location.reload()
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Delivery Partner</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Shift and Load Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentLoad">Current Load</Label>
                <Input
                  id="currentLoad"
                  name="currentLoad"
                  type="number"
                  min="0"
                  max="3"
                  value={formData.currentLoad}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="shift.start">Shift Start</Label>
                <Input
                  id="shift.start"
                  name="start"
                  type="time"
                  value={formData.shift.start}
                  onChange={handleShiftChange}
                />
              </div>

              <div>
                <Label htmlFor="shift.end">Shift End</Label>
                <Input
                  id="shift.end"
                  name="end"
                  type="time"
                  value={formData.shift.end}
                  onChange={handleShiftChange}
                />
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <Label>Service Areas</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add new area"
              />
              <Button type="button" onClick={handleAddArea}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.areas.map((area) => (
                <Badge key={area} variant="secondary" className="flex items-center gap-1">
                  {area}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveArea(area)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <Label>Performance Metrics</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.metrics.rating}
                  onChange={handleMetricsChange}
                />
              </div>
              <div>
                <Label htmlFor="completedOrders">Completed Orders</Label>
                <Input
                  id="completedOrders"
                  name="completedOrders"
                  type="number"
                  min="0"
                  value={formData.metrics.completedOrders}
                  onChange={handleMetricsChange}
                />
              </div>
              <div>
                <Label htmlFor="cancelledOrders">Cancelled Orders</Label>
                <Input
                  id="cancelledOrders"
                  name="cancelledOrders"
                  type="number"
                  min="0"
                  value={formData.metrics.cancelledOrders}
                  onChange={handleMetricsChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPartnerModal;