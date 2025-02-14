import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import gsap from 'gsap';

const Header = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    // Run the animation before navigating
    gsap.to('.canvas-animation', {
      scale: 3,
      duration: 1,
      ease: 'power3.out',
      onComplete: () => {
        router.push(path);
      },
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black text-white z-[999] p-4">
      <nav className="flex justify-center gap-8">
        <p className="hover:text-gray-300 cursor-pointer" onClick={() => handleNavigation('/routecolor/route-color-change')}>
          Home
        </p>
        <p className="hover:text-gray-300 cursor-pointer" onClick={() => handleNavigation('/routecolor/services')}>
          Services
        </p>
        <p className="hover:text-gray-300 cursor-pointer" onClick={() => handleNavigation('/routecolor/contact')}>
          Contact
        </p>
        <p className="hover:text-gray-300 cursor-pointer" onClick={() => handleNavigation('/routecolor/works')}>
          Works
        </p>
        <p className="hover:text-gray-300 cursor-pointer" onClick={() => handleNavigation('/routecolor/portfolio')}>
          Portfolio
        </p>
      </nav>
    </header>
  );
};

export default Header;
