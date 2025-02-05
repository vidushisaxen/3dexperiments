/* eslint-disable react-hooks/rules-of-hooks */
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitInWord } from "./splitTextUtils";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

gsap.config({
  nullTargetWarn: false
})

export function paraAnim() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const paraAnimations = document.querySelectorAll(".para");
      paraAnimations.forEach((paraAnimation) => {
        SplitInWord(paraAnimation);
        const paraLine = paraAnimation.querySelectorAll(".word");
        gsap.from(paraLine, {
          scrollTrigger: {
            trigger: paraAnimation,
            start: "top 80%",
          },
          opacity: 0,
          filter:'blur(10px)',
          yPercent: 100,
          skewY:5,
          duration: 1,
          stagger: 0.05,
        });
      });
    });
    return () => ctx.revert();
  }, []);
}




