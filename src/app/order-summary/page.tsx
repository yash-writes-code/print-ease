"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";
import { BackgroundGradient } from '../../components/ui/BackgroundGradient';

// Set the worker URL for pdfjs-dist
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

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

  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

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

  const totalPrice = orderDetails.reduce((sum, details) => sum + details.totalPrice, 0);

  return (
    <div className={`max-w-2xl mx-auto p-6 rounded-lg`}>
      <h1 className="text-2xl font-semibold mb-8">Order Summary</h1>

      <div className="space-y-4">
        {orderDetails.map((details, index) => (
          <BackgroundGradient key={index} className="p-4 bg-gray-900 rounded-lg cursor-pointer" containerClassName="p-2 space-y-1 rounded-lg" borderOnly>
            <div onClick={() => setSelectedFileIndex(selectedFileIndex === index ? null : index)}>
              <h2 className="font-semibold mb-2">File: {details.file}</h2>
              <h2 className="font-semibold mb-2">Total Price: Rs. {details.totalPrice}</h2>

              {selectedFileIndex === index && isValidOrder(details) && (
                <div className="mt-4 space-y-4">
                  <h2 className="font-semibold">Color Mode: {details.color === "bw" ? "Black & White" : "Color"}</h2>
                  <h2 className="font-semibold">Page Size: {details.pageSize}</h2>
                  <h2 className="font-semibold">Orientation: {details.orientation}</h2>
                  <h2 className="font-semibold">Pages to Print: {details.pagesToPrint}</h2>
                  <h2 className="font-semibold">Print Type: {details.sided === "single" ? "Single Sided" : "Double Sided"}</h2>
                  <h2 className="font-semibold">Copies: {details.copies}</h2>
                  <h2 className="font-semibold">Remarks: {details.remarks}</h2>
                </div>
              )}

              {selectedFileIndex === index && !isValidOrder(details) && (
                <div className="mt-4 p-4 border border-red-700 rounded-lg">
                  <h2 className="font-semibold text-red-500">Incomplete order details. Please check your configuration.</h2>
                </div>
              )}
            </div>
          </BackgroundGradient>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Total Price for All Files: Rs. {totalPrice}</h2>
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

function getTotalPagesFromFile(fileURL: string): Promise<number> {
  return new Promise((resolve, reject) => {
    getDocument({ url: fileURL })
      .promise.then((pdf) => {
        resolve(pdf.numPages);
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        reject(new Error("MissingPDFException"));
      });
  });
}

function includes(str: string, substr: string): boolean {
  return str.indexOf(substr) !== -1;
}


