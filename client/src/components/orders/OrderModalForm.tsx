import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, Minus } from "lucide-react";
import axios from "axios";

type OrderModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const OrderModalForm: React.FC<OrderModalFormProps> = ({ isOpen, onClose }) => {
  const [formValues, setFormValues] = useState({
    orderNumber: "",
    customer: {
      name: "",
      phone: "",
      address: "",
    },
    area: "",
    items: [
      {
        name: "",
        quantity: 1,
        price: 1,
      },
    ],
    status: "pending",
    scheduledFor: "",
    assignedTo: "",
    totalAmount: 0,
  });
  

  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTotalValue = () =>{
    const totalAmount = formValues.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);  
    setFormValues((prev) => ({
      ...prev,
      totalAmount:totalAmount
    }));
  }

  useEffect(()=>{
    calculateTotalValue();
  },[formValues.items])
  
  const handleCustomerChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value,
      },
    }));
  };

  const addItem = () => {
    setFormValues((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 1 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async() => {
    console.log("Submitted Order:", formValues);
    try {
      const keysToRemove = ["customer"];

      let filtered = Object.fromEntries(
        Object.entries(formValues).filter(
          ([key]) => !keysToRemove.includes(key)
        )
      );
      filtered.customerName = formValues.customer.name,
      filtered.custonerPhone = formValues.customer.phone,
      filtered.customerAddress = formValues.customer.address
   
      console.log(filtered);

      const res = await axios.post("https://delivery-management-system-c51i.onrender.com/api/orders/assign",filtered);
      if (res.status === 200) {
        alert("added order");
        console.log("added order");
      }
    } catch (error: any) {
      console.log(
        error.response.data ||
          "could not add order please try again after some time"
      );
      alert("could not add delivery partner due to "+error.message)
    }
    finally{
      onClose(); // Close the modal after submission
      window.location.reload()
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="max-h-[500px] overflow-y-auto space-y-4">
          {/* Order Number */}
          <div>
            <label className="block font-semibold text-sm mb-1">Order Number</label>
            <Input
              value={formValues.orderNumber}
              onChange={(e) => handleChange("orderNumber", e.target.value)}
            />
          </div>

          {/* Customer Details */}
          <h3 className="font-semibold text-sm">Customer Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-sm mb-1">Name</label>
              <Input
                value={formValues.customer.name}
                onChange={(e) => handleCustomerChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1">Phone</label>
              <Input
                value={formValues.customer.phone}
                onChange={(e) => handleCustomerChange("phone", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-sm mb-1">Address</label>
            <Textarea
              value={formValues.customer.address}
              onChange={(e) => handleCustomerChange("address", e.target.value)}
            />
          </div>

          {/* Area */}
          <div>
            <label className="block font-semibold text-sm mb-1">Area</label>
            <Input
              value={formValues.area}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>

          {/* Items */}
          <h3 className="font-semibold text-sm">Items</h3>
          {formValues.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 items-end">
              <div>
                <label className="block font-semibold text-sm mb-1">Item Name</label>
                <Input
                  value={item.name}
                  onChange={(e) => {
                    const updatedItems = [...formValues.items];
                    updatedItems[index].name = e.target.value;
                    handleChange("items", updatedItems);
                  }}
                />
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Quantity</label>
                <Input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => {
                    const updatedItems = [...formValues.items];
                    updatedItems[index].quantity = parseInt(e.target.value, 10);
                    handleChange("items", updatedItems);
                  }}
                />
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Price</label>
                <Input
                  type="number"
                  value={item.price}
                  min={1}
                  onChange={(e) => {
                    const updatedItems = [...formValues.items];
                    updatedItems[index].price = parseFloat(e.target.value);
                    handleChange("items", updatedItems);
                  }}
                />
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => removeItem(index)}
                >
                  <Minus size={16} />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="flex items-center gap-2" onClick={addItem}>
            <Plus size={16} /> Add Item
          </Button>

          {/* Status */}
          <div>
            <label className="block font-semibold text-sm mb-1">Status</label>
            <Select
              onValueChange={(value) => handleChange("status", value)}
              defaultValue={formValues.status}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="picked">Picked</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Time */}
          <div>
            <label className="block font-semibold text-sm mb-1">Scheduled For</label>
            <Input
            type="time"
              value={formValues.scheduledFor}
              onChange={(e) => handleChange("scheduledFor", e.target.value)}
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block font-semibold text-sm mb-1">Total Amount</label>
            <Input
              type="number"
              value={formValues.totalAmount}
              disabled
            />
          </div>

          {/* Assigned To */}
          <div>
            <label className="block font-semibold text-sm mb-1">Assigned To</label>
            <Input
              value={formValues.assignedTo}
              onChange={(e) => handleChange("assignedTo", e.target.value)}
            />
          </div>
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

export default OrderModalForm;
