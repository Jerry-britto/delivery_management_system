import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Assignment } from "@/types";

type AssignmentModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AssignmentFormModal: React.FC<AssignmentModalFormProps> = ({ isOpen, onClose }) => {
  const [formValues, setFormValues] = useState<Assignment>({
    orderId: "",
    partnerId: "",
    timestamp: new Date(),
    status: "success",
    reason: "",
  });

  const handleChange = (field: keyof Assignment, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: field === "timestamp" ? new Date(value) : value,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formValues);
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assignment Form</DialogTitle>
        </DialogHeader>

        {/* Form Content */}
        <div className="space-y-4">
          {/* Order ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Order ID</label>
            <Input
              value={formValues.orderId}
              onChange={(e) => handleChange("orderId", e.target.value)}
            />
          </div>

          {/* Partner ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Partner ID</label>
            <Input
              value={formValues.partnerId}
              onChange={(e) => handleChange("partnerId", e.target.value)}
            />
          </div>

          {/* Timestamp */}
          <div>
            <label className="block text-sm font-medium mb-1">Timestamp</label>
            <Input
              type="datetime-local"
              value={formValues.timestamp.toISOString().slice(0, 16)}
              onChange={(e) => handleChange("timestamp", e.target.value)}
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
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Reason (only visible when status is 'failed') */}
          {formValues.status === "failed" && (
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <Textarea
                value={formValues.reason || ""}
                onChange={(e) => handleChange("reason", e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentFormModal;
