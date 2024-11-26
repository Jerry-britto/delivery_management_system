import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { getDeliveryPartner } from "../../utils/dataUtility";
import { addPartners } from "../../store/slice";
import { useDispatch } from "react-redux";
import { DeliveryPartner } from "../../types";

type DeliveryPartnerModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
};



export const DeliveryPartnerFormModal: React.FC<
  DeliveryPartnerModalFormProps
> = ({ isOpen, onClose }) => {
  const [formValues, setFormValues] = useState<DeliveryPartner>({
    name: "",
    email: "",
    phone: "",
    status: "active",
    currentLoad: 0,
    areas: [""],
    shift: {
      start: "",
      end: "",
    },
    metrics: {
      rating: 0,
      completedOrders: 0,
      cancelledOrders: 0,
    },
  });
  const dispathc = useDispatch()

  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddArea = () => {
    setFormValues((prev) => ({
      ...prev,
      areas: [...prev.areas, ""],
    }));
  };

  const handleRemoveArea = (index: number) => {
    const updatedAreas = formValues.areas.filter((_, i) => i !== index);
    setFormValues((prev) => ({
      ...prev,
      areas: updatedAreas,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitted Delivery Partner Data:", formValues);
    try {
      const keysToRemove = ["shift", "metrics"];

      let filtered = Object.fromEntries(
        Object.entries(formValues).filter(
          ([key]) => !keysToRemove.includes(key)
        )
      );
      (filtered.start = formValues.shift.start),
        (filtered.end = formValues.shift.end),
        (filtered.rating = formValues.metrics.rating),
        (filtered.completedOrders = formValues.metrics.completedOrders),
        (filtered.cancelledOrders = formValues.metrics.cancelledOrders),
        console.log(filtered);

      const res = await axios.post("https://delivery-management-system-c51i.onrender.com/api/partners",filtered);
      if (res.status === 200) {
        alert("added delivery partner");
        const updatedData = await getDeliveryPartner()
        dispathc(addPartners(updatedData))
      }
    } catch (error: any) {
      alert("could not add delivery partner due to "+error.message)
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
      <DialogContent className="max-w-lg overflow-auto max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Add Delivery Partner</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={formValues.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              value={formValues.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={formValues.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Current Load */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Load
            </label>
            <Input
              type="number"
              max={3}
              min={1}
              value={formValues.currentLoad}
              onChange={(e) =>
                handleChange("currentLoad", parseInt(e.target.value))
              }
            />
          </div>

          {/* Areas */}
          <div>
            <label className="block text-sm font-medium mb-1">Areas</label>
            {formValues.areas.map((area, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={area}
                  onChange={(e) =>
                    handleChange(
                      "areas",
                      formValues.areas.map((item, i) =>
                        i === index ? e.target.value : item
                      )
                    )
                  }
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveArea(index)}
                  className="ml-2 text-xs"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddArea} className="w-full">
              Add Area
            </Button>
          </div>

          {/* Shift */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Shift Start
            </label>
            <Input
              type="time"
              value={formValues.shift.start}
              onChange={(e) =>
                handleChange("shift", {
                  ...formValues.shift,
                  start: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Shift End</label>
            <Input
              type="time"
              value={formValues.shift.end}
              onChange={(e) =>
                handleChange("shift", {
                  ...formValues.shift,
                  end: e.target.value,
                })
              }
            />
          </div>

          {/* Metrics */}
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <Input
              type="number"
              value={formValues.metrics.rating}
              onChange={(e) =>
                handleChange("metrics", {
                  ...formValues.metrics,
                  rating: parseFloat(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Completed Orders
            </label>
            <Input
              type="number"
              value={formValues.metrics.completedOrders}
              onChange={(e) =>
                handleChange("metrics", {
                  ...formValues.metrics,
                  completedOrders: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Cancelled Orders
            </label>
            <Input
              type="number"
              value={formValues.metrics.cancelledOrders}
              onChange={(e) =>
                handleChange("metrics", {
                  ...formValues.metrics,
                  cancelledOrders: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryPartnerFormModal;
