"use client";

interface OrderSummaryProps {
  fileName: string;
  config: {
    color: string;
    copies: number;
  };
}

const OrderSummary = ({ fileName, config }: OrderSummaryProps) => {
  const basePrice = 2.00; 
  const total = basePrice * config.copies;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Document</span>
          <span>{fileName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Base Price</span>
          <span>₹{basePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Copies</span>
          <span>×{config.copies}</span>
        </div>
      </div>
      
      <div className="border-t pt-2">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;