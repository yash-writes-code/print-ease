// src/components/TestimonialsAndStats.tsx
"use client"
import React from 'react';
// Import necessary icons from lucide-react
import { Star, Clock, Users, Smile, UploadCloud } from 'lucide-react';

// --- Interfaces for Data Structures ---
interface TestimonialItem {
  name: string;
  title: string;
  quote: string;
  rating: number; // e.g., 5 for 5 stars
  initial: string; // For the avatar
  avatarBgClass: string; // Tailwind class for avatar background
}

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

// --- Helper Component for Stars ---
interface RatingStarsProps {
  rating: number;
  starClassName?: string;
  containerClassName?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  starClassName = "w-5 h-5 text-yellow-400", // Default star style
  containerClassName = "flex items-center gap-1" // Default container style
}) => {
  return (
    <div className={containerClassName}>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`${starClassName} ${index < rating ? 'fill-current' : 'text-gray-600'}`} // Fill stars based on rating
        />
      ))}
    </div>
  );
};


// --- Sample Data (Based on the image) ---
const testimonialsData: TestimonialItem[] = [
  {
    name: 'Alex Johnson',
    title: 'Engineering Major',
    quote: "I used to waste 30+ minutes standing in line at the print shop. With PrintEase, I upload my files between classes and pick them up when they're ready. Game changer!",
    rating: 5,
    initial: 'A',
    avatarBgClass: 'bg-blue-600',
  },
  {
    name: 'Samantha Chen',
    title: 'Business Student',
    quote: "The notification system is fantastic! I get an alert when my documents are ready, and the OTP system makes pickup secure and hassle-free. I can actually focus on my studies now.",
    rating: 5,
    initial: 'S',
    avatarBgClass: 'bg-purple-600',
  },
  {
    name: 'Michael Rodriguez',
    title: 'Computer Science',
    quote: "The customization options are impressive. I can specify exactly how I want my documents printed without having to explain it to someone at the counter. Saves time and prevents miscommunication.",
    rating: 4, // Example: 4 stars
    initial: 'M',
    avatarBgClass: 'bg-teal-600',
  },
];

const statsData: StatItem[] = [
  {
    icon: <Clock className="w-8 h-8 text-indigo-400" />,
    value: '45+',
    label: 'Minutes Saved',
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-400" />,
    value: '1000+',
    label: 'Active Users',
  },
  {
    icon: <Smile className="w-8 h-8 text-indigo-400" />, // Using Smile for Satisfaction Rate
    value: '99.9%',
    label: 'Satisfaction Rate',
  },
  {
    icon: <UploadCloud className="w-8 h-8 text-indigo-400" />, // Using UploadCloud for Documents Processed
    value: '25K+',
    label: 'Documents Processed',
  },
];


// --- Main Component ---
const TestimonialsAndStats: React.FC = () => {
  return (
    <section className=" py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Testimonials Section */}
        <div className="mb-16 lg:mb-20">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What Students Are Saying
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
              Students across campus are enjoying the benefits of our printing automation system.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonialsData.map((testimonial, index) => (
              <div key={index} className="flex flex-col bg-neutral-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${testimonial.avatarBgClass} flex items-center justify-center`}>
                    <span className="text-lg font-medium text-white">{testimonial.initial}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                <blockquote className="mt-2 text-gray-300 flex-grow">
                  <p>&ldquo;{testimonial.quote}&rdquo;</p>
                </blockquote>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                   <RatingStars rating={testimonial.rating} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-neutral-800 rounded-lg shadow-lg p-6 text-center">
                <div className="flex justify-center mb-3">
                   {stat.icon}
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsAndStats;
