"use client";

import Link from 'next/link';
import SignIn from './sign-in';
import { usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function NavbarComponent() {
  
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="border-b bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            InstaPrint
          </Link>
          <div className="flex gap-8 items-center">
            <Link 
              href="/"
              className={`${pathname === '/' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
            >
              Home
            </Link>
            <Link 
              href="/my-prints"
              className={`${pathname === '/my-prints' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
            >
              My Prints
            </Link>
            <SignIn />
         
          </div>
        </div>
      </div>
    </nav>
  );
}