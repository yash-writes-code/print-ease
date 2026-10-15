// components/HowItWorksSteps.tsx
"use-client"
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Upload your file',
    description: 'Select and upload the document you want to print through our dashboard.',
  },
  {
    title: 'Choose preferences',
    description: 'Set your preferences like page size, color, and number of copies.',
  },
  {
    title: 'Make payment',
    description: 'Pay securely through the available payment methods.',
  },
  {
    title: 'Collect print',
    description: 'Visit the print station, scan your code, and collect your document.',
  },
];

export default function HowItWorksSteps() {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className="p-4 rounded-xl border border-neutral-700 bg-neutral-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <h3 className="text-xl font-semibold text-white mb-1 flex items-center">
            {step.title}
            <ArrowRight className="ml-2 w-5 h-5 text-primary" />
          </h3>
          <p className="text-neutral-400">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
