
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import { Suspense } from "react";

interface OrderDetails {
  date:Date
  status:string;
  cost:number;
  orderId:string;
}


export default function OrderHistory() {
  const { data: session } = useSession();
 
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get((process.env.NEXT_PUBLIC_BASE_URL+`/api/printdoc?user_id=${session.user?.id}`));
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
    <div className="min-h-screen p-4">
      <BackgroundGradient className="rounded-[22px] p-4 sm:p-10">
        <Suspense fallback={<div>Loading...</div>}>
          {orderDetails ? (
            orderDetails.map((details, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <h2 className="font-semibold mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Order ID:</span> {details.orderId}
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
        </Suspense>
      </BackgroundGradient>
    </div>
  );
}

