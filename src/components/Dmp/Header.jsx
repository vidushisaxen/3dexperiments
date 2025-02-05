import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-black text-white z-[999] p-4">
      <nav className="flex justify-center gap-8">
        {/* <Link href="/">
          <p className="hover:text-gray-300">Home</p>
        </Link> */}
        <Link href="/services">
          <p className="hover:text-gray-300">Services</p>
        </Link>
        <Link href="/contact">
          <p className="hover:text-gray-300">Contact</p>
        </Link>
        <Link href="/works">
          <p className="hover:text-gray-300">Works</p>
        </Link>
        <Link href="/portfolio">
          <p className="hover:text-gray-300">Portfolio</p>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
