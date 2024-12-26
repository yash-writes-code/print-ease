"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PrintConfig() {
  const router = useRouter();
  const [config, setConfig] = useState({
    color: 'bw',
    pageSize: 'a4',
    orientation: 'portrait',
    pagesToPrint: 'all',
    sided: 'single',
    copies: 1,
    remarks: '',
  });

  const handleSave = () => {
    router.push('/my-prints');
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Print Configuration</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-200"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-6">
        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Color Mode</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                config.color === 'bw' 
                  ? 'bg-gray-700 text-white' 
                  : 'border border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setConfig({ ...config, color: 'bw' })}
            >
              Black & White
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                config.color === 'color' 
                  ? 'bg-gray-700 text-white' 
                  : 'border border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setConfig({ ...config, color: 'color' })}
            >
              Color
            </button>
          </div>
        </div>

        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Page Size</h2>
          <select 
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
            value={config.pageSize}
            onChange={(e) => setConfig({ ...config, pageSize: e.target.value })}
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </div>

        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Orientation</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                config.orientation === 'portrait' 
                  ? 'bg-gray-700 text-white' 
                  : 'border border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setConfig({ ...config, orientation: 'portrait' })}
            >
              Portrait
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                config.orientation === 'landscape' 
                  ? 'bg-gray-700 text-white' 
                  : 'border border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setConfig({ ...config, orientation: 'landscape' })}
            >
              Landscape
            </button>
          </div>
        </div>

        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Pages to Print</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                config.pagesToPrint === 'all' 
                  ? 'bg-gray-700 text-white' 
                  : 'border border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setConfig({ ...config, pagesToPrint: 'all' })}
            >
              All Pages
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                config.pagesToPrint === 'specific' 
                  ? 'bg-gray-700 text-white' 
                  : 'border border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setConfig({ ...config, pagesToPrint: 'specific' })}
            >
              Specific Range
            </button>
          </div>
        </div>

        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Print Type</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                config.sided === 'single' 
                  ? 'bg-gray-700 text-white' 
                  : 'border border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setConfig({ ...config, sided: 'single' })}
            >
              Single Sided
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                config.sided === 'double' 
                  ? 'bg-gray-700 text-white' 
                  : 'border border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setConfig({ ...config, sided: 'double' })}
            >
              Double Sided
            </button>
          </div>
        </div>

        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Copies</h2>
          <select 
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
            value={config.copies}
            onChange={(e) => setConfig({ ...config, copies: Number(e.target.value) })}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div className="p-4 border border-gray-700 rounded-lg">
          <h2 className="font-semibold mb-4">Remarks</h2>
          <textarea
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white resize-none"
            placeholder="Add any remarks here"
            rows={3}
            value={config.remarks}
            onChange={(e) => setConfig({ ...config, remarks: e.target.value })}
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}