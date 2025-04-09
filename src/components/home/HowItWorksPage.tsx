"use-client"

import Preview from "./Preview";
import Steps from "./Steps";


export default function HowItWorksPage() {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Our streamlined process makes printing documents effortless. Follow these simple steps to skip the queue and save time.
          </p>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <Steps/>
          <Preview/>
        </div>
      </div>
    );
  }