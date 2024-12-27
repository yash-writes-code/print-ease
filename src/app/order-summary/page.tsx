"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderSummary() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const color = searchParams.get('color');
  const pageSize = searchParams.get('pageSize');
  const orientation = searchParams.get('orientation');
  const pagesToPrint = searchParams.get('pagesToPrint');
  const sided = searchParams.get('sided');
  const copies = searchParams.get('copies');
  const remarks = searchParams.get('remarks');
  const totalPrice = searchParams.get('totalPrice');
  const specificRange = searchParams.get('specificRange');

  const [orderDetails, setOrderDetails] = useState({
    color: color || 'bw',
    pageSize: pageSize || 'a4',
    orientation: orientation || 'portrait',
    pagesToPrint: pagesToPrint || 'all',
    sided: sided || 'single',
    copies: Number(copies) || 1,
    remarks: remarks || '',
    totalPrice: totalPrice || '0',
    specificRange: specificRange || '',
  });

  useEffect(() => {
    const calculateTotalPrice = () => {
      const pricePerPage = orderDetails.color === 'bw' ? 2 : 5; // Rs.2 for B/W, Rs.5 for Color

      let totalPages = 10; // Default to 10 pages for 'all'

      // Check if the user wants to print specific pages
      if (orderDetails.pagesToPrint === 'specific' && orderDetails.specificRange) {
        // Split the specific range by comma and parse each range
        const ranges = orderDetails.specificRange
          .split(',')
          .map((range) => {
            // Check if range has a dash, meaning it's a range like 1-5
            if (range.includes('-')) {
              return range.split('-').map(Number);
            }
            // If no dash, it's a single page
            return [Number(range), Number(range)];
          });

        // Debugging: Log the parsed ranges
        console.log('Parsed specific ranges:', ranges);

        totalPages = ranges.reduce((total, [start, end]) => {
          // Count pages in the range
          const pageCount = end - start + 1;
          return total + pageCount;
        }, 0);
      } else if (orderDetails.pagesToPrint === 'all') {
        // For 'all' pages, you can set a specific default number, or let it be dynamic
        totalPages = 10;  // Update this if you have a dynamic count for 'all' pages
      }

      // Debugging: Log the total pages before price calculation
      console.log('Total pages to print:', totalPages);

      return totalPages * pricePerPage * orderDetails.copies;
    };

    // Calculate total price and update state
    const calculatedPrice = calculateTotalPrice();
    console.log('Calculated Total Price:', calculatedPrice); // Debugging the final calculated price

    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      totalPrice: calculatedPrice.toString(),
    }));
  }, [orderDetails.color, orderDetails.pagesToPrint, orderDetails.copies, orderDetails.specificRange]);

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-semibold mb-8">Order Summary</h1>

      <div className="space-y-6">
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Color Mode: {orderDetails.color === 'bw' ? 'Black & White' : 'Color'}</h2>
          <h2 className="font-semibold mb-4">Page Size: {orderDetails.pageSize}</h2>
          <h2 className="font-semibold mb-4">Orientation: {orderDetails.orientation}</h2>
          <h2 className="font-semibold mb-4">Pages to Print: {orderDetails.pagesToPrint}</h2>
          <h2 className="font-semibold mb-4">Print Type: {orderDetails.sided === 'single' ? 'Single Sided' : 'Double Sided'}</h2>
          <h2 className="font-semibold mb-4">Copies: {orderDetails.copies}</h2>
          <h2 className="font-semibold mb-4">Remarks: {orderDetails.remarks}</h2>
        </div>

        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Total Price: Rs. {orderDetails.totalPrice}</h2>
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push('/my-prints')}
            className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go Back to Prints
          </button>
        </div>
      </div>
    </div>
  );
}
