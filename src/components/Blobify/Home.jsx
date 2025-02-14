"use client";
import { useEffect, useState } from "react";
import SphereCanvas from "./SphereCanvas";
import useUsefulHooks from "./hooks/useWheel";
import { pages } from "./Text/data";
import { Providers } from "./providers";

const Home = () => {
  const [current, setCurrent] = useState(0);
  const { prevPage, nextPage, lastAction } = useUsefulHooks();

  useEffect(() => {
    if (lastAction) {
      if (lastAction === "next") {
        if (current === pages.length - 1) {
          setCurrent(0);
        } else {
          setCurrent((next) => Math.max(0, Math.min(pages.length - 1, next + 1)));
          
        }
        console.log("next");
      }
      if (lastAction === "prev") {
        if (current === 0) {
          // setCurrent(pages.length - 1);
          setCurrent((prev) => Math.max(0, Math.min(pages.length - 1, prev + 1)));
        }
         else {
          setCurrent((prev) => Math.max(0, Math.min(pages.length - 1, prev + 1)));
         }
        console.log("prev");
      }
    }
  }, [prevPage, nextPage]);
  return (
    <main className="w-full h-screen relative ">
      <SphereCanvas current={current} setCurrent={setCurrent} />
    </main>
  );
};

export default Home;
