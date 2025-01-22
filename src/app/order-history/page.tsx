"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";

interface OrderDetails {
  file: string;
  color: string;
  pagesToPrint: string;
  specificRange?: string;
  copies: number;
  orientation: string;
  sided: string;
  remarks: string;
  totalPrice: number;
  status: string;
}

export default function OrderHistory() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);

  useEffect(() => {
    const orderDetailsParam = searchParams.get("orderDetails");
    if (orderDetailsParam) {
      const parsedOrderDetails = JSON.parse(orderDetailsParam).map(
        (details: OrderDetails) => ({
          ...details,
          status: "Pending",
        })
      );
      console.log(parsedOrderDetails)
      setOrderDetails(parsedOrderDetails);
    }
  }, [searchParams]);

  return (
    <div
      className={`mt-[100px] max-w-2xl mx-auto p-6 rounded-lg bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200`}
    >
      <h1 className="text-2xl font-semibold mb-8">Order History</h1>

      <BackgroundGradient
        className="w-full p-1 bg-black dark:bg-gray-700 rounded-xl cursor-pointer"
        containerClassName="w-full p-2 space-y-1 rounded-lg"
        borderOnly
      >
        
        {orderDetails && orderDetails.map((details, index) => (
          <div
            key={index}
            className="w-full p-4 bg-black dark:bg-gray-700 rounded-xl"
          >
            <h2 className="font-semibold mb-2">
              <span className="text-gray-500 dark:text-gray-400">File:</span>{" "}
              File Name Placeholder
            </h2>
            <h2 className="font-semibold mb-2">
              <span className="text-gray-500 dark:text-gray-400">
                Total Price: 
              </span>{" "}
              {details.totalPrice}
            </h2>
            <h2 className="font-semibold mb-2">
              <span className="text-gray-500 dark:text-gray-400">Status:</span>{" "}
              {details.status}
            </h2>
          </div>
        ))}
      </BackgroundGradient>
    </div>
  );
}
