import React, { useEffect, useState } from "react";

const Scrollbar = () => {
  const [thumbPosition, setThumbPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
     
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      
      const scrollableHeight = documentHeight - windowHeight;
      const thumbHeight = windowHeight * 0.2; 
      const thumbPositionPercentage = (scrollPosition / scrollableHeight) * 100;

      setThumbPosition(thumbPositionPercentage * (thumbHeight) / 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-[40%] right-0 w-2.5 bg-gray-400 rounded-lg cursor-pointer h-[20vh]">
      <div
        style={{ top: `${thumbPosition}%` }}
        className="w-full h-[3vh] bg-black rounded-sm absolute"
      ></div>
    </div>
  );
};

export default Scrollbar;
