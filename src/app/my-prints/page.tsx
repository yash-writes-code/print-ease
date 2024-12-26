"use client";

import { useState } from 'react';
import Link from 'next/link';
import OrderSummary from '../../components/OrderSummary';
import PaymentButton from '../../components/PaymentButton';
import FileUploader from '@/components/FileUpload';

export default function MyPrints() {
  const [files, setFiles] = useState<string[]>([]);
  const [config] = useState({
    color: 'bw',
    copies: 1,
    
  });

  const handleAddFile = () => {
    setFiles([...files, 'New Document.pdf']);
  };

  const handlePaymentSuccess = () => {
    // Handle payment success
    setFiles([]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 p-4 text-white">
      <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold">My Prints</h1>
      <button
        onClick={handleAddFile}
        className="bg-white text-black p-4 rounded-full hover:bg-gray-300 transition-colors"
      >
          ➕
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          {/* <p className="text-gray-500">No prints yet. Add your first document!</p> */}
         <FileUploader 
           onFileUpload={(uploadedFiles: File[], selectedColumn: string | undefined, inputValue: string) => {
             const newFiles = uploadedFiles.map(file => file.name);
             setFiles([...files, ...newFiles]);
           }} 
           acceptType=".pdf,.doc,.docx" 
         />
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file, index) => (
            // <Link key={index} href={`/print-config/${file}`}>
            <Link key={index} href={`/print-config/`}>
              <div className="flex justify-between items-center p-4 bg-white rounded shadow">
                <span>{file}</span>
                <span className="text-gray-500">Pending configuration</span>
              </div>
            </Link>
          ))}

          {files.length > 0 && (
            <div className="space-y-4">
              <OrderSummary fileName={files[0]} config={config} />
              <PaymentButton 
                amount={config.color === 'color' ? 2.00 : 1.00} 
                onSuccess={handlePaymentSuccess}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}