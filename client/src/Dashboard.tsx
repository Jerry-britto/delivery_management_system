import React, { useState } from 'react';
import { Navigation } from './components/layout/Navigation';
import { DashboardContent } from './components/dashboard/DashboardContent';
import { PartnersContent } from './components/partners/PartnersContent';
import { OrdersPage } from './components/orders/OrdersPage';
import { AssignmentPage } from './components/assignments/AssignmentPage';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <DashboardContent />}
        {activeTab === 'partners' && <PartnersContent />}
        {activeTab === 'orders' && <OrdersPage />}
        {activeTab === 'assignments' && <AssignmentPage />}
      </main>
    </div>
  );
};