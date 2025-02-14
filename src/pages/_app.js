import "@/styles/globals.css";
import { useEffect } from "react";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  return (
   <>
      {/* <Header /> */}
      <Component {...pageProps} />
      </>
  );
}

const Header = () => (
  <header className="w-screen h-fit py-[2vw] px-[3vw] bg-transparent fixed top-0 left-0 z-[999]">
    <Link href={"/"}>
      <div>
        <img
          src="/assets/en-logo.svg"
          alt="enigma-logo"
          height={50}
          width={50}
          className=" header-logo transparent"
        />
      </div>
    </Link>
  </header>
);

const Footer = () => (
  <footer className="w-screen h-fit py-[1vw] px-[3vw] bg-[#000000]">
    <Link href={"/"}>
      <div className="flex justify-between items-center">
        <p className="text-white text-[1vw]">By: Enigma</p>
        <p className="text-white text-[1vw]">
          © 2025 Enigma Digital Consulting, LLP. All Rights Reserved. All Wrongs
          Reversed.
        </p>
      </div>
    </Link>
  </footer>
);
