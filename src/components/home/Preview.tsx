"use client"
import Image from 'next/image';

export default function Preview() {
  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
      <Image
        src="/kampus.jpg"
        alt="Dashboard Preview"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="rounded-2xl object-cover"
      />
    </div>
  );
}