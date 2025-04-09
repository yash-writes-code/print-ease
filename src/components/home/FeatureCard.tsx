import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  points: string[];
}

export default function FeatureCard({ icon, title, description, points }: FeatureCardProps) {
  return (
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-[#6C63FF] transition-colors duration-300 group">
      <div className="w-14 h-14 bg-[#6C63FF]/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#6C63FF]/30 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-neutral-400 mb-4">{description}</p>
      <ul className="space-y-2">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-center text-sm text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00E0FF]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 
                9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
