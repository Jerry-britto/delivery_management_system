import React, { useState } from 'react';
import { AssignmentCard } from './AssignmentCard';
import { Assignment } from '../../types';
import { Button } from '../ui/button';
import AssignmentFormModal from './AssignmentFormModal';

export const AssignmentPage: React.FC = () => {
  const [isModalOpen,setModalOpen] = useState(false)
  const [assignments] = useState<Assignment[]>([
    {
      "orderId": "ORD12345",
      "partnerId": "PARTNER001",
      "timestamp": new Date("2024-11-22T10:30:00Z"),
      "status": "success"
    },
    {
      "orderId": "ORD12346",
      "partnerId": "PARTNER002",
      "timestamp": new Date("2024-11-22T11:15:00Z"),
      "status": "failed",
      "reason": "Partner unavailable"
    },
    {
      "orderId": "ORD12347",
      "partnerId": "PARTNER003",
      "timestamp": new Date("2024-11-22T11:15:00Z"),
      "status": "success"
    },
    {
      "orderId": "ORD12348",
      "partnerId": "PARTNER004",
      "timestamp": new Date("2024-11-22T11:15:00Z"),
      "status": "failed",
      "reason": "Order canceled by user"
    },
    {
      "orderId": "ORD12349",
      "partnerId": "PARTNER005",
      "timestamp": new Date("2024-11-22T11:15:00Z"),
      "status": "success"
    },
    {
      "orderId": "ORD12350",
      "partnerId": "PARTNER006",
      "timestamp": new Date("2024-11-22T11:15:00Z"),
      "status": "failed",
      "reason": "Technical issue"
    },
    {
      "orderId": "ORD12351",
      "partnerId": "PARTNER007",
      "timestamp": new Date("2024-11-22T11:15:00Z"),
      "status": "success"
    },
    {
      "orderId": "ORD12352",
      "partnerId": "PARTNER008",
      "timestamp": new Date("2024-11-22T11:15:00Z"),
      "status": "failed",
      "reason": "Delivery timeout"
    }
  ]
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Assignments</h3>
        <Button onClick={() => setModalOpen(true)} variant={"destructive"}>Add Assignment</Button>
        <AssignmentFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={`${assignment.orderId}-${assignment.partnerId}`}
              assignment={assignment}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};