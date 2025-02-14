import React, { useRef, useEffect } from 'react';
import {Canvas, useLoader} from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import R3FCanvas from '@/components/listing/View';

gsap.registerPlugin(ScrollTrigger);

function EarthGroup() {
  const earthRef = useRef();
  const [lightsMap] = useLoader(TextureLoader, ['/assets/earth/night-light.png']);
  const locationTexture = useLoader(TextureLoader, '/assets/location-sign.svg');

  useEffect(() => {
    if (!earthRef.current) return;
    gsap.to(earthRef.current.rotation, {
      x: Math.PI / 3,
      duration: 1.5,
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
      duration: 1.5,
      scrollTrigger: {
        trigger: '.earth-container',
        start: 'top bottom',
        scrub: 1,
      },
    });
  }, []);

  return (
    <group ref={earthRef} position={[0, -25, 0]}>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <sphereGeometry args={[11, 128, 128]} />
        <meshBasicMaterial map={lightsMap} color={0xffffff} />
      </mesh>
      <mesh position={[0, 12, -1]} rotation={[-Math.PI/6, 0, 0]}>
  <planeGeometry args={[1, 1]} />
  <meshBasicMaterial map={locationTexture} transparent={true} />
  <Text fontSize={0.2} color="black" anchorX="center" anchorY="middle" position={[0, -0.1, 0.01]}>
    NY
  </Text>
</mesh>

      
    </group>
  );
}

const NightEarth = () => {
 return (
    <>
    <section className='h-screen w-screen bg-black px-[5vw] py-[3vw]'>
      <div>
        <h1 className='text-[10vw] text-white flex flex-col leading-[1.2] font-medium'>
        <span >Innovate.</span>
        <span> Inspire. </span>
        <span>Ignite the Future.</span>
        </h1>
      </div> 
      <div className='flex items-end justify-end'>
        <p className='text-[1.5vw] text-white w-[30vw] '>Step into a world where creativity knows no bounds, ideas come to life, and possibilities are endless. Experience brilliance illuminated, as we craft a journey that pushes the limits of imagination and technology.
          </p>
          </div> 

    </section>
     <section className='w-screen h-screen '>
      <div className="w-full h-full relative earth-container bg-black">
        <Canvas>
          <ambientLight intensity={0.5} color={0xffffff} />
          <PerspectiveCamera makeDefault position={[0, -15, 30]} fov={45} near={1} far={1000} />
          <EarthGroup />
          {/* <OrbitControls/> */}
        </Canvas>
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[8vw] h-[8vw]  flex items-center justify-center text-xl font-bold">
        <Image src='/assets/earth/location.svg' alt='location' fill />
          <div className="absolute w-6 h-6 rounded-full flex items-start justify-center text-black left-[25%] top-[20%]">IN</div>
        </div> */}
      </div>
      </section>
      <section className='h-screen w-screen bg-black py-[5vw]'>
        <div className='relative w-full max-w-full overflow-x-hidden h-[15vw]'>
      <div className='marquee absolute'>
       <p className='text-[8vw] stroke-text font-medium'>CREATE</p>
       <p className='text-[8vw] stroke-text font-medium'>EXPLORE</p>
       <p className='text-[8vw] stroke-text font-medium'>BUILD</p>
       <p className='text-[8vw] stroke-text font-medium'>DESIGN</p>
       <p className='text-[8vw] stroke-text font-medium'>GROW</p>
       <p className='text-[8vw] stroke-text font-medium'>TRANSFORM</p>
       <p className='text-[8vw] stroke-text font-medium'>EMPOWER</p>
       <p className='text-[8vw] stroke-text font-medium'>CREATE</p>
       <p className='text-[8vw] stroke-text font-medium'>EXPLORE</p>
       <p className='text-[8vw] stroke-text font-medium'>BUILD</p>
       <p className='text-[8vw] stroke-text font-medium'>DESIGN</p>
       <p className='text-[8vw] stroke-text font-medium'>GROW</p>
       <p className='text-[8vw] stroke-text font-medium'>TRANSFORM</p>
       <p className='text-[8vw] stroke-text font-medium'>EMPOWER</p>
      </div>  
      </div>
      <div className='px-[5vw] w-[70%]'>
        <h2 className='text-[5vw] text-white leading-[1.2]'>
        Unleashing Creativity, Driving Innovation
        and Shaping the Future Together
        </h2>
        <p className='text-[1.5vw] w-[70%] text-white mt-[3vw]'>
        We believe in turning visions into reality with precision, passion, and purpose. Join us as we break barriers, embrace challenges, and shape tomorrow with every step we take today.
        </p>
      </div>

    </section>
    </>

  );
};

export default NightEarth;
