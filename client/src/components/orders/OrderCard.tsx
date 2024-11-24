import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Phone, Clock, Package, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Order } from '@/types';
import axios from 'axios';

type OrderCardProps = {
  order: Order;
  onStatusChange?: (orderId: string, newStatus: Order['status']) => void;
};

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status,setStatus] = useState(order.status);

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      picked: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const updatedStatus = async()=>{
    try {
      console.log(order._id);
      
      const res = await axios.put(`http://localhost:8000/api/orders/${order._id}/status`,{status})
      if (res.status === 200) {
        console.log("status updated");
      }
    } catch (error:any) {
      alert(error.message || "could not update status");
      console.log("error:",error.message);
    }
  }


  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {order.orderNumber}
              </h3>
              <Badge variant="outline" className="ml-2">
                {order.area}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Created: {formatDate(order.createdAt)}
            </div>
          </div>

          <Select 
            value={status}
            onValueChange={(value: Order['status']) => {

              setStatus(value)
              updatedStatus()
            }
            }
          >
            <SelectTrigger className={`w-32 ${getStatusColor(status)}`}>
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

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {order.customer.phone}
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mt-1" />
                <span>{order.customer.address}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Scheduled for: {formatDate(order.scheduledFor)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <DollarSign className="h-4 w-4" />
                Total: {formatCurrency(order.totalAmount)}
              </div>
            </div>
          </div>

          <div 
            className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">
              {order.items.length} items
            </span>
            {isExpanded ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </div>

          {isExpanded && (
            <div className="mt-2 pl-6 space-y-2">
              {order.items.map((item, index) => (
                <div 
                  key={`${order._id}-item-${index}`}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500">x{item.quantity}</span>
                  </div>
                  <span className="text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;