'use client';

import { useEffect, useState } from 'react';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    // Optional: handle window resize or scroll logic here
  }, []);

  return (
    <section id="header" className="bg-neutral-900 text-white">
      <header className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-white">
              PrintEase<span className="text-[#6C63FF]">.</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['Home', 'Features', 'How It Works', 'Benefits', 'Testimonials', 'Pricing', 'FAQ', 'Contact'].map(label => (
              <a
                key={label}
                href="#"
                className="text-white hover:text-[#00E0FF] transition-colors duration-300"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              // Close icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-neutral-800 mt-4">
            <nav className="flex flex-col space-y-4">
              {['Home', 'Features', 'How It Works', 'Benefits', 'Testimonials', 'Pricing', 'FAQ', 'Contact'].map(label => (
                <a
                  key={label}
                  href="#"
                  onClick={closeMenu}
                  className="text-white hover:text-[#00E0FF] transition-colors duration-300"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    </section>
  );
}
