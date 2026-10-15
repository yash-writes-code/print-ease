// src/components/BenefitsSection.tsx
"use client"
import React from 'react';
import Image from 'next/image';
// Import specific icons from lucide-react
import { Clock, ShieldCheck, BellRing, Settings } from 'lucide-react';

// --- Interfaces for Data Structure (Unchanged) ---
interface StatItem {
  value: string;
  label: string;
}

interface BenefitItem {
  icon: React.ReactNode; // Holds the Lucide icon component
  title: string;
  description: string;
}

// --- Sample Data (Updated with Lucide Icons) ---
const statsData: StatItem[] = [
  { value: '85%', label: 'Time Saved' },
  { value: '100%', label: 'Queue Free' },
  { value: '24/7', label: 'Availability' },
];

const benefitsData: BenefitItem[] = [
  {
    // Pass Tailwind classes directly to the Lucide icon
    icon: <Clock className="w-5 h-5 text-indigo-400" />,
    title: 'Save Valuable Time',
    description: 'No more standing in long queues or waiting around for your prints. Upload documents remotely and collect them when ready.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
    title: 'Enhanced Security',
    description: 'OTP verification ensures your documents remain confidential and are only collected by you. Document data is encrypted end-to-end.',
  },
  {
    icon: <BellRing className="w-5 h-5 text-indigo-400" />,
    title: 'Real-time Notifications',
    description: 'Get instant alerts when your documents are ready. No need to continuously check or wonder about the status of your print job.',
  },
  {
    icon: <Settings className="w-5 h-5 text-indigo-400" />,
    title: 'Customization Options',
    description: 'Choose paper type, color options, and binding styles through our intuitive interface. Get exactly what you need, every time.',
  },
];

// --- Component (Structure remains the same, placeholder SVGs removed) ---
const BenefitsSection: React.FC = () => {
  return (
    <section className=" py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Benefits
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
            Our printing automation solution offers numerous advantages to help you save time and improve your productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left Column: Image and Stats */}
          <div className="relative">
             {/* Image Container */}
            <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/working.jpg"
                alt="Team working together with laptops"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg"
                priority
              />
            </div>

             {/* Stats Row */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-neutral-800 rounded-lg p-4 shadow">
                  <p className="text-xl sm:text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-neutral-400">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-neutral-500 text-right">Photo by Brooke Cagle</p>
          </div>

          {/* Right Column: Benefits List */}
          <div className="flex flex-col gap-8">
            {benefitsData.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Icon Background */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    {/* Lucide icon is rendered here */}
                    {benefit.icon}
                </div>
                {/* Text Content */}
                <div>
                  <h3 className="text-lg font-semibold leading-6 text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
