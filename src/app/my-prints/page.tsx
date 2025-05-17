"use client";

import { useEffect, useState, Suspense } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { useSession } from "next-auth/react";
import axios from "axios";
import { format } from "date-fns";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useRouter } from "next/navigation";

interface OrderDetails {
  date: Date;
  status: string;
  cost: number;
  otp: string;
  orderId: string;
}

export default function OrderHistory() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Fetch orders once session is available
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/printdoc?user_id=${session?.user?.id}`
        );

        const transformedOrders: OrderDetails[] = data.map((order: any) => ({
          date: new Date(order.createdAt),
          status: order.status,
          cost: order.cost,
          otp: order.otp || "N/A",
          orderId: order._id || "NO-ID",
        }));

        setOrderDetails(transformedOrders);
      } catch (e: any) {
        console.error("Error fetching orders:", e.message);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  // ✅ Instead of returning early, render a loader as fallback UI
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PacmanLoader color="#fff" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 mt-20">
      <BackgroundGradient className="p-2">
        <div className="bg-gray-900 rounded-lg sm:rounded-[22px] p-3 sm:p-10 relative z-10">
          <h1 className="w-full text-center text-xl sm:text-2xl font-bold mb-4 px-2 text-white">
            My Orders
          </h1>
          <hr className="mb-4" />

          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
              </div>
            }
          >
            {orderDetails.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {orderDetails.map((details, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 border border-gray-700 rounded-lg shadow-lg bg-gray-900/90 backdrop-blur-sm hover:border-gray-500 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <h2 className="font-medium text-base break-all text-white">
                        #{(details.orderId || "NO-ID").slice(-6)}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium w-full sm:w-auto text-center text-white ${
                          details.status === "Completed"
                            ? "bg-green-500"
                            : details.status === "Pending"
                            ? "bg-yellow-500"
                            : details.status === "Ready to Pickup"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {details.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2 bg-gray-800/50 p-2 rounded">
                      <span className="text-gray-200 text-sm">Total Price:</span>
                      <div className="flex items-center text-white">
                        <CurrencyRupeeIcon className="h-4 w-4" />
                        <span className="text-lg font-semibold">
                          {details.cost}
                        </span>
                      </div>
                    </div>

                    <div className="text-gray-300 text-xs">
                      {format(details.date, "MMM dd, yyyy - hh:mm a")}
                    </div>

                    <div className="text-white text-sm mt-2">
                      <span className="font-semibold">OTP:</span> {details.otp}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-200">No orders found</p>
              </div>
            )}
          </Suspense>
        </div>
      </BackgroundGradient>
    </div>
  );
}
