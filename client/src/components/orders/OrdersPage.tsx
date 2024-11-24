import React, { useEffect, useState } from "react";
import { OrderCard } from "./OrderCard";
import { Order } from "../../types";
import { Button } from "../ui/button";
import OrderModalForm from "./OrderModalForm";
import { getOrders } from "../../utils/dataUtility";
import { useDispatch } from "react-redux";
import { addOrders } from "../../store/slice";
import { LoadingSpinner } from "../Loader/LoadSpinner";

export const OrdersPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>("");
  const [orders,setOrders] = useState<Order[]>([
    {
      _id: "ord_001",
      orderNumber: "ORD-2024-001",
      customer: {
        name: "John Smith",
        phone: "+1-555-0123",
        address: "123 Oak Street, Downtown",
      },
      area: "Downtown",
      items: [
        {
          name: "Large Pizza",
          quantity: 2,
          price: 15.99,
        },
        {
          name: "Garlic Bread",
          quantity: 1,
          price: 4.99,
        },
      ],
      status: "pending",
      scheduledFor: "2024-11-24T18:30:00Z",
      totalAmount: 36.97,
      createdAt: new Date("2024-11-24T18:15:00Z"),
      updatedAt: new Date("2024-11-24T18:15:00Z"),
    },
    {
      _id: "ord_002",
      orderNumber: "ORD-2024-002",
      customer: {
        name: "Emily Johnson",
        phone: "+1-555-0124",
        address: "456 Maple Avenue, Uptown",
      },
      area: "Uptown",
      items: [
        {
          name: "Sushi Combo",
          quantity: 1,
          price: 29.99,
        },
        {
          name: "Miso Soup",
          quantity: 2,
          price: 3.5,
        },
      ],
      status: "assigned",
      assignedTo: "dp_001",
      scheduledFor: "2024-11-24T19:00:00Z",
      totalAmount: 36.99,
      createdAt: new Date("2024-11-24T18:45:00Z"),
      updatedAt: new Date("2024-11-24T18:50:00Z"),
    },
    {
      _id: "ord_003",
      orderNumber: "ORD-2024-003",
      customer: {
        name: "Michael Chen",
        phone: "+1-555-0125",
        address: "789 Pine Road, Midtown",
      },
      area: "Midtown",
      items: [
        {
          name: "Burger Combo",
          quantity: 2,
          price: 12.99,
        },
        {
          name: "French Fries",
          quantity: 2,
          price: 3.99,
        },
        {
          name: "Milkshake",
          quantity: 2,
          price: 4.99,
        },
      ],
      status: "picked",
      assignedTo: "dp_002",
      scheduledFor: "2024-11-24T19:15:00Z",
      totalAmount: 43.94,
      createdAt: new Date("2024-11-24T19:00:00Z"),
      updatedAt: new Date("2024-11-24T19:10:00Z"),
    },
    {
      _id: "ord_004",
      orderNumber: "ORD-2024-004",
      customer: {
        name: "Sarah Williams",
        phone: "+1-555-0126",
        address: "321 Elm Court, Riverside",
      },
      area: "Riverside",
      items: [
        {
          name: "Family Size Pasta",
          quantity: 1,
          price: 24.99,
        },
        {
          name: "Caesar Salad",
          quantity: 1,
          price: 8.99,
        },
        {
          name: "Tiramisu",
          quantity: 2,
          price: 6.99,
        },
      ],
      status: "delivered",
      assignedTo: "dp_003",
      scheduledFor: "2024-11-24T19:30:00Z",
      totalAmount: 47.96,
      createdAt: new Date("2024-11-24T19:15:00Z"),
      updatedAt: new Date("2024-11-24T19:45:00Z"),
    },
    {
      _id: "ord_005",
      orderNumber: "ORD-2024-005",
      customer: {
        name: "David Brown",
        phone: "+1-555-0127",
        address: "567 Birch Lane, Westside",
      },
      area: "Westside",
      items: [
        {
          name: "Vegetarian Pizza",
          quantity: 1,
          price: 16.99,
        },
        {
          name: "Buffalo Wings",
          quantity: 2,
          price: 9.99,
        },
        {
          name: "Soft Drinks",
          quantity: 3,
          price: 2.49,
        },
      ],
      status: "pending",
      scheduledFor: "2024-11-24T20:00:00Z",
      totalAmount: 44.43,
      createdAt: new Date("2024-11-24T19:45:00Z"),
      updatedAt: new Date("2024-11-24T19:45:00Z"),
    },
    {
      _id: "ord_006",
      orderNumber: "ORD-2024-006",
      customer: {
        name: "Lisa Anderson",
        phone: "+1-555-0128",
        address: "890 Cedar Street, Eastside",
      },
      area: "Eastside",
      items: [
        {
          name: "Chinese Combo",
          quantity: 2,
          price: 18.99,
        },
        {
          name: "Spring Rolls",
          quantity: 3,
          price: 4.99,
        },
        {
          name: "Fortune Cookies",
          quantity: 4,
          price: 0.99,
        },
      ],
      status: "assigned",
      assignedTo: "dp_004",
      scheduledFor: "2024-11-24T20:15:00Z",
      totalAmount: 53.91,
      createdAt: new Date("2024-11-24T20:00:00Z"),
      updatedAt: new Date("2024-11-24T20:05:00Z"),
    },
    {
      _id: "ord_007",
      orderNumber: "ORD-2024-007",
      customer: {
        name: "Robert Taylor",
        phone: "+1-555-0129",
        address: "234 Willow Way, Northwest",
      },
      area: "Northwest",
      items: [
        {
          name: "Steakhouse Special",
          quantity: 1,
          price: 34.99,
        },
        {
          name: "Baked Potato",
          quantity: 2,
          price: 4.99,
        },
        {
          name: "House Wine",
          quantity: 1,
          price: 19.99,
        },
      ],
      status: "pending",
      scheduledFor: "2024-11-24T20:30:00Z",
      totalAmount: 64.96,
      createdAt: new Date("2024-11-24T20:15:00Z"),
      updatedAt: new Date("2024-11-24T20:15:00Z"),
    },
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch()

  const loadData = async()=>{
    try {
      const data = await getOrders();
      setOrders(data);
      setError(null); 
      dispatch(addOrders(data));
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Orders</h3>
        <Button onClick={() => setModalOpen(true)} variant={"destructive"}>
          Add Order
        </Button>
        <OrderModalForm
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </ul>
      </div>
    </div>
  );
};
