import React from 'react';
import { Assignment } from '../../types';

type AssignmentCardProps = {
  assignment: Assignment;
};

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => (
  <li className="px-4 py-4 sm:px-6 bg-white shadow rounded-md">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      {/* Order and Partner Info */}
      <div className="mb-3 sm:mb-0">
        <div className="text-sm font-medium text-gray-900">
          Order #{assignment.orderId}
        </div>
        <div className="text-sm text-gray-500">
          Partner #{assignment.partnerId}
        </div>
      </div>

      {/* Status and Reason */}
      <div className="flex flex-col items-start sm:items-end">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            assignment.status === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {assignment.status}
        </span>

        {assignment.status === 'failure' && assignment.reason && (
          <div className="text-sm text-red-600 mt-2">
            <strong>Reason:</strong> {assignment.reason}
          </div>
        )}
      </div>
    </div>
  </li>
);

export default AssignmentCard;
