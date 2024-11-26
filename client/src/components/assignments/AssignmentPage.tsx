import React, { useEffect, useState } from 'react';
import { AssignmentCard } from './AssignmentCard';
import { Assignment } from '../../types';
import { Button } from '../ui/button';
import AssignmentFormModal from './AssignmentFormModal';
import axios from 'axios';

export const AssignmentPage: React.FC = () => {
  const [isModalOpen,setModalOpen] = useState(false)
  const [assignments,setAssignments] = useState<Assignment[]>([
    
  ]
  );

  const loadAssignments = async() =>{
    try {
      const res = await axios.get("http://localhost:8000/api/assignments");
      if (res.status === 200) {
        setAssignments(res.data.assignments)
      }
    } catch (error:any) {
      console.log(error.response.data || "error occured while getting data");
      alert("could not load data due to "+error.message)
    }
  }
  const allocateOrders = async() =>{
    try {
      const res = await axios.post("http://localhost:8000/api/assignments/run")
      if (res.status === 200) {
        alert("allocated pending orders")
      }
    } catch (error:any) {
      console.log("could not allocate orders due to ",error.response.data.message || error.message);
      alert("error occured due to " + error.response.data.message || error.message)
    }
  }

  useEffect(()=>{
    loadAssignments()
  })

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Assignments</h3>
        <Button onClick={() => setModalOpen(true)} variant={"destructive"}>Add Assignment</Button>
        <Button className='ml-2' onClick={allocateOrders}>Allocate Pending Orders</Button>
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