import React from 'react';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
};

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, change }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                {change}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);