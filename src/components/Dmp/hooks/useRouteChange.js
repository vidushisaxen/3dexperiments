import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';

const useRouteChange = (delay = 0.5, duration = 1) => {
  const router = useRouter();
  const [scrollSpeed, setScrollSpeed] = useState(1);

  const routeColors = {
    '/routecolor/route-color-change': { baseBlue: [0.1, 0.3, 0.7], baseYellowGreen: [0.5, 0.8, 0.3] },
    '/routecolor/services': { baseBlue: [0.2, 0.4, 0.9], baseYellowGreen: [0.7, 0.4, 0.2] },
    '/routecolor/contact': { baseBlue: [0.5, 0.1, 0.2], baseYellowGreen: [0.2, 0.9, 0.6] },
    '/routecolor/about': { baseBlue: [0.0, 0.1, 0.2], baseYellowGreen: [0.2, 0.5, 0.6] },
    '/routecolor/works': { baseBlue: [0.5, 0.0, 0.6], baseYellowGreen: [0.8, 0.8, 0.0] },
    '/routecolor/portfolio': { baseBlue: [0.0, 0.8, 0.5], baseYellowGreen: [0.6, 0.8, 0.9] }
  };

  const getInitialColors = () => routeColors[router.pathname] || { baseBlue: [0.1, 0.1, 0.1], baseYellowGreen: [0.2, 0.2, 0.2] };

  const colorsRef = useRef(getInitialColors());
  const [colors, setColors] = useState(getInitialColors());

  useEffect(() => {
    const handleRouteChangeStart = () => {
      gsap.to('.canvas-animation', { scale: 3, duration: 2, ease: 'power3.out' });
    };

    const handleRouteChangeComplete = () => {
      gsap.to('.canvas-animation', { scale: 1, delay: 1, duration: 2, ease: 'power3.out' });

      const targetColors = routeColors[router.pathname] || { baseBlue: [0.1, 0.1, 0.1], baseYellowGreen: [0.2, 0.2, 0.2] };
      const proxy = {
        baseBlue0: colorsRef.current.baseBlue[0],
        baseBlue1: colorsRef.current.baseBlue[1],
        baseBlue2: colorsRef.current.baseBlue[2],
        baseYellowGreen0: colorsRef.current.baseYellowGreen[0],
        baseYellowGreen1: colorsRef.current.baseYellowGreen[1],
        baseYellowGreen2: colorsRef.current.baseYellowGreen[2],
      };

      gsap.to(proxy, {
        baseBlue0: targetColors.baseBlue[0],
        baseBlue1: targetColors.baseBlue[1],
        baseBlue2: targetColors.baseBlue[2],
        baseYellowGreen0: targetColors.baseYellowGreen[0],
        baseYellowGreen1: targetColors.baseYellowGreen[1],
        baseYellowGreen2: targetColors.baseYellowGreen[2],
        duration: duration,
        ease: "power2.inOut",
        onUpdate: () => {
          const newColors = {
            baseBlue: [proxy.baseBlue0, proxy.baseBlue1, proxy.baseBlue2],
            baseYellowGreen: [proxy.baseYellowGreen0, proxy.baseYellowGreen1, proxy.baseYellowGreen2],
          };
          colorsRef.current = newColors;
          setColors(newColors);
        }
      });
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      gsap.killTweensOf('.canvas-animation');
    };
  }, [router, delay, duration]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const normalizedScroll = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      const speed = Math.min(Math.max(normalizedScroll * 10, 1), 10);
      setScrollSpeed(speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { colors, scrollSpeed };
};

export default useRouteChange;
