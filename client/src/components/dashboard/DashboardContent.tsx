import React from 'react';
import { Package, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { MetricCard } from '../metrics/MetricCard';

export const DashboardContent: React.FC = () => {

  // call from api
  const metrics = {
    totalOrders: 156,
    activePartners: 45,
    successRate: 94.2,
    pendingAssignments: 12
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={<Package className="h-6 w-6 text-indigo-600" />}
          change="+12.5%"
        />
        <MetricCard
          title="Active Partners"
          value={metrics.activePartners}
          icon={<Users className="h-6 w-6 text-green-600" />}
          change="+4.3%"
        />
        <MetricCard
          title="Success Rate"
          value={`${metrics.successRate}%`}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          change="+2.1%"
        />
        <MetricCard
          title="Pending Assignments"
          value={metrics.pendingAssignments}
          icon={<AlertCircle className="h-6 w-6 text-yellow-600" />}
          change="-5.4%"
        />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Assignments</h2>
        {/* Add activity content */}
      </div>
    </div>
  );
};