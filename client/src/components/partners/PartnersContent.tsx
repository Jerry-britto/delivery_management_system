import React, { useEffect, useState } from 'react';
import { PartnerCard } from './PartnerCard';
import { DeliveryPartner } from '../../types';

import { Button } from '../ui/button';
import DeliveryPartnerFormModal from './DeliveryPartnerFormModal';
import { useDispatch } from 'react-redux';
import { getDeliveryPartner } from '../../utils/dataUtility.ts';
import { addPartners } from '../../store/slice.ts';
import { LoadingSpinner } from '../Loader/LoadSpinner.tsx';

export const PartnersContent: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch()

  const [partners,setPartners] = useState<DeliveryPartner[]>([
    // ... partner data
    {
      _id: 'p1',
      name: 'John Doe',
      email: 'john.doe@delivery.com',
      phone: '+1-555-0123',
      status: 'active',
      currentLoad: 2,
      areas: ['Downtown', 'North End'],
      shift: {
        start: '09:00',
        end: '17:00'
      },
      metrics: {
        rating: 4.8,
        completedOrders: 156,
        cancelledOrders: 3
      }
    },
    {
      _id: 'p2',
      name: 'Jane Smith',
      email: 'jane.smith@delivery.com',
      phone: '+1-555-0124',
      status: 'active',
      currentLoad: 1,
      areas: ['South Side', 'West End'],
      shift: {
        start: '10:00',
        end: '18:00'
      },
      metrics: {
        rating: 4.9,
        completedOrders: 234,
        cancelledOrders: 2
      }
    },
    {
      _id: 'p3',
      name: 'Mike Johnson',
      email: 'mike.j@delivery.com',
      phone: '+1-555-0125',
      status: 'inactive',
      currentLoad: 0,
      areas: ['East Side', 'Downtown'],
      shift: {
        start: '12:00',
        end: '20:00'
      },
      metrics: {
        rating: 4.6,
        completedOrders: 98,
        cancelledOrders: 5
      }
    }
  ]);

  const loadData = async()=>{
    try {
      const data = await getDeliveryPartner();
      setPartners(data);
      setError(null); 
      dispatch(addPartners(data));
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  useEffect(()=>{
    loadData()
  },[])

  if (loading) return <LoadingSpinner/>
  if (error) return <p className='text-2xl text-center'>Error: {error}</p>;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Delivery Partners</h3>
        <Button onClick={() => setModalOpen(true)} variant={"destructive"}>Add Partner</Button>
        <DeliveryPartnerFormModal isOpen={isModalOpen} onClose={()=> setModalOpen(false)}/>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {partners.map((partner) => (
            <PartnerCard key={partner._id} partner={partner} />
          ))}
        </ul>
      </div>
    </div>
  );
};