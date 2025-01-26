"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";


interface OrderDetails {
  date:Date
  status:string;
  cost:number;
}


export default function OrderHistory() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/api/printdoc?user_id=${session.user?.id}`);
        const transformedOrders = data.map((order: any) => ({
          date: new Date(order.createdAt),  // Convert string to Date object
          status: order.status,
          cost: order.cost
        }));
  
        setOrderDetails(transformedOrders);
        
      } catch (e: any) {
        console.error("Error fetching orders:", e.message);
      }
    };

    fetchOrders();
  }, [session]);

  if (!session) {
    return <h1 className="text-white text-3xl">Login to continue</h1>
  }

  return (
    <div className="mt-[100px] max-w-2xl mx-auto p-6 rounded-lg bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200">
      <h1 className="text-2xl font-semibold mb-8">Order History</h1>
      <BackgroundGradient
        className="w-full p-1 bg-black dark:bg-gray-700 rounded-xl cursor-pointer"
        containerClassName="w-full p-2 space-y-1 rounded-lg"
        borderOnly
      >
        {orderDetails.length > 0 ? (
          orderDetails.map((details, index) => (
            <div key={index} className="w-full p-4 bg-black dark:bg-gray-700 rounded-xl">
              <h2 className="font-semibold mb-2">
                <span className="text-gray-500 dark:text-gray-400">Date:</span> {details.date.getDate() + '/' + details.date.getMonth()+1 +"/" +details.date.getFullYear()}
              </h2>
              <h2 className="font-semibold mb-2">
                <span className="text-gray-500 dark:text-gray-400">Total Price:</span> {details.cost}
              </h2>
              <h2 className="font-semibold mb-2">
                <span className="text-gray-500 dark:text-gray-400">Status:</span> {details.status}
              </h2>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </BackgroundGradient>
    </div>
  );
}

