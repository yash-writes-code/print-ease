"use-client"
import Image from 'next/image';

export default function Preview() {
  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
      <Image
        src="/dropfile.png"
        alt="Dashboard Preview"
        layout="fill"
        objectFit="cover"
        className="rounded-2xl"
      />
    </div>
  );
}
