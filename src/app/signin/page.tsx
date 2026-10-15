"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      {/* Main Heading */}
      <h2 className="text-4xl font-extrabold text-white mb-10 tracking-tight text-center">
        Welcome to Print Ease
      </h2>

      {/* Sign-in Card */}
      <div className="p-8 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-800 bg-opacity-0">
        <h1 className="text-2xl font-bold mb-8 text-white">Sign in to your account</h1>
        <button
          onClick={() => signIn("google", { redirectTo: "/Start" })}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full max-w-xs mx-auto"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" className="inline-block">
            <g>
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 33.1 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.6 6.6 29.6 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.8 0 20-8.7 20-20 0-1.3-.1-2.7-.3-4z" />
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13.5 24 13.5c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.6 6.6 29.6 4.5 24 4.5c-6.7 0-12.5 3.7-15.7 9.2z" />
              <path fill="#FBBC05" d="M24 45.5c5.7 0 10.6-1.9 14.1-5.2l-6.5-5.3c-2.1 1.4-4.8 2.2-7.6 2.2-5.7 0-10.5-3.9-12.2-9.1l-7 5.4C7.5 41.1 15.1 45.5 24 45.5z" />
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-3.7 5.6-7.2 6.9l7 5.4c4.1-3.8 6.5-9.4 6.5-16.1 0-1.3-.1-2.7-.3-4z" />
            </g>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
