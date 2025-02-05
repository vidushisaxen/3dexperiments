import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

function EarthGroup() {
  const earthRef = useRef();
  const [lightsMap] = useLoader(TextureLoader, ['/assets/earth/night-light.png']);

  useEffect(() => {
    if (!earthRef.current) return;
    gsap.to(earthRef.current.rotation, {
      x: Math.PI/3, 
      duration:1.5,
      scrollTrigger: {
        trigger: '.earth-container',
        start: 'top bottom',
        scrub: 1,
        
      },
    });
    gsap.to(earthRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration:1.5,
      scrollTrigger: {
        trigger: '.earth-container',
        start: 'top bottom',
        scrub: 1,
      },
    });
  }, []);

  return (
    <group ref={earthRef} position={[0, -25, 0]}>
      <mesh rotation={[Math.PI/4, Math.PI/4, 0]}>
        <sphereGeometry args={[11, 128, 128]} />
        <meshBasicMaterial map={lightsMap} color={0xffffff} />
      </mesh>
    </group>
  );
}

const NightEarth = () => {
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <h2 className="text-[5vw] text-white">Section 1</h2>
      </div>
      <div className="w-screen h-screen relative earth-container">
        <Canvas>
          <ambientLight intensity={0.5} color={0xffffff} />
          <PerspectiveCamera makeDefault position={[0, -15, 30]} fov={45} near={1} far={1000} />
          <EarthGroup />
        </Canvas>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[8vw] h-[8vw]  flex items-center justify-center text-xl font-bold">
        <Image src='/assets/earth/location.svg' alt='location' fill />
          <div className="absolute w-6 h-6 rounded-full flex items-start justify-center text-black left-[25%] top-[20%]">IN</div>
        </div>
      </div>
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <h2 className="text-[5vw] text-white">Section 3</h2>
      </div>
    </>
  );
};

export default NightEarth;
