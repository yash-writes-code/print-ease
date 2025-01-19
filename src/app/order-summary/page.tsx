"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getDocument,
  GlobalWorkerOptions,
  version as pdfjsVersion,
} from "pdfjs-dist";
import { BackgroundGradient } from "../../components/ui/BackgroundGradient";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

// Set the worker URL for pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function OrderSummary() {
  const router = useRouter();
  const searchParams = useSearchParams();

  interface Config {
    color: string;
    pagesToPrint: string;
    specificRange?: string;
    file?: string;
    copies: number;
    pageSize: string;
    orientation: string;
    sided: string;
    remarks: string;
    totalPrice: number;
  }

  const files: string[] = [];
  const configs: Config[] = [];

  for (let i = 0; searchParams.get(`file${i}`); i++) {
    files.push(searchParams.get(`file${i}`) as string);
    const config = searchParams.get(`config${i}`);
    if (config) {
      const parsedConfig = JSON.parse(config) as Config;
      if (!parsedConfig.copies) {
        parsedConfig.copies = 1; // Set default value for copies
      }
      configs.push(parsedConfig);
    }
  }

  const [orderDetails, setOrderDetails] = useState(
    configs.map((config, index) => ({
      ...config,
      file: files[index],
    }))
  );

  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null
  );

  const isValidOrder = (details: Config) => {
    return (
      details.file &&
      details.color &&
      details.pagesToPrint &&
      details.copies &&
      details.pageSize &&
      details.orientation &&
      details.sided &&
      details.totalPrice
    );
  };

  const totalPrice = orderDetails.reduce((sum, details) => {
    return sum + details.totalPrice;
  }, 0);

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        resolve(); // Script already loaded
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      await loadRazorpayScript();
      console.log("Razorpay SDK loaded successfully");

      if (typeof window.Razorpay !== "function") {
        console.error("Razorpay SDK not initialized. Check script loading.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: totalPrice * 100, // Convert to paise
        currency: "INR",
        name: "InstaPrint",
        description: "Order Payment",
        handler: function (response: any) {
          console.log(response);
          Swal.fire("Success", "Payment successful", "success").then(() => {
            const query = new URLSearchParams({
              orderDetails: JSON.stringify(orderDetails),
            }).toString();
            router.push(`/order-history?${query}`);
          });
        },
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "InstaPrint Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error loading Razorpay SDK:", error);
      Swal.fire("Error", "Failed to load payment gateway", "error");
    }
  };

  return (
    <div
      className={`mt-[100px] max-w-2xl mx-auto p-6 rounded-lg bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200`}
    >
      <h1 className="text-2xl font-semibold mb-8">Order Summary</h1>

      <div className="space-y-4">
        {orderDetails.map((details, index) => (
          <BackgroundGradient
            key={index}
            className="w-full p-4 bg-black dark:bg-gray-700 rounded-xl cursor-pointer"
            containerClassName="w-full p-2 space-y-1 rounded-lg"
            borderOnly
          >
            <div
              onClick={() =>
                setSelectedFileIndex(selectedFileIndex === index ? null : index)
              }
            >
              <h2 className="font-semibold mb-2">
                <span className="text-gray-500 dark:text-gray-400">File:</span>{" "}
                {details.file}
              </h2>
              <h2 className="font-semibold mb-2">
                <span className="text-gray-500 dark:text-gray-400">
                  Total Price: <CurrencyRupeeIcon />
                </span>{" "}
                {details.totalPrice}
              </h2>

              {selectedFileIndex === index && isValidOrder(details) && (
                <div className="mt-4 space-y-4">
                  <h2 className="font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">
                      Color Mode:
                    </span>{" "}
                    {details.color === "bw" ? "Black & White" : "Color"}
                  </h2>
                  <h2 className="font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">
                      Page Size:
                    </span>{" "}
                    {details.pageSize}
                  </h2>
                  <h2 className="font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">
                      Orientation:
                    </span>{" "}
                    {details.orientation}
                  </h2>
                  <h2 className="font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">
                      Pages to Print:
                    </span>{" "}
                    {details.pagesToPrint}
                  </h2>
                  <h2 className="font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">
                      Print Type:
                    </span>{" "}
                    {details.sided === "single"
                      ? "Single Sided"
                      : "Double Sided"}
                  </h2>
                  <h2 className="font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">
                      Copies:
                    </span>{" "}
                    {details.copies}
                  </h2>
                  <h2 className="font-semibold">
                    <span className="text-gray-500 dark:text-gray-400">
                      Remarks:
                    </span>{" "}
                    {details.remarks}
                  </h2>
                </div>
              )}

              {selectedFileIndex === index && !isValidOrder(details) && (
                <div className="mt-4 p-4 border border-red-700 rounded-lg">
                  <h2 className="font-semibold text-red-500">
                    Incomplete order details. Please check your configuration.
                  </h2>
                </div>
              )}
            </div>
          </BackgroundGradient>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          <span className="text-gray-500 dark:text-gray-400">
            Total Price for All Files:
          </span>{" "}
          <CurrencyRupeeIcon /> {totalPrice}
        </h2>
        <button
          onClick={handlePayment}
          className="w-full mb-4 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 gap-2"
        >
          Proceed to Payment <ArrowForwardIcon />
        </button>
        <button
          onClick={() => router.push("/my-prints")}
          className="w-full  relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2">
            <ArrowBackIcon /> Go Back to Prints
          </span>
        </button>
      </div>
    </div>
  );
}
