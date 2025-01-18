"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";
import { BackgroundGradient } from "../../components/ui/BackgroundGradient";
import axios from "axios";
import useFileStore from "@/store/filesStore";
import { Config } from "@/interfaces";
import { useSession } from 'next-auth/react';
// Set the worker URL for pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function OrderSummary() {

  const router = useRouter();
  const store = useFileStore();
  const { data: session } = useSession();

  
  // Get filesWithConfigs from Zustand
  const filesWithConfigs = store.filesWithConfigs;

  
  const isValidOrder = (details: Config) => {
    return (
      details.color &&
      details.pagesToPrint &&
      details.copies &&
      details.pageSize &&
      details.orientation &&
      details.sided &&
      details.totalPrice
    );
  };

  const totalPrice = filesWithConfigs.reduce((sum, item) => {
    return sum + item.config.totalPrice;
  }, 0);

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
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
        handler: async function (response: any) {
      
          // Prepare the data to send to your API
          const formData = new FormData();

          formData.append("paymentId", response.razorpay_payment_id);
          filesWithConfigs.forEach((fileWithConfig, index) => {
            formData.append(`file_${index}`, fileWithConfig.file); // Append the actual file
            formData.append(
              `config_${index}`,
              JSON.stringify(fileWithConfig.config) // Serialize the config
            );
          });
         
          formData.append("user_id",session!.user!.id!);
        

          // Send the data to your API
          const apiResponse = await axios.post("/api/file2", formData);
          console.log("API Response:", apiResponse.data);

          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
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
      alert("Failed to initialize payment. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg">
      <h1 className="text-2xl font-semibold mb-8">Order Summary</h1>

      <div className="space-y-4">
        {filesWithConfigs.map((item, index) => (
          <BackgroundGradient
            key={index}
            className="p-4 bg-gray-900 rounded-lg cursor-pointer"
            containerClassName="p-2 space-y-1 rounded-lg"
            borderOnly
          >
            <div>
              <h2 className="font-semibold mb-2">
                <span className="text-gray-500">File:</span> {item.file.name}
              </h2>
              <h2 className="font-semibold mb-2">
                <span className="text-gray-500">Total Price: Rs.</span> {item.config.totalPrice}
              </h2>
            </div>
          </BackgroundGradient>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          <span className="text-gray-500">Total Price for All Files:</span> Rs. {totalPrice}
        </h2>
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition-colors mb-4"
        >
          Pay with UPI
        </button>
        <button
          onClick={() => router.push("/my-prints")}
          className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Go Back to Prints
        </button>
      </div>
    </div>
  );
}
