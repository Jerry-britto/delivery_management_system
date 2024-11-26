import React, { useState } from 'react';
import { Truck, Edit, Trash2, Star, Package, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import EditPartnerModal from './EditPartnerModal';
import { DeliveryPartner } from '@/types';
import axios from 'axios';

type PartnerCardProps = {
  partner: DeliveryPartner;
  onUpdate?: (updatedPartner: DeliveryPartner) => void;
  onDelete?: (id: string) => void;
};

export const PartnerCard: React.FC<PartnerCardProps> = ({ 
  partner,
  onUpdate,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdate = (updatedPartner: DeliveryPartner) => {
    onUpdate?.(updatedPartner);
    setIsEditModalOpen(false);
  };

  const deletePartner = async(id:any)=>{
    try {
      const res = await axios.delete(`https://delivery-management-system-c51i.onrender.com/api/partners/${id}`)
      if (res.status === 200) {
        console.log("deleted partner");
      }
      window.location.reload();
    } catch (error:any) {
      console.log(error.message);
      
      alert("could not add update partner due to "+error.message)
      console.log(
        error.response.data ||
          "could not add order please try again after some time"
      );      
    }
  }

  return (
    <>
      <Card className="w-full mb-4">
        {/* Existing card content remains the same until the action buttons */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-gray-400 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
              <p className="text-sm text-gray-500">{partner.email}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              partner.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {partner.status}
          </span>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Contact Details</h4>
                <p className="text-sm text-gray-900">Phone: {partner.phone}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Current Load</h4>
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{partner.currentLoad}/3 orders</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Service Areas</h4>
                <div className="flex items-center flex-wrap gap-2 mt-1">
                  {partner.areas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Shift Timing</h4>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    {partner.shift.start} - {partner.shift.end}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-sm text-gray-900">Rating: {partner.metrics.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-sm text-gray-900">
                    Completed Orders: {partner.metrics.completedOrders}
                  </div>
                  <div className="text-sm text-gray-900">
                    Cancelled Orders: {partner.metrics.cancelledOrders}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center"
              onClick={() => deletePartner(partner._id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Partner
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditPartnerModal
        partner={partner}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
      />
    </>
  );
};

export default PartnerCard;