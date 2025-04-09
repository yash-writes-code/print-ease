"use client"

import React from 'react';

// Define the structure for a single FAQ item
interface FaqItem {
  question: string;
  answer: string;
}

// Sample data based on the image
const faqData: FaqItem[] = [
  {
    question: 'How long does processing take?',
    answer:
      "Most print jobs are processed within 30 minutes, depending on complexity and current demand. You'll receive a notification as soon as your document is ready.",
  },
  {
    question: 'What file formats are supported?',
    answer:
      'We support most common document formats including PDF, DOCX, PPT, TXT, and image files (JPG, PNG). If you have a special format, contact support.',
  },
  {
    question: 'How long is my OTP valid?',
    answer:
      "Your OTP remains valid for 48 hours after your print job is complete. After that, you'll need to request a new one through our system.",
  },
  {
    question: 'Can I cancel a print job?',
    answer:
      'Yes, you can cancel your print job at any time before it enters the processing stage. Once processing begins, cancellation may not be possible.',
  },
];

const FaqSection: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Common Questions
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-400">
            Quick answers to frequently asked questions about our printing service.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {faqData.map((item, index) => (
            <div key={index} className="bg-neutral-800 rounded-lg p-6 ">
              <h3 className="text-lg font-semibold leading-6 text-white">
                {item.question}
              </h3>
              <p className="mt-2 text-base text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;